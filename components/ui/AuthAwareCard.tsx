"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { checkAuthStatus, getAuthRedirectUrl, getFeatureAuthStatus } from '@/lib/auth-utils';
import { User, Lock } from 'lucide-react';

interface AuthAwareCardProps {
  href: string;
  feature: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function AuthAwareCard({ 
  href, 
  feature, 
  children, 
  className = '',
  icon,
  title,
  description
}: AuthAwareCardProps) {
  const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, isLoading: true });

  useEffect(() => {
    checkAuthStatus().then(setAuthStatus);
  }, []);

  const featureAuth = getFeatureAuthStatus(feature);
  const isProtected = featureAuth.requiresAuth && !authStatus.isAuthenticated;

  const handleClick = (e: React.MouseEvent) => {
    if (isProtected) {
      e.preventDefault();
      window.location.href = getAuthRedirectUrl(href);
      return;
    }
  };

  if (authStatus.isLoading) {
    return (
      <div className={`group block rounded-2xl border p-4 shadow-soft bg-white border-[rgb(var(--border))] cursor-default transition-all duration-300 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 opacity-50">
            {icon}
          </div>
          <div>
            <div className="font-heading text-xl text-[rgb(var(--primary-foreground))] opacity-50">{title}</div>
            <div className="text-sm mt-1 text-muted-foreground opacity-50">{description}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`group block rounded-2xl border p-4 shadow-soft transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        isProtected 
          ? 'bg-white border-[rgb(var(--border))] opacity-75 hover:opacity-90' 
          : 'bg-white border-[rgb(var(--border))]'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 relative">
          {icon}
          {isProtected && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-heading text-xl text-[rgb(var(--primary-foreground))] flex items-center gap-2">
            {title}
            {isProtected && <User className="w-4 h-4 opacity-60" />}
          </div>
          <div className="text-sm mt-1 text-muted-foreground">
            {isProtected ? `${description} (Sign in required)` : description}
          </div>
        </div>
      </div>
    </Link>
  );
}
