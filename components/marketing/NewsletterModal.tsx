'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Heart, Mail } from 'lucide-react';

// Storage keys for different suppression types
const SUBMIT_KEY = "safemama:nl:lastSubmitted";     // localStorage → 30d cooldown
const DISMISS_KEY = "safemama:nl:dismissedSession"; // sessionStorage → this session only

function submittedLast30d(days = 30) {
  if (typeof window === "undefined") return true;
  const v = window.localStorage.getItem(SUBMIT_KEY);
  if (!v) return false;
  const last = Number(v);
  return Date.now() - last < days * 24 * 60 * 60 * 1000;
}

function dismissedThisSession() {
  if (typeof window === "undefined") return true;
  return window.sessionStorage.getItem(DISMISS_KEY) === "1";
}

function markSubmittedNow() {
  try { window.localStorage.setItem(SUBMIT_KEY, String(Date.now())); } catch {}
}

function markDismissedForSession() {
  try { window.sessionStorage.setItem(DISMISS_KEY, "1"); } catch {}
}

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 1) Add refs + stable open guard at top of component:
  const openedRef = React.useRef(false);

  // 2) When open changes, lock/unlock body scroll (iOS-safe), and prevent auto-focus scroll jumps:
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.classList.add("modal-open");
    } else {
      body.classList.remove("modal-open");
    }
    return () => body.classList.remove("modal-open");
  }, [isOpen]);

  // 4) Replace your open-on-scroll effect with a one-shot guard (prevent re-opens/jitter):
  useEffect(() => {
    if (submittedLast30d() || dismissedThisSession() || openedRef.current) return;

    const tryOpen = () => {
      if (openedRef.current) return;
      openedRef.current = true;
      setIsOpen(true);
    };

    const t = setTimeout(tryOpen, 3000); // Reduced from 8000ms to 3000ms for faster testing
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / h.scrollHeight;
      if (!openedRef.current && scrolled >= 0.3) { // Reduced from 0.4 to 0.3 for easier triggering
        clearTimeout(t);
        tryOpen();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      markSubmittedNow();   // ← 30-day suppression
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(v) => {
        // If closing without submission, mark session-only dismissal
        if (!v) {
          // If they didn't just submit (i.e., SUBMIT_KEY not set right now), mark session dismiss
          if (!submittedLast30d()) markDismissedForSession();
        }
        setIsOpen(v);
      }}
    >
      <DialogOverlay className="fixed inset-0 z-[99] bg-black/50" />
      
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="
          fixed left-1/2 top-1/2 z-[100] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2
          rounded-2xl bg-white shadow-2xl p-6 sm:p-8
          focus:outline-none
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        "
      >
        <DialogHeader className="text-center">
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
              
              {error && (
                <p className="text-sm text-red-600 text-center">
                  {error}
                </p>
              )}
              
              <Button 
                type="submit" 
                className="w-full btn-pastel"
                disabled={!email || isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe to Updates"}
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
