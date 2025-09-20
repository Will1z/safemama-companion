import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { checkApiKey } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { medicationId: string } }
) {
  try {
    // Check API key for authentication
    const apiKeyResult = checkApiKey(req);
    if (!apiKeyResult.ok) {
      return NextResponse.json({
        ok: false,
        error: 'Unauthorized'
      }, { status: apiKeyResult.status });
    }

    const { medicationId } = params;

    if (!medicationId) {
      return NextResponse.json({
        ok: false,
        error: 'medicationId is required'
      }, { status: 400 });
    }

    // Get the latest intake for this medication
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('medication_intakes')
      .select('id, taken_at')
      .eq('medication_id', medicationId)
      .order('taken_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Error fetching medication intakes:', error);
      return NextResponse.json({
        ok: false,
        error: 'Failed to fetch medication intakes'
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      lastIntake: data || null
    });

  } catch (error) {
    console.error('Error in intakes API:', error);
    return NextResponse.json({
      ok: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
