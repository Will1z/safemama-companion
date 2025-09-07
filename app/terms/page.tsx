"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 2024</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using SafeMama, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">2. Medical Disclaimer</h3>
              <p className="text-muted-foreground">
                SafeMama is a health monitoring platform and does not provide medical advice, diagnosis, or treatment. 
                Always consult with qualified healthcare professionals for medical concerns. In case of emergency, 
                contact your local emergency services immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">3. User Responsibilities</h3>
              <p className="text-muted-foreground">
                Users are responsible for providing accurate health information and using the platform responsibly. 
                You agree not to misuse the service or provide false information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">4. Data Privacy</h3>
              <p className="text-muted-foreground">
                We are committed to protecting your health data. Please review our Privacy Policy for details on 
                how we collect, use, and protect your information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">5. Service Availability</h3>
              <p className="text-muted-foreground">
                We strive to maintain service availability but cannot guarantee uninterrupted access. 
                We reserve the right to modify or discontinue the service at any time.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">6. Limitation of Liability</h3>
              <p className="text-muted-foreground">
                SafeMama shall not be liable for any indirect, incidental, special, or consequential damages 
                resulting from the use or inability to use the service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">7. Contact Information</h3>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at legal@safemama.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
