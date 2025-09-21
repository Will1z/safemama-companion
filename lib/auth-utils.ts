import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';

export interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

// Feature flag for real authentication
export function isRealAuthEnabled(): boolean {
  return process.env.ENABLE_REAL_AUTH === 'true';
}

// Server-side demo check
export function isDemo(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie');
  return cookieHeader?.includes('sm_demo=1') || false;
}

// Server-side user profile ensure function (idempotent)
export async function ensureProfile(userId: string, displayName?: string) {
  const supabase = createServerClient();
  
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!existingProfile) {
    // Create profile (upsert style - idempotent)
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        display_name: displayName || 'User',
        role: 'patient'
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }
}

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    // First check for demo user in localStorage (synchronous)
    if (typeof window !== 'undefined') {
      const isDemoUser = localStorage.getItem('demo_user') === 'true';
      const isAuthed = localStorage.getItem('authed') === 'true';
      
      if (isDemoUser || isAuthed) {
        return {
          isAuthenticated: true,
          isLoading: false,
          user: { 
            id: 'demo-user', 
            email: 'mama@mama.com',
            isDemo: isDemoUser 
          }
        };
      }
    }
    
    // Fallback to Supabase authentication
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

// Synchronous version for immediate demo user checks
export function checkAuthStatusSync(): AuthStatus {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null
    };
  }
  
  const isDemoUser = localStorage.getItem('demo_user') === 'true';
  const isAuthed = localStorage.getItem('authed') === 'true';
  
  if (isDemoUser || isAuthed) {
    return {
      isAuthenticated: true,
      isLoading: false,
      user: { 
        id: 'demo-user', 
        email: 'mama@mama.com',
        isDemo: isDemoUser 
      }
    };
  }
  
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null
  };
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
