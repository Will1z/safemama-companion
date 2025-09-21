import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check for demo mode first
  const isDemo = request.cookies.get('sm_demo')?.value === '1';
  
  if (isDemo) {
    // Demo mode - allow access to all routes
    return response;
  }

  // Check if real auth is enabled
  const isRealAuthEnabled = process.env.ENABLE_REAL_AUTH === 'true';
  
  if (!isRealAuthEnabled) {
    // Real auth disabled - allow access to all routes (demo mode only)
    return response;
  }

  // Define protected routes (app areas that require authentication)
  const protectedRoutes = [
    '/dashboard', 
    '/vitals', 
    '/learn', 
    '/chat', 
    '/call-history', 
    '/summary', 
    '/settings', 
    '/me', 
    '/onboarding',
    '/community',
    '/facilities',
    '/help',
    '/doctor'
  ];
  
  // Define public routes (marketing, auth, static)
  const publicRoutes = [
    '/',
    '/privacy',
    '/terms',
    '/auth',
    '/demo',
    '/test-auth',
    '/test-voice',
    '/unregister-sw'
  ];
  
  // Define API routes that should remain public (webhooks, etc.)
  const publicApiRoutes = [
    '/api/voice/webhook',
    '/api/voice/send-report',
    '/api/voice/log-turn',
    '/api/voice/tts',
    '/api/voice/chat',
    '/api/voice/conversations',
    '/api/voice/summaries',
    '/api/voice/user-context',
    '/api/voicechat2/chat',
    '/api/voicechat2/transcribe',
    '/api/report/ingest',
    '/api/triage',
    '/api/facilities',
    '/api/labels',
    '/api/marketing/subscribe'
  ];

  const pathname = request.nextUrl.pathname;
  
  // Allow public routes
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute || isPublicApiRoute) {
    return response;
  }

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const supabase = createMiddlewareClient({ req: request, res: response });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // No authenticated user, redirect to signin
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
