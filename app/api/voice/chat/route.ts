import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { conversationHistory, userInput, currentQuestion, conversationState } = await req.json();

    // Simple conversation flow without external AI for now
    // In production, you'd integrate with OpenAI, Claude, or another LLM
    
    let response = "";
    
    if (conversationState === 'greeting') {
      response = "I understand. Let me ask you a few questions to better assess your health. Can you tell me about any symptoms you're experiencing?";
    } else if (conversationState === 'questioning') {
      const questions = [
        "Can you tell me about any symptoms you're experiencing?",
        "Have you noticed any changes in your energy levels or mood?",
        "Are you experiencing any pain or discomfort? If so, where?",
        "Have you had any changes in your appetite or sleep patterns?",
        "Is there anything else you'd like to share about how you're feeling?",
        "Thank you for sharing that with me. Let me summarize what we've discussed and provide some recommendations."
      ];
      
      if (currentQuestion < questions.length - 1) {
        response = questions[currentQuestion];
      } else {
        response = "Thank you for sharing that with me. Let me summarize what we've discussed and provide some recommendations.";
      }
    } else if (conversationState === 'concluding') {
      response = "Based on our conversation, I recommend monitoring your symptoms and consulting with a healthcare provider if they persist or worsen. Thank you for using our health assessment tool.";
    } else {
      response = "I understand. Is there anything else you'd like to share?";
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
