import { NextRequest, NextResponse } from 'next/server';
import { classifySymptoms } from '@/src/domain/labels';
import { runTriageRules, shouldOpenCase, calculateGestationalWeeks } from '@/src/domain/triage';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const {
      text,
      labels: providedLabels,
      bp,
      temp_c,
      weeks,
      risk_flags,
      lat,
      lng,
      pregnancy_id,
      user_id
    } = await request.json();

    // Get labels from OpenAI if text provided but no labels
    let labels = providedLabels;
    if (text && !labels) {
      const labelResult = await classifySymptoms(text);
      labels = labelResult.labels;
    }

    // Run triage rules
    const triageResult = runTriageRules({
      text,
      labels,
      bp,
      temp_c, 
      weeks,
      risk_flags,
      lat,
      lng
    });

    // Store symptom report if user_id and pregnancy_id provided
    if (user_id && pregnancy_id) {
      await supabase
        .from('symptoms')
        .insert({
          user_id,
          pregnancy_id,
          raw_text: text || '',
          labels: labels || [],
          tier: triageResult.tier,
          advice: triageResult.action,
          reasons: triageResult.reasons
        });

      // Check if we should open a case
      if (triageResult.tier >= 2) {
        // Check for share consent
        const { data: consent } = await supabase
          .from('consent')
          .select('granted')
          .eq('user_id', user_id)
          .eq('kind', 'share')
          .single();

        const hasConsent = consent?.granted || false;
        
        if (shouldOpenCase(triageResult.tier, hasConsent)) {
          // Create a new case
          const { data: newCase } = await supabase
            .from('cases')
            .insert({
              patient_id: user_id,
              pregnancy_id,
              tier: triageResult.tier,
              lat,
              lng,
              summary: `${triageResult.action} - ${triageResult.reasons.join(', ')}`
            })
            .select()
            .single();

          return NextResponse.json({
            ...triageResult,
            case_id: newCase?.id
          });
        }
      }
    }

    return NextResponse.json(triageResult);
  } catch (error) {
    console.error('Error in triage API:', error);
    return NextResponse.json(
      { error: 'Failed to process triage' },
      { status: 500 }
    );
  }
}