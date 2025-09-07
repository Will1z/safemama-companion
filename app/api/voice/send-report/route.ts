import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * ElevenLabs Webhook Endpoint for Voice Reports
 * 
 * Expected payload structure:
 * {
 *   "recipientEmail": "doctor@example.com",
 *   "summary": "Patient reported headache and vision changes. Blood pressure 150/95.",
 *   "patientName": "Sarah Johnson",
 *   "patientPhone": "+1234567890",
 *   "triageTier": 2,
 *   "timestamp": "2025-01-07T12:00:00Z",
 *   "conversationId": "conv_123456789",
 *   "audioUrl": "https://elevenlabs.io/audio/abc123.mp3"
 * }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log the incoming payload for debugging
    console.log("📩 Incoming Safemama payload:", JSON.stringify(body, null, 2));
    
    // Extract expected fields
    const {
      recipientEmail,
      summary,
      patientName,
      patientPhone,
      triageTier,
      timestamp,
      conversationId,
      audioUrl
    } = body;
    
    // Validate required fields
    if (!recipientEmail || !summary) {
      console.error("❌ Missing required fields:", { recipientEmail, summary });
      return NextResponse.json(
        { error: "Missing required fields: recipientEmail, summary" },
        { status: 400 }
      );
    }
    
    // Log the extracted data
    console.log("📋 Extracted data:", {
      recipientEmail,
      patientName: patientName || "Unknown",
      patientPhone: patientPhone || "Not provided",
      triageTier: triageTier || "Not specified",
      summary: summary.substring(0, 100) + (summary.length > 100 ? "..." : ""),
      timestamp,
      conversationId,
      hasAudio: !!audioUrl
    });
    
    // Here you would typically:
    // 1. Save the report to your database
    // 2. Send email notification to the clinician
    // 3. Process the audio file if needed
    // 4. Update patient records
    
    // For now, just log that we would process this
    console.log("✅ Webhook processed successfully");
    
    // Return success response to ElevenLabs
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: "ElevenLabs webhook endpoint is active",
    timestamp: new Date().toISOString()
  });
}
