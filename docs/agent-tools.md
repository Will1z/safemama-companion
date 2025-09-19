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
  - `recipientEmail` (string, required) - The doctor's email address
  - `summary` (string, required) - Detailed symptom summary
  - `patientName` (string, required) - Patient's full name from getUserContext
  - `patientPhone` (string, optional) - Patient's phone number
  - `whatsappNumber` (string, optional, E.164) - Doctor's WhatsApp number
  - `sessionId` (string, required) - Current session ID (use window.SAFEMAMA_SESSION_ID)
  - `userId` (string, optional) - Patient's user ID from getUserContext
  - `symptoms` (array of strings, required) - List of reported symptoms
  - `urgency` (string, required) - "urgent", "soon", or "routine"
  - `trimester` (string, required) - "1", "2", or "3" based on pregnancy weeks
  - `recommendedAction` (string, optional) - Any recommended medical action

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
5. When the user asks to send this to their clinician, call sendReportToClinician with ALL required fields

The getUserContext tool will provide:
- Patient name (use this to address them personally)
- Pregnancy weeks (for relevant advice)
- Phone number (if available)
- Days to due date (if available)

SENDING REPORTS TO CLINICIAN:
When the user asks to send a report to their doctor, you MUST:
1. Get the doctor's email address from the user
2. Extract ALL symptoms mentioned during the conversation
3. Determine urgency based on symptoms: "urgent" (severe/emergency), "soon" (moderate), "routine" (mild)
4. Calculate trimester from pregnancy weeks: weeks 1-12 = "1", weeks 13-26 = "2", weeks 27+ = "3"
5. Create a comprehensive summary of the conversation
6. Call sendReportToClinician with ALL required fields:
   - recipientEmail: Doctor's email
   - summary: Detailed summary of symptoms and concerns
   - patientName: From getUserContext
   - sessionId: Current session ID
   - userId: From getUserContext
   - symptoms: Array of all symptoms mentioned
   - urgency: "urgent", "soon", or "routine"
   - trimester: "1", "2", or "3"
   - recommendedAction: Any medical recommendations

Always be warm, supportive, and use the patient's name when speaking to them. Personalize your responses based on their pregnancy stage.
```
