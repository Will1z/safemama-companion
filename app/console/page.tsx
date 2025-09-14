"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, ArrowLeft, Users, Activity, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ConsolePage() {
  const [selectedTab, setSelectedTab] = useState<'patients' | 'alerts' | 'analytics'>('patients');

  const mockPatients = [
    { id: 1, name: 'Sarah Johnson', weeks: 24, lastCheck: '2 hours ago', risk: 'Low' },
    { id: 2, name: 'Maria Garcia', weeks: 18, lastCheck: '1 day ago', risk: 'Moderate' },
    { id: 3, name: 'Aisha Okafor', weeks: 32, lastCheck: '3 hours ago', risk: 'Low' }
  ];

  const mockAlerts = [
    { id: 1, patient: 'Maria Garcia', type: 'High Blood Pressure', time: '1 hour ago', priority: 'High' },
    { id: 2, patient: 'Sarah Johnson', type: 'Missed Check-in', time: '4 hours ago', priority: 'Medium' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold">Healthcare Provider Console</h1>
                  <p className="text-xs text-white/80">Patient monitoring dashboard</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-white/80">
              Dr. Sarah Williams
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Demo Notice */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This is a healthcare provider console for monitoring patients. 
              In a real application, this would require proper authentication and authorization.
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Active Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Active Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">18</div>
                  <div className="text-sm text-muted-foreground">Check-ins Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Pending Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'patients', label: 'Patients', icon: Users },
            { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
            { key: 'analytics', label: 'Analytics', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.key}
                variant={selectedTab === tab.key ? 'primary' : 'outline'}
                onClick={() => setSelectedTab(tab.key as any)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        {selectedTab === 'patients' && (
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Week {patient.weeks} • Last check: {patient.lastCheck}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        patient.risk === 'Low' ? 'bg-green-100 text-green-800' :
                        patient.risk === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.risk} Risk
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'alerts' && (
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{alert.patient}</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.type} • {alert.time}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        alert.priority === 'High' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.priority} Priority
                      </span>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon...</p>
                <p className="text-sm">This would show patient trends, risk patterns, and health insights.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
