import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkApiKey } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Check API key
    const apiKeyResult = await checkApiKey(req);
    if (!apiKeyResult.ok) {
      return NextResponse.json(apiKeyResult, { status: 401 });
    }

    // Get userId from query params
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        // No rows found
        return NextResponse.json({ ok: true, data: null });
      }
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    // Fetch pregnancy status
    const { data: status, error: statusError } = await supabase
      .from('pregnancy_status_v')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statusError) {
      console.error('Error fetching pregnancy status:', statusError);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch pregnancy status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        userId: profile.user_id,
        dueDate: profile.due_date,
        lmpDate: profile.lmp_date,
        timezone: profile.timezone,
        gaWeeks: status?.ga_weeks || null,
        trimester: status?.trimester || null,
        effectiveDueDate: status?.effective_due_date || null,
        daysToDue: status?.days_to_due || null
      }
    });

  } catch (error) {
    console.error('Unexpected error in pregnancy GET API:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check API key
    const apiKeyResult = await checkApiKey(req);
    if (!apiKeyResult.ok) {
      return NextResponse.json(apiKeyResult, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { userId, dueDate, lmpDate, timezone } = body;

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Prepare upsert data
    const upsertData: any = {
      user_id: userId
    };

    if (dueDate !== undefined) upsertData.due_date = dueDate;
    if (lmpDate !== undefined) upsertData.lmp_date = lmpDate;
    if (timezone !== undefined) upsertData.timezone = timezone;

    // Upsert into user_profiles
    const { error: upsertError } = await supabase
      .from('user_profiles')
      .upsert(upsertData);

    if (upsertError) {
      console.error('Error upserting user profile:', upsertError);
      return NextResponse.json(
        { ok: false, error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    // Fetch updated pregnancy status
    const { data: status, error: statusError } = await supabase
      .from('pregnancy_status_v')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statusError) {
      console.error('Error fetching updated pregnancy status:', statusError);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch updated pregnancy status' },
        { status: 500 }
      );
    }

    // Fetch updated profile for complete data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching updated profile:', profileError);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch updated profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        userId: profile.user_id,
        dueDate: profile.due_date,
        lmpDate: profile.lmp_date,
        timezone: profile.timezone,
        gaWeeks: status?.ga_weeks || null,
        trimester: status?.trimester || null,
        effectiveDueDate: status?.effective_due_date || null,
        daysToDue: status?.days_to_due || null
      }
    });

  } catch (error) {
    console.error('Unexpected error in pregnancy POST API:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
