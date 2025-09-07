import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, role, text } = await req.json();

    // Validate required fields
    if (!sessionId || !role || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, role, text' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['user', 'assistant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "assistant"' },
        { status: 400 }
      );
    }

    // Get admin Supabase client
    const supabase = getSupabaseAdmin();

    // Insert into conversation_turns table
    const { data, error } = await supabase
      .from('conversation_turns')
      .insert({
        session_id: sessionId,
        role,
        text,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting conversation turn:', error);
      return NextResponse.json(
        { error: 'Failed to log conversation turn' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      id: data.id 
    });

  } catch (error) {
    console.error('Error in log-turn API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
