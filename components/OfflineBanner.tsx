"use client";
import { useEffect, useState } from "react";
export default function OfflineBanner() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    setOnline(navigator.onLine);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (online) return null;
  return (
    <div className="w-full bg-[#FFF3CD] text-[#4A3A00] text-sm px-3 py-2 text-center">
      You're offline — we'll sync and send messages when you reconnect.
    </div>
  );
}
