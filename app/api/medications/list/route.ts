import { NextRequest, NextResponse } from 'next/server';
import { getMedicationsWithStatus } from '@/lib/medications';
import { checkApiKey } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check API key if present
    if (!checkApiKey(request)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Get user ID from query params or headers
    const userId = request.nextUrl.searchParams.get('userId') || 
                   request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // For demo mode (no session), return empty medications list
    if (!request.headers.get('authorization')) {
      return NextResponse.json({
        success: true,
        medications: [],
        demo: true
      });
    }

    // Get user timezone from query params
    const userTimezone = request.nextUrl.searchParams.get('tz');

    // Fetch medications with computed status
    const medications = await getMedicationsWithStatus(userId, userTimezone || undefined);

    return NextResponse.json({
      success: true,
      medications
    });

  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}
