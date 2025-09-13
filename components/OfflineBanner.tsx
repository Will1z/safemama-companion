"use client";
import { useEffect, useState } from "react";
export default function OfflineBanner() {
  const [online, setOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const on = () => {
      setOnline(true);
      setShowBanner(false);
    };
    const off = () => {
      setOnline(false);
      // Only show banner after a delay to avoid false positives on mobile
      setTimeout(() => setShowBanner(true), 2000);
    };
    
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    
    // Initial check with delay for mobile browsers
    setTimeout(() => {
      setOnline(navigator.onLine);
      if (!navigator.onLine) {
        setShowBanner(true);
      }
    }, 1000);
    
    return () => { 
      window.removeEventListener("online", on); 
      window.removeEventListener("offline", off); 
    };
  }, []);
  
  if (online || !showBanner) return null;
  
  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-800 text-sm px-3 py-2 text-center">
      You're offline — we'll sync and send messages when you reconnect.
    </div>
  );
}
