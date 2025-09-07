import { NextRequest, NextResponse } from 'next/server';
import { classifySymptoms } from '@/src/domain/labels';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await classifySymptoms(text);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in labels API:', error);
    return NextResponse.json(
      { error: 'Failed to classify symptoms' },
      { status: 500 }
    );
  }
}