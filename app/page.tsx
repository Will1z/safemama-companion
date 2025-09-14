'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Tile from '@/components/ui/Tile';
import { 
  Heart, 
  Clock, 
  Brain, 
  Users, 
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { RiskCards } from '@/components/home/RiskCards';
import { AuthAwareCard } from '@/components/ui/AuthAwareCard';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair font-semibold text-xl text-primary">SafeMama</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'rgb(140, 200, 205)' }}>
        <div className="absolute inset-0 bg-[url('/images/maternal-care-pattern.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="h1-clamp font-playfair font-bold mb-6">
              Your Journey to{' '}
              <span className="text-accent">Safe Motherhood</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Comprehensive maternal health platform connecting expecting mothers with healthcare professionals for safer, healthier pregnancies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div className="text-center">
                <Button size="lg" variant="accent" asChild>
                  <Link href="/onboarding" className="flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <p className="text-sm text-white/80 mt-2">Takes 2–3 minutes</p>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-lg font-semibold">24/7</div>
                <div className="text-sm text-white/80">Support Available</div>
              </div>
              <div className="text-center">
                <Brain className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-lg font-semibold">AI-Powered</div>
                <div className="text-sm text-white/80">Health Monitoring</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-lg font-semibold">Expert</div>
                <div className="text-sm text-white/80">Medical Network</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              Comprehensive Care Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Innovative features designed to support you throughout your pregnancy journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* AI Health Monitoring - Clickable to vitals */}
            <AuthAwareCard
              href="/vitals"
              feature="ai-health-monitoring"
              icon={<Brain className="w-6 h-6 text-[rgb(var(--primary-foreground))]" />}
              title="AI Health Monitoring"
              description="Intelligent symptom tracking and risk assessment"
              className="bg-[rgb(var(--primary))]/20 border-[rgb(var(--primary))]/30"
            />

            {/* Emergency Response - Clickable to help */}
            <Link
              href="/help"
              className="group block rounded-2xl border p-4 shadow-soft bg-[rgb(var(--destructive))]/20 border-[rgb(var(--destructive))]/30 transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <ShieldCheck className="w-6 h-6 text-[rgb(var(--destructive-foreground))]" />
                </div>
                <div>
                  <div className="font-heading text-xl text-[rgb(var(--destructive-foreground))]">Emergency Response</div>
                  <div className="text-sm mt-1 text-[rgb(var(--destructive-foreground))]/80">Instant access to emergency contacts and facilities</div>
                </div>
              </div>
            </Link>

            {/* Expert Network - Clickable to community */}
            <AuthAwareCard
              href="/community"
              feature="community"
              icon={<Users className="w-6 h-6 text-[rgb(var(--primary-foreground))]" />}
              title="Expert Network"
              description="Connect with qualified healthcare professionals"
            />

            {/* Smart Reminders - Clickable to dashboard */}
            <AuthAwareCard
              href="/dashboard"
              feature="dashboard"
              icon={<Calendar className="w-6 h-6 text-[rgb(var(--primary-foreground))]" />}
              title="Smart Reminders"
              description="Never miss important appointments or medication"
            />

            {/* Facility Locator - Clickable to facilities page */}
            <Link
              href="/facilities"
              className="group block rounded-2xl border p-4 shadow-soft bg-white border-[rgb(var(--border))] transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <MapPin className="w-6 h-6 text-[rgb(var(--primary-foreground))]" />
                </div>
                <div>
                  <div className="font-heading text-xl text-[rgb(var(--primary-foreground))]">Facility Locator</div>
                  <div className="text-sm mt-1 text-muted-foreground">Find the nearest healthcare facilities</div>
                </div>
              </div>
            </Link>

            {/* 24/7 Communication - Clickable to chat */}
            <AuthAwareCard
              href="/chat"
              feature="chat"
              icon={<Phone className="w-6 h-6 text-[rgb(var(--primary-foreground))]" />}
              title="24/7 Communication"
              description="Stay connected with your healthcare team"
            />
          </div>
        </div>
      </section>

      {/* Risk Assessment Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              Intelligent Risk Assessment
            </h2>
            <p className="text-lg text-muted-foreground">
              Our advanced triage system provides personalized care recommendations
            </p>
          </div>

          <RiskCards />
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: 'rgb(140, 200, 205)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Safe Journey?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of expecting mothers who trust SafeMama for their maternal health needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="accent" asChild>
                <Link href="/onboarding">Get Started Free</Link>
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>No Setup Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair font-semibold text-xl">SafeMama</span>
            </div>
            <div className="text-center text-white/80">
              <p>
                © 2024 SafeMama. All rights reserved. 
                <br className="sm:hidden" />
                <span className="hidden sm:inline ml-2">|</span>
                <span className="sm:ml-2">Empowering safer pregnancies worldwide.</span>
              </p>
              {process.env.NEXT_PUBLIC_SHOW_DEBUG_LINKS === "true" && (
                <p className="mt-2">
                  <Link href="/unregister-sw" className="text-white/60 hover:text-white underline text-sm">
                    Clear Cache (Dev)
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}