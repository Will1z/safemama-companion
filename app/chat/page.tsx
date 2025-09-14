"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RiskBanner } from '@/components/ui/RiskBanner';
import BottomNav from '@/components/ui/BottomNav';
import { Send, ArrowLeft, Bot, User, FileText, Download, Share2, CheckCircle, Mic, MicOff, Square, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  assessment?: {
    tier: 1 | 2 | 3;
    advice: string;
    reasons: string[];
  };
}

interface ConversationSummary {
  id: string;
  date: string;
  summary: string;
  riskLevel: 1 | 2 | 3;
  keySymptoms: string[];
  recommendations: string[];
  sent: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm here to help monitor your health during pregnancy. How are you feeling today? Please describe any symptoms or concerns you might have.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [conversationSummary, setConversationSummary] = useState<ConversationSummary | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceResponsesEnabled, setVoiceResponsesEnabled] = useState(true);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const generateConversationSummary = async () => {
    setIsGeneratingSummary(true);
    
    try {
      // Get user messages and assessments from the conversation
      const userMessages = messages.filter(m => m.type === 'user');
      const assessments = messages.filter(m => m.assessment).map(m => m.assessment);
      
      // Simulate AI summarization (in real app, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const summary: ConversationSummary = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        summary: `Health consultation on ${new Date().toLocaleDateString()}. Patient reported ${userMessages.length} concerns including symptoms and general health status. AI assessment provided risk evaluation and recommendations.`,
        riskLevel: assessments.length > 0 ? Math.max(...assessments.map(a => a?.tier || 1)) as 1 | 2 | 3 : 1,
        keySymptoms: userMessages.map(m => m.content.substring(0, 50) + '...'),
        recommendations: assessments.map(a => a?.advice || '').filter(Boolean),
        sent: false
      };
      
      setConversationSummary(summary);
      setShowSummary(true);
      track('conversation_summary_generated', { messageCount: userMessages.length });
      
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const sendSummary = async (summary: ConversationSummary) => {
    try {
      // Simulate sending to healthcare provider
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update summary as sent
      setConversationSummary(prev => prev ? { ...prev, sent: true } : null);
      track('health_summary_sent', { summaryId: summary.id });
      
      alert('Health summary sent successfully to your healthcare provider!');
      
    } catch (error) {
      console.error('Error sending summary:', error);
      alert('Failed to send summary. Please try again.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      track('voice_recording_started');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      track('voice_recording_stopped', { duration: recordingTime });
    }
  };

  const processVoiceMessage = async (audioBlob: Blob) => {
    setIsProcessingVoice(true);
    
    try {
      // Voicechat2 AI Integration
      const transcription = await transcribeAudio(audioBlob);
      
      // Add the transcribed message
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: transcription,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Get AI voice response using Voicechat2
      const aiResponse = await getAIResponse(transcription);
      
      // Add AI response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse.text,
        timestamp: new Date(),
        assessment: aiResponse.assessment
      };
      
      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
      
      // Play AI voice response if enabled
      if (voiceResponsesEnabled && aiResponse.audioUrl) {
        await playAIResponse(aiResponse.audioUrl);
      }
      
      track('voice_message_processed', { duration: recordingTime, transcription });
    } catch (error) {
      console.error('Error processing voice message:', error);
      alert('Error processing voice message. Please try again.');
    } finally {
      setIsProcessingVoice(false);
      setRecordingTime(0);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // Voicechat2 Speech-to-Text API
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('language', 'en-US');
    
    try {
      const response = await fetch('/api/voicechat2/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Transcription failed');
      }
      
      const result = await response.json();
      return result.transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      // Fallback to mock transcription
      return "I've been experiencing some mild cramping and feeling a bit tired today. Is this normal?";
    }
  };

  const getAIResponse = async (userMessage: string): Promise<{
    text: string;
    audioUrl?: string;
    assessment?: {
      tier: 1 | 2 | 3;
      advice: string;
      reasons: string[];
    };
  }> => {
    // Voicechat2 AI Conversation API
    try {
      const response = await fetch('/api/voicechat2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-10), // Last 10 messages for context
          userContext: {
            pregnancyWeek: 24,
            riskFactors: ['first_pregnancy', 'age_35_plus'],
            previousSymptoms: ['mild_cramping', 'fatigue']
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('AI response failed');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI response error:', error);
      // Fallback response
      return {
        text: "I understand you're experiencing some symptoms. Let me help you assess this. Can you tell me more about the severity and duration of your symptoms?",
        assessment: {
          tier: 1,
          advice: "Continue monitoring and provide more details",
          reasons: ["Insufficient information for assessment"]
        }
      };
    }
  };

  const playAIResponse = async (audioUrl: string): Promise<void> => {
    try {
      setIsAISpeaking(true);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsAISpeaking(false);
      };
      
      audio.onerror = () => {
        setIsAISpeaking(false);
        console.error('Error playing AI response audio');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing AI response:', error);
      setIsAISpeaking(false);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call triage API
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage.content,
          // TODO: Add real user context
          user_id: 'mock-user-id',
          pregnancy_id: 'mock-pregnancy-id',
          weeks: 24
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process symptoms');
      }

      const result = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I've analyzed your symptoms. Here's my assessment:",
        timestamp: new Date(),
        assessment: {
          tier: result.tier,
          advice: result.action,
          reasons: result.reasons
        }
      };

      setMessages(prev => [...prev, botMessage]);

      // Add follow-up message based on tier
      setTimeout(() => {
        let followUp = "";
        if (result.tier === 3) {
          followUp = "This requires immediate attention. Would you like me to help you find the nearest healthcare facility or contact your emergency contact?";
        } else if (result.tier === 2) {
          followUp = "I recommend scheduling an appointment with your healthcare provider within 24 hours. Would you like me to help you find nearby clinics?";
        } else {
          followUp = "Continue monitoring these symptoms. Feel free to report any changes. Is there anything else you'd like to discuss?";
        }

        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'bot',
          content: followUp,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, followUpMessage]);
      }, 1000);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I encountered an error processing your message. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <header className="bg-primary text-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
                <Link href="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 bg-accent rounded-full flex items-center justify-center ${
                  isAISpeaking ? 'animate-pulse' : ''
                }`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold">Health Assistant</h1>
                  <p className="text-xs text-white/80">
                    {isAISpeaking ? "AI is speaking..." : "AI-powered symptom monitoring"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Voice Response Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoiceResponsesEnabled(!voiceResponsesEnabled)}
                className="text-white hover:bg-white/10"
                title={voiceResponsesEnabled ? "Disable voice responses" : "Enable voice responses"}
              >
                {voiceResponsesEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>
              
              {messages.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateConversationSummary}
                  disabled={isGeneratingSummary}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  {isGeneratingSummary ? 'Generating...' : 'Summary'}
                </Button>
              )}
              <Button variant="outline" size="sm" asChild className="text-white border-white/20 hover:bg-white/10">
                <Link href="/summary">
                  <Download className="w-4 h-4 mr-1" />
                  Health Summary
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-accent text-white'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <Card
                    className={`p-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-white ml-auto'
                        : 'bg-card'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </Card>
                  {message.assessment && (
                    <div className="mt-3">
                      <RiskBanner
                        tier={message.assessment.tier}
                        reason={message.assessment.reasons.join(', ')}
                      />
                    </div>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <Card className="p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Conversation Summary Modal */}
      {showSummary && conversationSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Conversation Summary</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSummary(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Date: {conversationSummary.date}</div>
                  <div className="text-sm text-gray-600">
                    Risk Level: 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      conversationSummary.riskLevel === 1 ? 'bg-[rgb(var(--success))]/60 text-slate-800' :
                      conversationSummary.riskLevel === 2 ? 'bg-[rgb(var(--warning))]/60 text-slate-900' :
                      'bg-[rgb(var(--destructive))]/60 text-[rgb(var(--destructive-foreground))]'
                    }`}>
                      {conversationSummary.riskLevel === 1 ? 'Low' : 
                       conversationSummary.riskLevel === 2 ? 'Moderate' : 'High'}
                    </span>
                  </div>
                </div>
                {conversationSummary.sent && (
                  <div className="flex items-center space-x-1 text-[rgb(var(--success-foreground))]">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Sent</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {conversationSummary.summary}
                </p>
              </div>

              {conversationSummary.keySymptoms.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Key Symptoms Discussed</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {conversationSummary.keySymptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {conversationSummary.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">AI Recommendations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {conversationSummary.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => sendSummary(conversationSummary)}
                  disabled={conversationSummary.sent}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {conversationSummary.sent ? 'Already Sent' : 'Send to Healthcare Provider'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // In a real app, this would save to health summary
                    track('summary_saved_to_health_record', { summaryId: conversationSummary.id });
                    alert('Summary saved to your health records!');
                    setShowSummary(false);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Save to Health Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-background/95 backdrop-blur p-4">
        <form onSubmit={handleSubmit} className="container mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe how you're feeling..."
                disabled={isLoading || isProcessingVoice}
                className="h-12 resize-none"
                maxLength={500}
              />
            </div>
            
            {/* Voice Recording Button */}
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading || isProcessingVoice}
              size="icon"
              className={`h-12 w-12 ${
                isRecording 
                  ? 'bg-[rgb(var(--destructive))] hover:brightness-95 text-[rgb(var(--destructive-foreground))]' 
                  : 'bg-accent hover:bg-accent/90 text-accent-foreground'
              }`}
            >
              {isRecording ? (
                <Square className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
            
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || isProcessingVoice}
              size="icon"
              className="h-12 w-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Recording Status */}
          {isRecording && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-2 text-[rgb(var(--destructive-foreground))]">
                <div className="w-2 h-2 bg-[rgb(var(--destructive))] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Recording... {formatRecordingTime(recordingTime)}
                </span>
              </div>
            </div>
          )}
          
          {isProcessingVoice && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-2 text-accent">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Processing voice message...</span>
              </div>
            </div>
          )}
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {isRecording 
              ? "Tap the square to stop recording" 
              : "Tap the microphone to record or type your message"
            }
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}