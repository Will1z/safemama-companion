import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { checkApiKey } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check API key for authentication
    const apiKeyResult = checkApiKey(req);
    if (!apiKeyResult.ok) {
      return NextResponse.json({
        ok: false,
        error: 'Unauthorized'
      }, { status: apiKeyResult.status });
    }

    const body = await req.json();
    const { medicationId, undo = false } = body;

    if (!medicationId) {
      return NextResponse.json({
        ok: false,
        error: 'medicationId is required'
      }, { status: 400 });
    }

    // For demo mode (no session), return success
    if (!req.headers.get('authorization')) {
      return NextResponse.json({
        ok: true,
        demo: true,
        medicationId,
        undo
      });
    }

    // Authenticated path - use Supabase
    const supabase = getSupabaseAdmin();
    
    if (undo) {
      // Remove the latest intake for this medication
      const { error } = await supabase
        .from('medication_intakes')
        .delete()
        .eq('medication_id', medicationId)
        .order('taken_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error undoing medication intake:', error);
        return NextResponse.json({
          ok: false,
          error: 'Failed to undo medication intake'
        }, { status: 500 });
      }
    } else {
      // Mark medication as taken
      const { data, error } = await supabase
        .from('medication_intakes')
        .insert({
          medication_id: medicationId,
          taken_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error marking medication as taken:', error);
        return NextResponse.json({
          ok: false,
          error: 'Failed to mark medication as taken'
        }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        medicationId,
        undo,
        intakeId: data.id
      });
    }

    return NextResponse.json({
      ok: true,
      medicationId,
      undo
    });

  } catch (error) {
    console.error('Error in mark-taken API:', error);
    return NextResponse.json({
      ok: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
