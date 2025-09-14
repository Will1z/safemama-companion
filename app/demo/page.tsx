"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, ArrowLeft, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    attendees: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual demo scheduling
    console.log('Demo request:', formData);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-playfair font-semibold text-xl text-primary">SafeMama</span>
              </div>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="font-playfair text-2xl font-bold mb-2">Demo Scheduled!</h1>
                  <p className="text-muted-foreground mb-6">
                    Thank you for your interest in SafeMama. We'll contact you within 24 hours to confirm your demo appointment.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Our team will reach out to <strong>{formData.email}</strong> to coordinate the best time for your personalized demo.
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/">Back to Home</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/console">View Provider Console</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair font-semibold text-xl text-primary">SafeMama</span>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold mb-2">Schedule a Demo</h1>
          <p className="text-muted-foreground">
            See how SafeMama can improve maternal health outcomes in your organization
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Request Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@organization.com"
                    className="h-12"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="Hospital, Clinic, or Organization"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <select
                    id="preferredTime"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="w-full h-12 px-3 border border-input rounded-xl bg-background"
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendees">Expected Attendees</Label>
                <Input
                  id="attendees"
                  value={formData.attendees}
                  onChange={(e) => handleInputChange('attendees', e.target.value)}
                  placeholder="e.g., 5-10 healthcare providers"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your organization's needs, current challenges, or specific features you'd like to see..."
                  className="w-full h-24 px-3 py-2 border border-input rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:ring-offset-2"
                />
              </div>

              <Button
                type="submit"
                disabled={!formData.name || !formData.email || !formData.organization}
                className="w-full h-12"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Patient Management</h3>
                <p className="text-sm text-muted-foreground">See how to monitor and track patient health data</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Real-time Alerts</h3>
                <p className="text-sm text-muted-foreground">Experience instant notifications for critical health events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Risk Assessment</h3>
                <p className="text-sm text-muted-foreground">Learn about our AI-powered health risk evaluation</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
