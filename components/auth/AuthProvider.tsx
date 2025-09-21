"use client";
import * as React from "react";

type AuthState = { 
  authed: boolean; 
  isDemo: boolean; 
  user: { email: string; name?: string; role: "demo" | "user" } | null 
};

const AuthCtx = React.createContext<AuthState>({ 
  authed: false, 
  isDemo: false, 
  user: null 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ 
    authed: false, 
    isDemo: false, 
    user: null 
  });

  React.useEffect(() => {
    const checkAuth = () => {
      // Check for demo cookie first (immediate)
      const hasDemoCookie = typeof document !== "undefined" && document.cookie.includes("sm_demo=1");
      if (hasDemoCookie) {
        console.log('AuthProvider: Demo cookie detected');
        setState({ 
          authed: true, 
          isDemo: true, 
          user: { email: "chioma.ajibade@example.com", name: "Chioma Ajibade", role: "demo" } 
        });
        return;
      }
      
      // Check localStorage for demo user (for backward compatibility)
      const lsDemo = typeof window !== "undefined" && localStorage.getItem("demo_user") === "true";
      if (lsDemo) {
        console.log('AuthProvider: Demo localStorage detected, setting cookie');
        // Set demo cookie for server-side access and update state
        fetch("/api/auth/demo", { method: "POST" }).finally(() => {
          setState({ 
            authed: true, 
            isDemo: true, 
            user: { email: "chioma.ajibade@example.com", name: "Chioma Ajibade", role: "demo" } 
          });
        });
        return;
      }
      
      // Check for regular authentication
      const lsAuthed = typeof window !== "undefined" && localStorage.getItem("authed") === "true";
      if (lsAuthed) {
        console.log('AuthProvider: Regular auth detected');
        setState({ 
          authed: true, 
          isDemo: false, 
          user: { email: localStorage.getItem("user_email") || "user@example.com", role: "user" } 
        });
        return;
      }
      
      // No authentication found
      console.log('AuthProvider: No authentication found');
      setState({ 
        authed: false, 
        isDemo: false, 
        user: null 
      });
    };

    // Initial check
    checkAuth();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'demo_user' || e.key === 'authed') {
        console.log('AuthProvider: localStorage changed, rechecking auth');
        checkAuth();
      }
    };

    // Listen for custom events (for same-tab changes)
    const handleAuthChange = () => {
      console.log('AuthProvider: Auth change event received');
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return React.useContext(AuthCtx);
}
