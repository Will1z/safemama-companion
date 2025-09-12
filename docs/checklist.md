# ElevenLabs Agent Tools Setup Checklist

## Overview
This checklist provides the exact specifications for configuring ElevenLabs Agent tools to work with SafeMama's voice API endpoints.

## Tool 1: logTurn

### Configuration
- **Tool Name**: `logTurn`
- **Method**: `POST`
- **Description**: Logs conversation turns for session tracking

### URL Formats

#### For Local Development (ngrok)
```
https://abc123.ngrok.io/api/voice/log-turn
```

#### For Production (Netlify)
```
https://your-site-name.netlify.app/api/voice/log-turn
```

### Required Headers
```
x-api-key: your_safemama_api_key
Content-Type: application/json
```

### Request Body Parameters
```json
{
  "sessionId": "string (required)",
  "role": "string (required, 'user' | 'assistant')",
  "text": "string (required)",
  "lang": "string (optional)"
}
```

### Example cURL
```bash
curl -X POST "https://your-site-name.netlify.app/api/voice/log-turn" \
  -H "x-api-key: your_safemama_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "123e4567-e89b-12d3-a456-426614174000",
    "role": "user",
    "text": "I have been experiencing some mild cramping today",
    "lang": "en"
  }'
```

---

## Tool 2: sendReportToClinician

### Configuration
- **Tool Name**: `sendReportToClinician`
- **Method**: `POST`
- **Description**: Sends health summary reports to healthcare providers

### URL Formats

#### For Local Development (ngrok)
```
https://abc123.ngrok.io/api/voice/send-report
```

#### For Production (Netlify)
```
https://your-site-name.netlify.app/api/voice/send-report
```

### Required Headers
```
x-api-key: your_safemama_api_key
Content-Type: application/json
```

### Request Body Parameters
```json
{
  "recipientEmail": "string (required, valid email format)",
  "summary": "string (required)",
  "patientName": "string (optional)",
  "patientPhone": "string (optional)",
  "whatsappNumber": "string (optional, E.164 format)",
  "sessionId": "string (optional)",
  "userId": "string (optional)"
}
```

### Example cURL
```bash
curl -X POST "https://your-site-name.netlify.app/api/voice/send-report" \
  -H "x-api-key: your_safemama_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "doctor@clinic.com",
    "summary": "Patient reported mild cramping and fatigue. No concerning symptoms. Recommended rest and monitoring.",
    "patientName": "Sarah Johnson",
    "patientPhone": "+1234567890",
    "whatsappNumber": "+1234567890",
    "sessionId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user_123"
  }'
```

---

## Environment Variables Required

### For API Authentication
```env
SAFEMAMA_API_KEY=your_safemama_api_key
```

### For Email Functionality
```env
RESEND_API_KEY=your_resend_api_key
```

### For WhatsApp Functionality
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### For Dry Run Testing
```env
SAFE_DRY_RUN=true
```

---

## Response Formats

### Success Response (logTurn)
```json
{
  "ok": true,
  "message": "Turn logged successfully"
}
```

### Success Response (sendReportToClinician)
```json
{
  "ok": true,
  "results": [
    {
      "type": "email",
      "success": true,
      "id": "email_id_123"
    },
    {
      "type": "whatsapp",
      "success": true,
      "id": "whatsapp_id_456"
    }
  ],
  "dryRun": false
}
```

### Error Response (400 - Missing Fields)
```json
{
  "ok": false,
  "error": "Missing required fields: recipientEmail, summary",
  "missingFields": ["recipientEmail", "summary"]
}
```

### Error Response (401 - Unauthorized)
```json
{
  "ok": false,
  "error": "unauthorized"
}
```

### Error Response (500 - Service Error)
```json
{
  "ok": false,
  "error": "Failed to send report via any method",
  "results": [
    {
      "type": "email",
      "success": false,
      "error": "RESEND_API_KEY not configured"
    }
  ]
}
```

---

## Testing Checklist

### ✅ Pre-Deployment Testing
- [ ] API endpoints are accessible via ngrok/Netlify URL
- [ ] `x-api-key` header is properly configured
- [ ] Required environment variables are set
- [ ] Email service (Resend) is configured and working
- [ ] WhatsApp service (Twilio) is configured and working
- [ ] Database connection is working for summary storage

### ✅ Dry Run Testing
- [ ] Set `SAFE_DRY_RUN=true` in environment
- [ ] Verify logs show payload details without actual sending
- [ ] Confirm summary is still inserted into database
- [ ] Test both email and WhatsApp dry run modes

### ✅ Production Testing
- [ ] Remove or set `SAFE_DRY_RUN=false`
- [ ] Test with real email addresses
- [ ] Test with real WhatsApp numbers
- [ ] Verify emails are received
- [ ] Verify WhatsApp messages are received
- [ ] Check database for inserted summaries

### ✅ Error Handling Testing
- [ ] Test with missing required fields
- [ ] Test with invalid email format
- [ ] Test with missing API key
- [ ] Test with invalid API key
- [ ] Test with service failures (disable API keys temporarily)

---

## ElevenLabs Agent Configuration

### System Prompt Addition
Add this to your ElevenLabs Agent system prompt:

```
You have access to two tools for interacting with SafeMama:

1. logTurn: Use this after each user utterance and each assistant reply to log the conversation.
   - sessionId: Use the value from window.SAFEMAMA_SESSION_ID
   - role: "user" for user messages, "assistant" for your replies
   - text: The actual message content

2. sendReportToClinician: Use this when the user asks to send a health summary to their clinician.
   - recipientEmail: The healthcare provider's email address
   - summary: A comprehensive summary of the conversation and health status
   - patientName: The patient's name (if provided)
   - patientPhone: The patient's phone number (if provided)
   - whatsappNumber: WhatsApp number for the clinician (if provided)

Always use these tools to maintain proper session tracking and enable report sharing functionality.
```

### Tool Configuration in ElevenLabs Dashboard
1. Go to your Agent settings
2. Add the two tools with the exact URLs and parameters specified above
3. Ensure the `x-api-key` header is configured
4. Test the tools using the cURL examples provided

---

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check that `x-api-key` header matches `SAFEMAMA_API_KEY`
2. **400 Bad Request**: Verify all required fields are provided and email format is valid
3. **500 Internal Error**: Check environment variables and service configurations
4. **Tool not working**: Verify URL format and network connectivity

### Debug Steps
1. Check server logs for detailed error messages
2. Use cURL to test endpoints manually
3. Verify environment variables are loaded correctly
4. Test with dry run mode first
5. Check database connectivity for summary storage

### Support
For issues with this integration, check:
- Server logs for detailed error messages
- Environment variable configuration
- Network connectivity to external services
- Database connection status
