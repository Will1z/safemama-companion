"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/ui/BottomNav';
import ElevenLabsGlobalWidget from '@/components/voice/ElevenLabsGlobalWidget';
import { ArrowLeft, Activity, Heart, Thermometer, Weight } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import BackToHomeButton from '@/components/ui/BackToHomeButton';

export default function VitalsPage() {
  const [vitals, setVitals] = useState({
    systolic: '',
    diastolic: '',
    weight: '',
    temperature: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Submit to API
      console.log('Submitting vitals:', vitals);
      track('vitals_logged', { 
        type: 'manual',
        systolic: vitals.systolic,
        diastolic: vitals.diastolic,
        weight: vitals.weight,
        temperature: vitals.temperature
      });
      
      // Reset form
      setVitals({
        systolic: '',
        diastolic: '',
        weight: '',
        temperature: '',
        notes: ''
      });
      
      alert('Vitals recorded successfully!');
    } catch (error) {
      console.error('Error submitting vitals:', error);
      alert('Error recording vitals. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold">Record Vitals</h1>
                  <p className="text-xs text-white/80">Track your health measurements</p>
                </div>
              </div>
            </div>
            <BackToHomeButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Health Measurements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Blood Pressure */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="120"
                    value={vitals.systolic}
                    onChange={(e) => handleInputChange('systolic', e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="80"
                    value={vitals.diastolic}
                    onChange={(e) => handleInputChange('diastolic', e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center space-x-2">
                  <Weight className="w-4 h-4" />
                  <span>Weight (kg)</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="65.5"
                  value={vitals.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4" />
                  <span>Temperature (°C)</span>
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.8"
                  value={vitals.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <textarea
                  id="notes"
                  placeholder="Any symptoms, concerns, or additional information..."
                  value={vitals.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-input rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:ring-offset-2"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || (!vitals.systolic && !vitals.diastolic && !vitals.weight && !vitals.temperature)}
                className="w-full h-12"
              >
                {isSubmitting ? 'Recording...' : 'Record Vitals'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Vitals */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">Blood Pressure: 120/80</div>
                  <div className="text-sm text-muted-foreground">Weight: 65kg • Temp: 36.8°C</div>
                </div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">Blood Pressure: 118/78</div>
                  <div className="text-sm text-muted-foreground">Weight: 64.8kg • Temp: 36.6°C</div>
                </div>
                <div className="text-sm text-muted-foreground">Yesterday</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
      
      {/* ElevenLabs Widget - Only available in authenticated app areas */}
      <ElevenLabsGlobalWidget 
        height={560}
        width="400px"
      />
    </div>
  );
}
