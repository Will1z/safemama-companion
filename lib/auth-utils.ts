import { createClient } from '@/lib/supabase/client';

export interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    return {
      isAuthenticated: !!user && !error,
      isLoading: false,
      user: user
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null
    };
  }
}

export function getAuthRedirectUrl(originalPath: string): string {
  return `/auth/signin?redirect=${encodeURIComponent(originalPath)}`;
}

export function shouldRequireAuth(path: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/vitals',
    '/chat',
    '/me',
    '/call-history',
    '/summary',
    '/settings',
    '/community' // Community might be protected depending on your requirements
  ];
  
  return protectedPaths.some(protectedPath => path.startsWith(protectedPath));
}

export function getFeatureAuthStatus(feature: string): {
  requiresAuth: boolean;
  message: string;
} {
  const authRequiredFeatures = {
    'ai-health-monitoring': { requiresAuth: true, message: 'Sign in to access AI health monitoring' },
    'chat': { requiresAuth: true, message: 'Sign in to chat with health assistant' },
    'vitals': { requiresAuth: true, message: 'Sign in to record your health data' },
    'dashboard': { requiresAuth: true, message: 'Sign in to view your dashboard' },
    'community': { requiresAuth: false, message: 'Connect with other expecting mothers' },
    'facilities': { requiresAuth: false, message: 'Find nearest healthcare facilities' },
    'help': { requiresAuth: false, message: 'Get emergency help and support' },
    'learn': { requiresAuth: false, message: 'Access educational content' }
  };
  
  return authRequiredFeatures[feature as keyof typeof authRequiredFeatures] || 
    { requiresAuth: false, message: 'Access this feature' };
}
