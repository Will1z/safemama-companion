import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { checkApiKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // API key security check
    if (!checkApiKey(req)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const userId = searchParams.get('userId') || undefined;
    const after = searchParams.get('after') || undefined;
    const before = searchParams.get('before') || undefined;
    const limitParam = searchParams.get('limit');
    const rowCapParam = searchParams.get('rowCap');
    const format = searchParams.get('format') || 'json';

    // Validate limit parameter
    let limit = 100; // default
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          { ok: false, error: 'Invalid limit parameter. Must be a positive integer.' },
          { status: 400 }
        );
      }
      limit = Math.min(parsedLimit, 1000); // max 1000
    }

    // Validate rowCap parameter
    let rowCap = 5000; // default
    if (rowCapParam) {
      const parsedRowCap = parseInt(rowCapParam, 10);
      if (isNaN(parsedRowCap) || parsedRowCap < 1) {
        return NextResponse.json(
          { ok: false, error: 'Invalid rowCap parameter. Must be a positive integer.' },
          { status: 400 }
        );
      }
      rowCap = Math.min(parsedRowCap, 20000); // max 20000
    }

    // Validate format parameter
    if (!['json', 'csv'].includes(format)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid format parameter. Must be "json" or "csv".' },
        { status: 400 }
      );
    }

    // Validate date parameters
    if (after && isNaN(Date.parse(after))) {
      return NextResponse.json(
        { ok: false, error: 'Invalid after parameter. Must be a valid ISO datetime string.' },
        { status: 400 }
      );
    }

    if (before && isNaN(Date.parse(before))) {
      return NextResponse.json(
        { ok: false, error: 'Invalid before parameter. Must be a valid ISO datetime string.' },
        { status: 400 }
      );
    }

    // Get admin Supabase client
    const supabase = getSupabaseAdmin();

    // Build query to fetch raw conversation turns
    let query = supabase
      .from('conversation_turns')
      .select('session_id, user_id, role, content, created_at')
      .order('created_at', { ascending: false })
      .limit(rowCap);

    // Apply filters
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
    const { data, error } = await query;

    if (error) {
      console.error('Error querying conversation turns:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch conversation data' },
        { status: 500 }
      );
    }

    const rows = data || [];

    // Reduce rows to session summaries using Map
    const sessionMap = new Map<string, {
      session_id: string;
      message_count: number;
      last_time: string;
      last_role: string;
      last_message: string;
      user_id: string | null;
      first_time: string;
    }>();

    for (const row of rows) {
      const sessionId = row.session_id;
      
      if (!sessionMap.has(sessionId)) {
        // First row for this session (most recent due to DESC order)
        sessionMap.set(sessionId, {
          session_id: sessionId,
          message_count: 1,
          last_time: row.created_at,
          last_role: row.role,
          last_message: row.content || '',
          user_id: row.user_id,
          first_time: row.created_at
        });
      } else {
        // Update existing session data
        const session = sessionMap.get(sessionId)!;
        session.message_count++;
        
        // Update first_time (minimum created_at for this session)
        if (row.created_at < session.first_time) {
          session.first_time = row.created_at;
        }
        
        // Update user_id if current row has one and we don't
        if (row.user_id && !session.user_id) {
          session.user_id = row.user_id;
        }
      }
    }

    // Convert Map to array and sort by last_time DESC
    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.last_time).getTime() - new Date(a.last_time).getTime())
      .slice(0, limit);

    // Prepare filters object for response
    const filters: Record<string, string | number> = {};
    if (userId) filters.userId = userId;
    if (after) filters.after = after;
    if (before) filters.before = before;
    filters.limit = limit;
    filters.rowCap = rowCap;

    // Return response based on format
    if (format === 'csv') {
      // Generate CSV
      const headers = ['session_id', 'user_id', 'message_count', 'first_time', 'last_time', 'last_role', 'last_message'];
      const csvRows = [headers.join(',')];
      
      for (const session of sessions) {
        const row = [
          session.session_id || '',
          session.user_id || '',
          session.message_count.toString(),
          session.first_time || '',
          session.last_time || '',
          session.last_role || '',
          `"${(session.last_message || '').replace(/"/g, '""').replace(/\n/g, '\\n')}"` // Escape quotes and newlines
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="conversation_summaries_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else {
      // Return JSON
      return NextResponse.json({
        ok: true,
        count: sessions.length,
        items: sessions.map(session => ({
          session_id: session.session_id,
          user_id: session.user_id,
          message_count: session.message_count,
          first_time: session.first_time,
          last_time: session.last_time,
          last_role: session.last_role as 'user' | 'assistant',
          last_message: session.last_message
        })),
        filters
      });
    }

  } catch (error) {
    console.error('Error in conversations summary API:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
