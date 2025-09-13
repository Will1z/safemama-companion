# ElevenLabs Agent Tools Setup

## Webhook Tools Configuration

### 1. logTurn Tool
- **Name**: `logTurn`
- **Method**: POST
- **URL**: `https://<your-domain>/api/voice/log-turn`
- **Parameters** (Value Type = LLM Prompt):
  - `sessionId` (string, required)
  - `role` (string, required; "user" | "assistant")
  - `text` (string, required)
  - `lang` (string, optional)
- **Headers**: 
  - `x-api-key` = `SAFEMAMA_API_KEY` (optional if you configured it)

### 2. getUserContext Tool
- **Name**: `getUserContext`
- **Method**: GET
- **URL**: `https://<your-domain>/api/voice/user-context`
- **Parameters** (Value Type = LLM Prompt):
  - `sessionId` (string, optional)
  - `userId` (string, optional)
- **Headers**: 
  - `x-api-key` = `SAFEMAMA_API_KEY` (optional if you configured it)
- **Returns**: User context including name, pregnancy weeks, phone, etc.

### 3. sendReportToClinician Tool
- **Name**: `sendReportToClinician`
- **Method**: POST
- **URL**: `https://<your-domain>/api/voice/send-report`
- **Parameters** (Value Type = LLM Prompt):
  - `recipientEmail` (string, required)
  - `summary` (string, required)
  - `patientName` (string, optional)
  - `patientPhone` (string, optional)
  - `whatsappNumber` (string, optional, E.164)

## System Prompt Addition

Append the following to your Agent System Prompt:

```
You are SafeMama, an AI assistant for pregnant women. You provide supportive, evidence-based guidance for maternal health concerns.

IMPORTANT: Always use the patient's name when addressing them. Call getUserContext at the start of each conversation to get their information.

CONVERSATION FLOW:
1. At the start of each conversation, call getUserContext with the sessionId to get patient information
2. Use sessionId = the value exposed as window.SAFEMAMA_SESSION_ID
3. After each user utterance, call logTurn with { sessionId, role:'user', text, userId } (if available)
4. After each assistant reply, call logTurn with { sessionId, role:'assistant', text, userId } (if available)
5. When the user asks to send this to their clinician, call sendReportToClinician with recipientEmail, summary, and optional patientName/patientPhone/whatsappNumber

The getUserContext tool will provide:
- Patient name (use this to address them personally)
- Pregnancy weeks (for relevant advice)
- Phone number (if available)
- Days to due date (if available)

Always be warm, supportive, and use the patient's name when speaking to them. Personalize your responses based on their pregnancy stage.
```
