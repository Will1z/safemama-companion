import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Twilio } from 'twilio';
import { render } from '@react-email/render';
import ClinicianSummaryEmail from '@/emails/ClinicianSummaryEmail';
import { checkApiKey } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function log(event: string, extra: Record<string, any> = {}) {
  console.info(JSON.stringify({ svc:'send-report', event, ts:new Date().toISOString(), ...extra }));
}

export async function POST(req: NextRequest) {
  try {
    log('precheck', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasFromEmail: !!process.env.FROM_EMAIL,
      dryRun: process.env.SAFE_DRY_RUN === 'true',
      hasApiKeyHeader: !!req.headers.get('x-api-key')
    });
    
    // Check API key first
    const apiKeyResult = checkApiKey(req);
    if (!apiKeyResult.ok) {
      const friendlyMessage = apiKeyResult.reason === 'missing_header'
        ? 'Authorization header (x-api-key) is missing.'
        : apiKeyResult.reason === 'bad_key'
        ? 'The provided API key is invalid.'
        : 'Server is not configured with an API key.';
      
      return NextResponse.json({
        ok: false,
        code: 'AUTH_FAILED',
        reason: apiKeyResult.reason,
        message: friendlyMessage,
        friendly: 'I could not send the report because the connection was not authorized. Please try again, or ask me to "send to my doctor" once more.',
      }, { status: apiKeyResult.status });
    }

    // Validate required environment variables
    const missingEnv = ['RESEND_API_KEY', 'FROM_EMAIL'].filter(k => !process.env[k]);
    if (missingEnv.length) {
      return NextResponse.json({
        ok: false,
        code: 'SERVER_MISCONFIG',
        missingEnv,
        message: `Missing server configuration: ${missingEnv.join(', ')}`,
        friendly: 'I could not send the report because email isn\'t configured on the server yet.',
      }, { status: 500 });
    }

    const body = await req.json();
    
    // Validate required payload fields
    if (!body.recipientEmail || !body.summary) {
      return NextResponse.json({
        ok: false,
        code: 'BAD_REQUEST',
        message: 'recipientEmail and summary are required',
        friendly: 'I need your doctor\'s email and a short summary to send this.'
      }, { status: 400 });
    }
    
    log('payload-validated', {
      recipientEmail: body.recipientEmail ? '***@***.***' : 'MISSING',
      summary: body.summary ? `${body.summary.length} chars` : 'MISSING',
      patientName: body.patientName || 'not provided',
      patientPhone: body.patientPhone || 'not provided',
      whatsappNumber: body.whatsappNumber || 'not provided',
      sessionId: body.sessionId || 'not provided',
      userId: body.userId || 'not provided'
    });

    const { 
      recipientEmail, 
      summary, 
      patientName, 
      patientPhone, 
      whatsappNumber, 
      sessionId, 
      userId,
      symptoms = [],
      urgency = 'urgent',
      recommendedAction,
      trimester,
      reportDateISO = new Date().toISOString()
    } = body;

    // Detailed validation with specific field names
    const missingFields = [];
    if (!summary) missingFields.push('summary');
    
    if (missingFields.length > 0) {
      console.log('[send-report] Validation failed - missing fields:', missingFields);
      return NextResponse.json(
        { 
          ok: false, 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    // Determine the final recipient email and patient name
    let finalRecipientEmail = recipientEmail;
    let finalPatientName = patientName;
    
    // If userId provided, look up user profile for default email and name
    if (userId) {
      console.log('[send-report] Looking up user profile for userId:', userId);
      
      try {
        const supabase = getSupabaseAdmin();
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('default_clinician_email, full_name')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('[send-report] Error looking up user profile:', error);
        } else if (userProfile) {
          // Use default email if no recipientEmail provided
          if (!finalRecipientEmail && userProfile.default_clinician_email) {
            finalRecipientEmail = userProfile.default_clinician_email;
            console.log('[send-report] Using user default email:', finalRecipientEmail ? '***@***.***' : 'none');
          }
          
          // Use user's registered name if no patientName provided
          if (!finalPatientName && userProfile.full_name) {
            finalPatientName = userProfile.full_name;
            console.log('[send-report] Using user registered name:', finalPatientName);
          }
        }
      } catch (error) {
        console.error('[send-report] Error in user profile lookup:', error);
      }
    }

    // Final validation - we need either a provided email or a default email
    if (!finalRecipientEmail) {
      console.log('[send-report] Validation failed - no recipientEmail provided and no default email found');
      return NextResponse.json(
        { 
          ok: false, 
          error: 'No recipient email provided and no default clinician email set for user. Please specify an email address or set a default in your profile.',
          missingFields: ['recipientEmail']
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(finalRecipientEmail)) {
      console.log('[send-report] Validation failed - invalid email format:', finalRecipientEmail);
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check for dry run mode
    const isDryRun = process.env.SAFE_DRY_RUN === 'true';
    console.log('[send-report] Dry run mode:', isDryRun);

    const results = [];

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        // Render the React Email template
        const html = await render(
          ClinicianSummaryEmail({
            patientName: finalPatientName || "Unknown",
            reportDateISO,
            trimester: trimester || "Unknown",
            symptoms: Array.isArray(symptoms) ? symptoms : [],
            aiSummary: summary || "",
            recommendedAction: recommendedAction || "Please review at your earliest convenience.",
            sessionId,
            appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://safemama.netlify.app",
            urgency: urgency as "urgent" | "soon" | "routine",
            logoUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://safemama.netlify.app"}/logo.png`,
          })
        );

        // Generate subject with urgency emoji
        const subjectPrefix = urgency === "urgent" ? "🚨 " : urgency === "soon" ? "⏱ " : "ℹ️ ";
        const subject = `${subjectPrefix}Symptom Summary for ${finalPatientName || "Patient"}`;

        // Generate plain text fallback
        const textContent = [
          `SafeMama Symptom Report`,
          `Patient: ${finalPatientName || "Unknown"}`,
          `Date: ${new Date(reportDateISO).toLocaleString()}`,
          `Trimester: ${trimester || "Unknown"}`,
          `Symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : "Not specified"}`,
          ``,
          `Summary: ${summary || ""}`,
          ``,
          `Action: ${recommendedAction || "Please review."}`,
          `Open: ${(process.env.NEXT_PUBLIC_APP_URL || "https://safemama.netlify.app") + "/doctor/reports"}`,
        ].join("\n");

        const emailPayload = {
          from: process.env.FROM_EMAIL || 'SafeMama <noreply@safemama.app>',
          to: [finalRecipientEmail],
          subject,
          html,
          text: textContent,
        };

        if (isDryRun) {
          console.log('[send-report] DRY RUN - Email payload:', {
            to: emailPayload.to,
            subject: emailPayload.subject,
            htmlLength: emailPayload.html.length
          });
          results.push({ type: 'email', success: true, id: 'dry-run-email-id', dryRun: true });
        } else {
          log('resend-send', { to: emailPayload.to, subject: emailPayload.subject });
          const resend = new Resend(process.env.RESEND_API_KEY);
          const emailResult = await resend.emails.send(emailPayload);
          log('resend-send', { success: true, id: emailResult.data?.id });
          results.push({ type: 'email', success: true, id: emailResult.data?.id });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const truncatedError = errorMessage.length > 200 ? errorMessage.substring(0, 200) + '...' : errorMessage;
        console.error('[send-report] Error sending email:', error);
        results.push({ type: 'email', success: false, error: truncatedError });
      }
    } else {
      console.log('[send-report] Email skipped - RESEND_API_KEY not configured');
      results.push({ type: 'email', success: false, error: 'RESEND_API_KEY not configured' });
    }

    // Send WhatsApp via Twilio
    if (whatsappNumber && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      try {
        let messageBody = `🏥 *Safemama Summary*\n\n`;
        if (finalPatientName) {
          messageBody += `👤 *Patient:* ${finalPatientName}\n`;
        }
        if (patientPhone) {
          messageBody += `📞 *Phone:* ${patientPhone}\n`;
        }
        messageBody += `\n📋 *Summary:*\n${summary}\n\n`;
        messageBody += `_Generated by Safemama - Your Antenatal Companion_`;

        const whatsappPayload = {
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: `whatsapp:${whatsappNumber}`,
          body: messageBody,
        };

        if (isDryRun) {
          console.log('[send-report] DRY RUN - WhatsApp payload:', {
            to: whatsappPayload.to,
            from: whatsappPayload.from,
            bodyLength: whatsappPayload.body.length
          });
          results.push({ type: 'whatsapp', success: true, id: 'dry-run-whatsapp-id', dryRun: true });
        } else {
          const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          const whatsappResult = await twilio.messages.create(whatsappPayload);
          console.log('[send-report] WhatsApp sent successfully:', whatsappResult.sid);
          results.push({ type: 'whatsapp', success: true, id: whatsappResult.sid });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const truncatedError = errorMessage.length > 200 ? errorMessage.substring(0, 200) + '...' : errorMessage;
        console.error('[send-report] Error sending WhatsApp:', error);
        results.push({ type: 'whatsapp', success: false, error: truncatedError });
      }
    } else if (whatsappNumber) {
      console.log('[send-report] WhatsApp skipped - Twilio not configured');
      results.push({ type: 'whatsapp', success: false, error: 'Twilio not configured' });
    }

    // Check if at least one delivery method succeeded (including dry run)
    const hasSuccess = results.some(result => result.success);
    
    if (hasSuccess) {
      // Insert record into conversation_summaries table (always insert, even in dry run)
      try {
        const supabase = getSupabaseAdmin();
        log('supabase-insert', { table: 'conversation_summaries', sessionId, userId });
        const { error: insertError } = await supabase
          .from('conversation_summaries')
          .insert({
            session_id: sessionId ?? 'unknown',
            user_id: userId ?? null,
            summary: summary,
            sent_email_to: finalRecipientEmail,
            sent_whatsapp_to: whatsappNumber ?? null,
            sent_at: new Date().toISOString(),
            dry_run: isDryRun
          });

        if (insertError) {
          log('supabase-insert', { error: insertError.message, table: 'conversation_summaries' });
          // Don't fail the request if summary insertion fails
        } else {
          log('supabase-insert', { success: true, table: 'conversation_summaries' });
        }
      } catch (error) {
        console.error('[send-report] Error inserting conversation summary:', error);
        // Don't fail the request if summary insertion fails
      }

      // Also insert into call_history table for user's call history view
      if (userId && sessionId) {
        try {
          const supabase = getSupabaseAdmin();
          const { error: callHistoryError } = await supabase
            .from('call_history')
            .insert({
              user_id: userId,
              session_id: sessionId,
              summary: summary,
              patient_name: finalPatientName,
              patient_phone: patientPhone,
              recipient_email: finalRecipientEmail,
              whatsapp_number: whatsappNumber
            });

          if (callHistoryError) {
            console.error('[send-report] Error inserting call history:', callHistoryError);
            // Don't fail the request if call history insertion fails
          } else {
            console.log('[send-report] Call history inserted successfully');
          }
        } catch (error) {
          console.error('[send-report] Error inserting call history:', error);
          // Don't fail the request if call history insertion fails
        }
      }

      log('done', { 
        resultsCount: results.length, 
        dryRun: isDryRun,
        hasSuccess 
      });
      
      return NextResponse.json({ 
        ok: true, 
        results,
        dryRun: isDryRun
      });
    } else {
      console.log('[send-report] API call failed - no delivery methods succeeded:', results);
      return NextResponse.json(
        { ok: false, error: 'Failed to send report via any method', results },
        { status: 500 }
      );
    }

  } catch (error) {
    log('error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({
      ok: false,
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      friendly: 'Something went wrong while sending the report. Please try again.'
    }, { status: 500 });
  }
}