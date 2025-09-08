# Local Testing Guide for ElevenLabs Agent Integration

## Setup Steps

### 1. Start the Application
```bash
npm run dev
```
This will start the Next.js development server, typically on `http://localhost:3000`.

### 2. Start ngrok Tunnel
```bash
npm run tunnel
```
This creates a public tunnel to your local development server. Note the ngrok URL (e.g., `https://abc123.ngrok-free.app`).

### 3. Configure ElevenLabs Agent Tools

In your ElevenLabs Agent dashboard, configure the webhook tools with these URLs:

**logTurn Tool:**
- URL: `https://<ngrok-host>.ngrok-free.app/api/voice/log-turn`
- Example: `https://abc123.ngrok-free.app/api/voice/log-turn`

**sendReportToClinician Tool:**
- URL: `https://<ngrok-host>.ngrok-free.app/api/voice/send-report`
- Example: `https://abc123.ngrok-free.app/api/voice/send-report`

### 4. Add Debug Logging (Optional)

For quick verification, add console.log statements in both API routes:

**In `app/api/voice/log-turn/route.ts`:**
```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📝 logTurn received:', JSON.stringify(body, null, 2));
    // ... rest of the function
```

**In `app/api/voice/send-report/route.ts`:**
```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📧 sendReport received:', JSON.stringify(body, null, 2));
    // ... rest of the function
```

### 5. Test the Integration

1. Open your ElevenLabs Agent in the browser
2. Send a test message: **"Test AI agent"**
3. The agent should automatically call the `logTurn` tool for both user and assistant messages
4. Check your terminal running `npm run dev` - you should see the incoming JSON payloads logged
5. Try asking the agent to send a report to a clinician to test the `sendReportToClinician` tool

## Expected Behavior

- **Every user message** should trigger a `logTurn` call with `role: "user"`
- **Every assistant response** should trigger a `logTurn` call with `role: "assistant"`
- **Clinician report requests** should trigger a `sendReportToClinician` call
- All payloads should be visible in your development terminal

## Troubleshooting

- Ensure your ngrok tunnel is active and the URL is correct
- Check that the API routes are accessible by visiting them directly in your browser
- Verify that your `SAFEMAMA_API_KEY` environment variable is set if you're using API key authentication
- Make sure the ElevenLabs Agent has the correct system prompt with the session ID instructions
