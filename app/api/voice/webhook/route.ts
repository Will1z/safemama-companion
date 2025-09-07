import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log the webhook data for debugging
    console.log('ElevenLabs webhook received:', JSON.stringify(body, null, 2));
    
    // Handle different webhook events from ElevenLabs
    if (body.event === 'audio_generated') {
      // Handle audio generation completion
      console.log('Audio generated:', body.audio_url);
      
      // You can process the audio here or store it
      // For now, just acknowledge receipt
      return NextResponse.json({ 
        status: 'received',
        message: 'Audio generation webhook processed' 
      });
    }
    
    if (body.event === 'conversation_started') {
      // Handle conversation start
      console.log('Conversation started:', body.conversation_id);
      
      return NextResponse.json({ 
        status: 'received',
        message: 'Conversation start webhook processed' 
      });
    }
    
    if (body.event === 'conversation_ended') {
      // Handle conversation end
      console.log('Conversation ended:', body.conversation_id);
      
      return NextResponse.json({ 
        status: 'received',
        message: 'Conversation end webhook processed' 
      });
    }
    
    // Default response for unknown events
    return NextResponse.json({ 
      status: 'received',
      message: 'Webhook processed' 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'ElevenLabs webhook endpoint is active' 
  });
}
