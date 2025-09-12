import { NextRequest, NextResponse } from 'next/server';
import { checkApiKey } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('[default-clinician-email] API call started');
    
    if (!checkApiKey(req)) {
      console.log('[default-clinician-email] Unauthorized request - missing or invalid API key');
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      console.log('[default-clinician-email] Validation failed - missing userId parameter');
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Missing required parameter: userId' 
        },
        { status: 400 }
      );
    }

    console.log('[default-clinician-email] Looking up default email for userId:', userId);

    const supabase = getSupabaseAdmin();
    const { data: userProfile, error } = await supabase
      .from('profiles')
      .select('default_clinician_email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[default-clinician-email] Database error:', error);
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Failed to lookup user profile' 
        },
        { status: 500 }
      );
    }

    const hasDefault = !!userProfile?.default_clinician_email;
    const defaultEmail = userProfile?.default_clinician_email || null;

    console.log('[default-clinician-email] Lookup result:', { 
      userId, 
      hasDefault, 
      defaultEmail: defaultEmail ? '***@***.***' : null 
    });

    return NextResponse.json({
      ok: true,
      hasDefault,
      defaultEmail,
      userId
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const truncatedError = errorMessage.length > 200 ? errorMessage.substring(0, 200) + '...' : errorMessage;
    console.error('[default-clinician-email] Unexpected error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error', 
        details: truncatedError 
      },
      { status: 500 }
    );
  }
}
