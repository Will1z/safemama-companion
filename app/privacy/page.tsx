"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
              <Link href="/auth/signup">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 2024</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Information We Collect</h3>
              <p className="text-muted-foreground">
                We collect health information you provide, including pregnancy details, symptoms, vitals, 
                and emergency contacts. We also collect usage data to improve our services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">2. How We Use Your Information</h3>
              <p className="text-muted-foreground">
                Your health data is used to provide personalized health monitoring, risk assessments, 
                and emergency assistance. We never sell your personal health information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">3. Data Security</h3>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your health data, 
                including encryption, secure servers, and access controls.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">4. Data Sharing</h3>
              <p className="text-muted-foreground">
                We only share your health information with your consent or in emergency situations 
                with healthcare providers and emergency responders.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">5. Your Rights</h3>
              <p className="text-muted-foreground">
                You have the right to access, update, or delete your health data. You can also 
                opt out of certain communications and data processing activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">6. HIPAA Compliance</h3>
              <p className="text-muted-foreground">
                SafeMama is designed to comply with applicable health privacy regulations, 
                including HIPAA where applicable.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">7. Contact Us</h3>
              <p className="text-muted-foreground">
                For privacy-related questions or concerns, please contact us at privacy@safemama.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
