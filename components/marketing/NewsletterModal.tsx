'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Heart, Mail } from 'lucide-react';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Show modal after 8 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    // Show modal after 40% scroll
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 40 && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter signup
      console.log('Newsletter signup:', email);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md marketing-card border-0">
        <DialogHeader className="text-center">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-[rgb(var(--ink))]/60 hover:text-[rgb(var(--ink))]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mx-auto w-12 h-12 bg-[rgb(var(--accent))]/20 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-[rgb(var(--accent))]" />
          </div>
          <DialogTitle className="text-xl font-bold text-[rgb(var(--ink))]">
            Stay connected with SafeMama
          </DialogTitle>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="space-y-4">
            <p className="text-center text-[rgb(var(--ink))]/70 text-sm">
              Get pregnancy tips, app updates, and exclusive content delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgb(var(--ink))]/40" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-[rgb(var(--accent))]/30 focus:border-[rgb(var(--accent))] focus:ring-[rgb(var(--accent))]/20"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-pastel"
                disabled={!email}
              >
                Subscribe to Updates
              </Button>
            </form>

            <p className="text-xs text-center text-[rgb(var(--ink))]/50">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[rgb(var(--accent))]/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-[rgb(var(--accent))]" />
            </div>
            <div>
              <h3 className="font-semibold text-[rgb(var(--ink))] mb-2">
                Thank you for subscribing!
              </h3>
              <p className="text-sm text-[rgb(var(--ink))]/70">
                You'll receive your first update soon.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
