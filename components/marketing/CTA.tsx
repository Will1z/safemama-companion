import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Clock } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#EAF7F6] to-[#DDF1F0]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="marketing-heading text-3xl md:text-4xl">
                Ready to feel <span className="marketing-accent">supported</span>?
              </h2>
              <p className="marketing-text text-lg max-w-2xl mx-auto">
                Join thousands of mothers who trust SafeMama for their pregnancy journey. 
                Get started in minutes and experience the difference.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-pastel text-lg px-8 py-4">
                <Link href="/auth/signin" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))] hover:text-white">
                <Link href="/demo" className="flex items-center">
                  <Heart className="mr-2 w-5 h-5" />
                  Request Demo
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[rgb(var(--ink))]/70">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[rgb(var(--accent-2))]" />
                <span>Takes 2-3 minutes to get started</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-[rgb(var(--accent-2))]" />
                <span>Free to start, no credit card required</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="pt-8">
              <div className="inline-flex items-center space-x-4 bg-white/50 rounded-full px-6 py-3 border border-black/5">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${i % 2 === 0 ? 'rgb(var(--accent))' : 'rgb(var(--accent-2))'}, ${i % 2 === 0 ? 'rgb(var(--accent-2))' : 'rgb(var(--accent))'})`
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-[rgb(var(--ink))]/70">
                  Join <span className="font-semibold text-[rgb(var(--ink))]">50,000+</span> mothers already using SafeMama
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
