'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw } from 'lucide-react';

export default function UnregisterSWPage() {
  const [isClearing, setIsClearing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const clearServiceWorkerAndCaches = async () => {
    setIsClearing(true);
    
    try {
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }

      setIsCleared(true);
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error clearing service worker and caches:', error);
    } finally {
      setIsClearing(false);
    }
  };

  // Auto-clear on page load
  useEffect(() => {
    clearServiceWorkerAndCaches();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isCleared ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <RefreshCw className={`h-6 w-6 ${isClearing ? 'animate-spin' : ''}`} />
            )}
            Service Worker Cache Clear
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isClearing && (
            <p className="text-gray-600">
              Clearing offline cache and service workers...
            </p>
          )}
          
          {isCleared && (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">
                ✅ Cleared offline cache. Please reopen the app.
              </p>
              <p className="text-sm text-gray-500">
                The page will reload automatically in a moment.
              </p>
            </div>
          )}

          {!isClearing && !isCleared && (
            <div className="space-y-4">
              <p className="text-gray-600">
                This page will clear all service worker registrations and browser caches.
              </p>
              <Button onClick={clearServiceWorkerAndCaches} className="w-full">
                Clear Cache & Reload
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
