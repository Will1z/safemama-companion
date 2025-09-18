import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, ShieldCheck, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EAF7F6] to-[#DDF1F0]"></div>
      
      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="marketing-heading text-5xl md:text-6xl tracking-tight">
                A gentle antenatal companion for{' '}
                <span className="marketing-accent">every mother</span>
              </h1>
              <p className="marketing-text text-xl leading-relaxed max-w-2xl">
                SafeMama listens, supports, and helps you share updates with your clinician. 
                Experience pregnancy with confidence and peace of mind.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-pastel text-lg px-8 py-4">
                <Link href="/auth/signin" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))] hover:text-white">
                <Link href="/chat" className="flex items-center">
                  <Heart className="mr-2 w-5 h-5" />
                  Talk to SafeMama
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[rgb(var(--accent-2))]" />
                <span className="text-sm text-[rgb(var(--ink))]/70">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[rgb(var(--accent-2))]" />
                <span className="text-sm text-[rgb(var(--ink))]/70">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-[rgb(var(--accent-2))]" />
                <span className="text-sm text-[rgb(var(--ink))]/70">Free to Start</span>
              </div>
            </div>
          </div>

          {/* Right content - Phone mockup */}
          <div className="relative">
            <div className="relative mx-auto max-w-sm">
              {/* Phone frame */}
              <div className="relative bg-[rgb(var(--ink))] rounded-[3rem] p-2 shadow-2xl">
                <div className="bg-[rgb(var(--surface))] rounded-[2.5rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="h-8 bg-[rgb(var(--primary))] flex items-center justify-center">
                    <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                  </div>
                  
                  {/* App content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[rgb(var(--accent))] rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-[rgb(var(--ink))]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[rgb(var(--ink))]">SafeMama</div>
                        <div className="text-xs text-[rgb(var(--ink))]/60">Your pregnancy companion</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-[rgb(var(--accent))]/20 rounded-xl p-3">
                        <div className="text-sm font-medium text-[rgb(var(--ink))]">How are you feeling today?</div>
                        <div className="text-xs text-[rgb(var(--ink))]/60 mt-1">Tap to record your voice</div>
                      </div>
                      
                      <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--accent))]/30 rounded-xl p-3">
                        <div className="text-sm text-[rgb(var(--ink))]">Week 24 • Second Trimester</div>
                        <div className="text-xs text-[rgb(var(--ink))]/60">Your baby is growing rapidly</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[rgb(var(--accent))] rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-[rgb(var(--ink))]" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[rgb(var(--accent-2))] rounded-full flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
