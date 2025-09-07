"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/ui/BottomNav';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Heart } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

export default function HelpPage() {
  const [emergencyMode, setEmergencyMode] = useState(false);

  const handleEmergencyCall = () => {
    track('help_call_clicked');
    // TODO: Implement actual emergency call functionality
    alert('Emergency contact will be called. In a real app, this would initiate a call.');
  };

  const handleLocationShare = () => {
    track('help_location_shared');
    // TODO: Implement location sharing
    alert('Your location will be shared with emergency contacts. In a real app, this would share your GPS coordinates.');
  };

  const handleFindFacility = () => {
    track('help_facility_search');
    // TODO: Implement facility finder
    alert('Finding nearest healthcare facilities... In a real app, this would show a map with nearby facilities.');
  };

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
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Help & Support</h1>
                <p className="text-xs text-white/80">Get assistance when you need it</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Emergency Actions */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Emergency Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleEmergencyCall}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Emergency Contact
            </Button>
            <Button 
              onClick={handleLocationShare}
              variant="outline"
              className="w-full h-12 border-red-300 text-red-700 hover:bg-red-100"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Share My Location
            </Button>
            <Button 
              onClick={handleFindFacility}
              variant="outline"
              className="w-full h-12 border-red-300 text-red-700 hover:bg-red-100"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Find Nearest Facility
            </Button>
          </CardContent>
        </Card>

        {/* Quick Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Quick Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" asChild className="h-12 justify-start">
                <Link href="/chat">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Chat with Health Assistant
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 justify-start">
                <Link href="/vitals">
                  <Heart className="w-5 h-5 mr-3" />
                  Record Vitals
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 justify-start">
                <Link href="/dashboard">
                  <Heart className="w-5 h-5 mr-3" />
                  View Health Summary
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">Dr. Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Primary Care Physician</div>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">Emergency Contact</div>
                  <div className="text-sm text-muted-foreground">+234 XXX XXX XXXX</div>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Support Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Emergency Support:</span>
                <span className="font-medium">24/7</span>
              </div>
              <div className="flex justify-between">
                <span>Health Assistant:</span>
                <span className="font-medium">24/7</span>
              </div>
              <div className="flex justify-between">
                <span>Medical Consultation:</span>
                <span className="font-medium">8 AM - 6 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-2">Important Notice:</p>
              <p>SafeMama is a health monitoring platform and does not replace emergency medical services. In case of a medical emergency, please call your local emergency number immediately.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
