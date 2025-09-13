import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { checkApiKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!checkApiKey(req)) {
      return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });
    }

    const { sessionId, role, text, lang, userId, meta } = await req.json();

    // Validate required fields
    if (!sessionId || !role || !text) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: sessionId, role, text' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['user', 'assistant'].includes(role)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid role. Must be "user" or "assistant"' },
        { status: 400 }
      );
    }

    // Get admin Supabase client
    const supabase = getSupabaseAdmin();

    // Prepare metadata object
    const metadata = { ...meta };
    if (lang) {
      metadata.lang = lang;
    }

    // If userId is provided, fetch user context for better conversation tracking
    let userContext = null;
    if (userId) {
      try {
        // Get user profile information
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, display_name, phone')
          .eq('id', userId)
          .single();

        // Get pregnancy status if available
        const { data: pregnancyStatus } = await supabase
          .from('pregnancy_status_v')
          .select('weeks_pregnant, days_to_due')
          .eq('user_id', userId)
          .single();

        if (profile || pregnancyStatus) {
          userContext = {
            name: profile?.full_name || profile?.display_name || 'Patient',
            phone: profile?.phone,
            weeks: pregnancyStatus?.weeks_pregnant,
            daysToDue: pregnancyStatus?.days_to_due
          };
          
          // Add user context to metadata
          metadata.userContext = userContext;
        }
      } catch (error) {
        console.warn('Could not fetch user context:', error);
        // Continue without user context rather than failing
      }
    }

    // Insert into conversation_turns table
    const { error } = await supabase
      .from('conversation_turns')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role,
        content: text,
        meta: metadata
      });

    if (error) {
      console.error('Error inserting conversation turn:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to log conversation turn' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error in log-turn API:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
