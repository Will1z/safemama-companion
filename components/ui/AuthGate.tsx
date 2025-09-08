'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, User, Mail, Smartphone } from 'lucide-react';

interface AuthGateProps {
  onAuthed: () => void;
  reason: string;
  children: React.ReactNode;
}

export function AuthGate({ onAuthed, reason, children }: AuthGateProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check localStorage for auth status
    const authed = localStorage.getItem('authed') === 'true';
    setIsAuthed(authed);
  }, []);

  const handleClick = () => {
    if (isAuthed) {
      onAuthed();
    } else {
      setShowModal(true);
    }
  };

  const handleSignIn = () => {
    // Redirect to signin with return URL
    const currentUrl = window.location.pathname + window.location.search;
    window.location.href = `/auth/signin?next=${encodeURIComponent(currentUrl)}`;
  };

  const handleMagicLink = () => {
    // Stub for magic link/OTP
    alert('Magic link feature coming soon!');
  };

  const handleContinueAsGuest = () => {
    setShowModal(false);
  };

  const handleSignOut = () => {
    localStorage.setItem('authed', 'false');
    setIsAuthed(false);
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Sign in required
            </DialogTitle>
            <DialogDescription>
              To {reason.toLowerCase()}, please sign in to your account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Choose how you'd like to continue:
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleSignIn} 
                className="w-full justify-start"
                variant="primary"
              >
                <User className="w-4 h-4 mr-2" />
                Sign in with email
              </Button>
              
              <Button 
                onClick={handleMagicLink} 
                className="w-full justify-start"
                variant="outline"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send magic link
              </Button>
              
              <Button 
                onClick={handleContinueAsGuest} 
                className="w-full justify-start"
                variant="ghost"
              >
                Continue as guest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook for auth state management
export function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const authed = localStorage.getItem('authed') === 'true';
    setIsAuthed(authed);
  }, []);

  const signIn = (url?: string) => {
    const returnUrl = url || window.location.pathname + window.location.search;
    window.location.href = `/auth/signin?next=${encodeURIComponent(returnUrl)}`;
  };

  const signOut = () => {
    localStorage.setItem('authed', 'false');
    setIsAuthed(false);
  };

  const setAuthed = (authed: boolean) => {
    localStorage.setItem('authed', authed.toString());
    setIsAuthed(authed);
  };

  return {
    isAuthed,
    signIn,
    signOut,
    setAuthed
  };
}
