"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/ui/BottomNav';
import { ArrowLeft, FileText, Download, Calendar, Heart, Activity, Bot, CheckCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

export default function SummaryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const handleExport = () => {
    track('summary_exported', { period: selectedPeriod });
    // TODO: Implement actual PDF export
    alert('Exporting health summary... In a real app, this would generate a PDF.');
  };

  const mockData = {
    week: {
      vitals: [
        { date: '2024-01-10', bp: '120/80', weight: '65kg', temp: '36.8°C' },
        { date: '2024-01-09', bp: '118/78', weight: '64.8kg', temp: '36.6°C' },
        { date: '2024-01-08', bp: '122/82', weight: '65.2kg', temp: '36.9°C' }
      ],
      symptoms: [
        { date: '2024-01-10', symptoms: 'Mild headache', tier: 1 },
        { date: '2024-01-08', symptoms: 'Fatigue', tier: 1 }
      ],
      conversations: [
        { 
          date: '2024-01-10', 
          summary: 'Discussed morning nausea and fatigue. AI recommended increased hydration and rest.',
          riskLevel: 1,
          sent: true
        }
      ]
    },
    month: {
      vitals: [
        { date: '2024-01-10', bp: '120/80', weight: '65kg', temp: '36.8°C' },
        { date: '2024-01-05', bp: '118/78', weight: '64.8kg', temp: '36.6°C' },
        { date: '2024-01-01', bp: '122/82', weight: '65.2kg', temp: '36.9°C' }
      ],
      symptoms: [
        { date: '2024-01-10', symptoms: 'Mild headache', tier: 1 },
        { date: '2024-01-08', symptoms: 'Fatigue', tier: 1 },
        { date: '2024-01-05', symptoms: 'Nausea', tier: 1 }
      ],
      conversations: [
        { 
          date: '2024-01-10', 
          summary: 'Discussed morning nausea and fatigue. AI recommended increased hydration and rest.',
          riskLevel: 1,
          sent: true
        },
        { 
          date: '2024-01-05', 
          summary: 'Reported mild back pain and sleep issues. AI suggested pregnancy pillow and gentle stretching.',
          riskLevel: 1,
          sent: false
        }
      ]
    },
    all: {
      vitals: [
        { date: '2024-01-10', bp: '120/80', weight: '65kg', temp: '36.8°C' },
        { date: '2024-01-05', bp: '118/78', weight: '64.8kg', temp: '36.6°C' },
        { date: '2024-01-01', bp: '122/82', weight: '65.2kg', temp: '36.9°C' },
        { date: '2023-12-25', bp: '120/78', weight: '65.5kg', temp: '36.7°C' }
      ],
      symptoms: [
        { date: '2024-01-10', symptoms: 'Mild headache', tier: 1 },
        { date: '2024-01-08', symptoms: 'Fatigue', tier: 1 },
        { date: '2024-01-05', symptoms: 'Nausea', tier: 1 },
        { date: '2023-12-28', symptoms: 'Back pain', tier: 1 }
      ],
      conversations: [
        { 
          date: '2024-01-10', 
          summary: 'Discussed morning nausea and fatigue. AI recommended increased hydration and rest.',
          riskLevel: 1,
          sent: true
        },
        { 
          date: '2024-01-05', 
          summary: 'Reported mild back pain and sleep issues. AI suggested pregnancy pillow and gentle stretching.',
          riskLevel: 1,
          sent: false
        },
        { 
          date: '2023-12-28', 
          summary: 'Initial consultation about pregnancy symptoms and concerns. AI provided general guidance.',
          riskLevel: 1,
          sent: true
        }
      ]
    }
  };

  const currentData = mockData[selectedPeriod];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Health Summary</h1>
                <p className="text-xs text-white/80">Your pregnancy health overview</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Period Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Select Period</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {[
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'all', label: 'All Time' }
              ].map((period) => (
                <Button
                  key={period.key}
                  variant={selectedPeriod === period.key ? 'primary' : 'outline'}
                  onClick={() => setSelectedPeriod(period.key as any)}
                  className="flex-1"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Health Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-sm text-green-700">Weeks Pregnant</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-blue-700">Vitals Recorded</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-yellow-700">Symptoms Reported</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-purple-700">Risk Assessment</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Recent Vitals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentData.vitals.map((vital, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">Blood Pressure: {vital.bp}</div>
                    <div className="text-sm text-muted-foreground">
                      Weight: {vital.weight} • Temp: {vital.temp}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{vital.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Symptoms History */}
        <Card>
          <CardHeader>
            <CardTitle>Symptoms History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentData.symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">{symptom.symptoms}</div>
                    <div className="text-sm text-muted-foreground">
                      Risk Level: {symptom.tier === 1 ? 'Low' : symptom.tier === 2 ? 'Moderate' : 'High'}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{symptom.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Conversation Summaries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-primary" />
              <span>AI Conversation Summaries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentData.conversations.map((conversation, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">AI Health Consultation</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        conversation.riskLevel === 1 ? 'bg-green-100 text-green-800' :
                        conversation.riskLevel === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {conversation.riskLevel === 1 ? 'Low Risk' : 
                         conversation.riskLevel === 2 ? 'Moderate Risk' : 'High Risk'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-600">{conversation.date}</div>
                      {conversation.sent ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Sent</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            track('conversation_summary_sent', { date: conversation.date });
                            alert('Conversation summary sent to healthcare provider!');
                          }}
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {conversation.summary}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleExport} className="w-full h-12">
              <Download className="w-5 h-5 mr-2" />
              Export Health Summary (PDF)
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
