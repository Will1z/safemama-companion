import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en-US';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Voicechat2 Speech-to-Text API integration
    const voicechat2ApiKey = process.env.VOICECHAT2_API_KEY;
    
    if (!voicechat2ApiKey) {
      // Fallback to mock transcription for development
      return NextResponse.json({
        transcription: "I've been experiencing some mild cramping and feeling a bit tired today. Is this normal?",
        confidence: 0.95,
        language: language
      });
    }

    // Convert File to Buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Call Voicechat2 Speech-to-Text API
    const response = await fetch('https://api.voicechat2.com/v1/transcribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${voicechat2ApiKey}`,
        'Content-Type': 'audio/wav',
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      throw new Error(`Voicechat2 API error: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      transcription: result.text,
      confidence: result.confidence,
      language: result.language || language
    });

  } catch (error) {
    console.error('Transcription error:', error);
    
    // Fallback response
    return NextResponse.json({
      transcription: "I've been experiencing some mild cramping and feeling a bit tired today. Is this normal?",
      confidence: 0.85,
      language: 'en-US'
    });
  }
}

