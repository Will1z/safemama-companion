"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { checkAuthStatus, checkAuthStatusSync, getAuthRedirectUrl, getFeatureAuthStatus } from '@/lib/auth-utils';
import { LogIn, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface AuthAwareButtonProps {
  href: string;
  feature: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default';
  asChild?: boolean;
  onClick?: () => void;
}

export function AuthAwareButton({ 
  href, 
  feature, 
  children, 
  className = '', 
  variant = 'primary',
  size = 'default',
  asChild = false,
  onClick
}: AuthAwareButtonProps) {
  const { authed, isDemo } = useAuth();
  const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, isLoading: true });
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // If demo user, immediately set as authenticated
    if (isDemo) {
      setAuthStatus({ isAuthenticated: true, isLoading: false });
      return;
    }
    
    // If already authenticated from context, use that
    if (authed) {
      setAuthStatus({ isAuthenticated: true, isLoading: false });
      return;
    }
    
    // Fallback to async check for regular users
    checkAuthStatus().then(setAuthStatus);
  }, [authed, isDemo]);

  const featureAuth = getFeatureAuthStatus(feature);
  const isProtected = featureAuth.requiresAuth && !authStatus.isAuthenticated;

  const handleClick = (e: React.MouseEvent) => {
    if (isProtected) {
      e.preventDefault();
      setShowAuthModal(true);
      return;
    }
    
    if (onClick) {
      onClick();
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleSignIn = () => {
    window.location.href = getAuthRedirectUrl(href);
  };

  const handleSignUp = () => {
    window.location.href = '/auth/signup';
  };

  if (authStatus.isLoading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={`${className} opacity-50`}
        disabled
      >
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${className} ${isProtected ? 'opacity-75 hover:opacity-90' : ''}`}
        asChild={!isProtected && asChild}
        onClick={isProtected ? handleClick : undefined}
      >
        {isProtected ? (
          <span className="flex items-center">
            {children}
            <User className="w-4 h-4 ml-2 opacity-60" />
          </span>
        ) : asChild ? (
          <Link href={href}>{children}</Link>
        ) : (
          <Link href={href}>{children}</Link>
        )}
      </Button>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <LogIn className="w-5 h-5 text-primary" />
              <span>Sign In Required</span>
            </DialogTitle>
            <DialogDescription>
              {featureAuth.message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleSignIn} 
              className="w-full"
              variant="primary"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            
            <Button 
              onClick={handleSignUp} 
              className="w-full"
              variant="outline"
            >
              <User className="w-4 h-4 mr-2" />
              Create Account
            </Button>
            
            <div className="text-center">
              <button
                onClick={handleAuthModalClose}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Maybe later
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
