import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { checkApiKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!checkApiKey(req)) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get('sessionId');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!sessionId && !userId) {
      return NextResponse.json(
        { ok: false, error: 'Either sessionId or userId is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    let userContext = null;

    // If userId is provided directly, use it
    let targetUserId = userId;
    
    // If only sessionId is provided, try to find the most recent userId for this session
    if (!targetUserId && sessionId) {
      const { data: recentTurn } = await supabase
        .from('conversation_turns')
        .select('user_id')
        .eq('session_id', sessionId)
        .not('user_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      targetUserId = recentTurn?.user_id;
    }

    if (targetUserId) {
      try {
        // Get user profile information
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, display_name, phone')
          .eq('id', targetUserId)
          .single();

        // Get pregnancy status if available
        const { data: pregnancyStatus } = await supabase
          .from('pregnancy_status_v')
          .select('weeks_pregnant, days_to_due')
          .eq('user_id', targetUserId)
          .single();

        if (profile || pregnancyStatus) {
          userContext = {
            name: profile?.full_name || profile?.display_name || 'Patient',
            phone: profile?.phone,
            weeks: pregnancyStatus?.weeks_pregnant,
            daysToDue: pregnancyStatus?.days_to_due,
            userId: targetUserId
          };
        }
      } catch (error) {
        console.warn('Could not fetch user context:', error);
      }
    }

    return NextResponse.json({ 
      ok: true, 
      userContext,
      sessionId,
      userId: targetUserId
    });

  } catch (error) {
    console.error('Error in user-context API:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
