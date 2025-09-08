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
    const sessionId = searchParams.get('sessionId') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const after = searchParams.get('after') || undefined;
    const before = searchParams.get('before') || undefined;
    const limitParam = searchParams.get('limit');
    const format = searchParams.get('format') || 'json';

    // Validate limit parameter
    let limit = 200; // default
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

    // Build query
    let query = supabase
      .from('conversation_turns')
      .select('session_id, user_id, role, content, created_at')
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
      console.error('Error querying conversation turns:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch conversation logs' },
        { status: 500 }
      );
    }

    const items = data || [];

    // Prepare filters object for response
    const filters: Record<string, string> = {};
    if (sessionId) filters.sessionId = sessionId;
    if (userId) filters.userId = userId;
    if (after) filters.after = after;
    if (before) filters.before = before;
    if (limitParam) filters.limit = limitParam;

    // Return response based on format
    if (format === 'csv') {
      // Generate CSV
      const headers = ['session_id', 'user_id', 'role', 'content', 'created_at'];
      const csvRows = [headers.join(',')];
      
      for (const item of items) {
        const row = [
          item.session_id || '',
          item.user_id || '',
          item.role || '',
          `"${(item.content || '').replace(/"/g, '""')}"`, // Escape quotes in content
          item.created_at || ''
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="conversation_logs_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else {
      // Return JSON
      return NextResponse.json({
        ok: true,
        count: items.length,
        items,
        filters
      });
    }

  } catch (error) {
    console.error('Error in conversations API:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
