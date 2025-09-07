import { NextRequest, NextResponse } from "next/server";
import { summarizeTranscript } from "@/lib/summary";
import { triage } from "@/lib/triage";
import { clinicianEmail } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

// Initialize Supabase client (with fallback for development)
let supabase: any = null;
try {
  supabase = getSupabaseAdmin();
} catch (error) {
  console.warn('Supabase not configured, using mock mode:', error);
}

// TODO: Replace with your real auth/user fetch
async function getUser() {
  // For now, return a demo user. In production, get from auth context
  return { 
    id: "demo-user-" + Date.now(), 
    name: "Sarah Johnson", 
    weeks: 24, 
    phone: "+1-555-0123" 
  };
}

// Save to Supabase (with fallback for development)
async function saveReport(payload: any) {
  if (!supabase) {
    // Mock mode - just return a fake ID
    console.log('Mock mode: Report would be saved:', payload);
    return { id: 'mock-report-' + Date.now() };
  }
  
  const { data, error } = await supabase
    .from("reports")
    .insert(payload)
    .select("id")
    .single();
  
  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  
  return { id: data.id };
}

// Send email using Resend
async function sendEmail(to: string, subject: string, body: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_key') {
    console.warn("No email provider configured. Skipping clinician email.");
    console.log('Mock mode: Email would be sent:', { to, subject, body });
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || "no-reply@safemama.app",
        to: [to],
        subject: subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send error:', error);
      throw new Error(`Email send failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw - we don't want email failures to break the report saving
  }
}

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    
    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
    }

    // Process the transcript
    const summary = summarizeTranscript(transcript);
    const triageRes = triage(`${summary.chiefConcern}. ${summary.keyPoints.join(". ")}. ${transcript}`);

    // Get user info
    const user = await getUser();

    // Save to database
    const saved = await saveReport({
      user_id: user.id,
      transcript,
      summary,
      triage: triageRes,
      created_at: new Date().toISOString(),
    });

    // Notify clinician for Tier >= 2
    if (triageRes.tier >= 2) {
      const emailBody = clinicianEmail({
        patient: { 
          id: user.id, 
          name: user.name, 
          weeks: user.weeks, 
          phone: user.phone 
        },
        summary: { ...summary, transcript },
        triage: triageRes,
        when: new Date().toISOString(),
      });

      const to = process.env.CLINICIAN_EMAIL!;
      const subject = `Patient check-in — Tier ${triageRes.tier}`;
      
      await sendEmail(to, subject, emailBody);
    }

    return NextResponse.json({ 
      id: saved.id, 
      triage: triageRes, 
      summary 
    });

  } catch (error) {
    console.error('Error in report ingest:', error);
    return NextResponse.json(
      { error: "Failed to process report" },
      { status: 500 }
    );
  }
}
