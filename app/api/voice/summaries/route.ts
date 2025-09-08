import { NextRequest, NextResponse } from 'next/server';
import { checkApiKey } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    // Enforce API key security
    if (!checkApiKey(req)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const after = searchParams.get('after');
    const before = searchParams.get('before');
    const limitParam = searchParams.get('limit');

    // Validate and set limit
    const limit = Math.min(
      limitParam ? parseInt(limitParam, 10) : 200,
      1000
    );

    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { ok: false, error: 'Invalid limit parameter' },
        { status: 400 }
      );
    }

    // Validate date parameters
    if (after && isNaN(Date.parse(after))) {
      return NextResponse.json(
        { ok: false, error: 'Invalid after date format' },
        { status: 400 }
      );
    }

    if (before && isNaN(Date.parse(before))) {
      return NextResponse.json(
        { ok: false, error: 'Invalid before date format' },
        { status: 400 }
      );
    }

    // Create Supabase admin client
    const supabase = getSupabaseAdmin();

    // Build query
    let query = supabase
      .from('conversation_summaries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply filters
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (after) {
      query = query.gte('created_at', after);
    }

    if (before) {
      query = query.lte('created_at', before);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { ok: false, error: 'Database query failed' },
        { status: 500 }
      );
    }

    // Prepare response
    const filters = {
      sessionId: sessionId || null,
      userId: userId || null,
      after: after || null,
      before: before || null,
      limit
    };

    return NextResponse.json({
      ok: true,
      count: data?.length || 0,
      items: data || [],
      filters
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
