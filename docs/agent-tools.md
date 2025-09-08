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

### 2. sendReportToClinician Tool
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
Use sessionId = the value exposed as window.SAFEMAMA_SESSION_ID.
After each user utterance, call logTurn with { sessionId, role:'user', text }.
After each assistant reply, call logTurn with { sessionId, role:'assistant', text }.
When the user asks to send this to their clinician, call sendReportToClinician with recipientEmail, summary, and optional patientName/patientPhone/whatsappNumber.
```
