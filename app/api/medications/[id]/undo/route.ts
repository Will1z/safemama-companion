import { NextRequest, NextResponse } from 'next/server';
import { undoLatestIntake, getMedicationsWithStatus } from '@/lib/medications';
import { checkApiKey } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check API key if present
    if (!checkApiKey(request)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const medicationId = params.id;
    if (!medicationId) {
      return NextResponse.json({ error: 'medication ID required' }, { status: 400 });
    }

    // Get user ID from query params or headers
    const userId = request.nextUrl.searchParams.get('userId') || 
                   request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Get user timezone from request body or query params
    const body = await request.json().catch(() => ({}));
    const userTimezone = body.tz || request.nextUrl.searchParams.get('tz');

    // Undo latest intake
    await undoLatestIntake(userId, medicationId);

    // Get updated medication status
    const medications = await getMedicationsWithStatus(userId, userTimezone || undefined);
    const updatedMedication = medications.find(med => med.id === medicationId);

    if (!updatedMedication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      medication: updatedMedication
    });

  } catch (error) {
    console.error('Error undoing medication intake:', error);
    return NextResponse.json(
      { error: 'Failed to undo medication intake' },
      { status: 500 }
    );
  }
}
