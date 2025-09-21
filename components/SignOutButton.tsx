'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function SignOutButton({ 
  className = '', 
  variant = 'ghost', 
  size = 'default' 
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      console.info('Signout success');
      
      // Clear demo cookie if present
      document.cookie = 'sm_demo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Clear localStorage
      localStorage.removeItem('demo_user');
      localStorage.removeItem('authed');
      localStorage.removeItem('user_email');
      
      // Redirect to signin
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
