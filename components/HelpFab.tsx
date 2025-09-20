"use client";
import { useState, useEffect } from "react";

export default function HelpFab() {
  const [open, setOpen] = useState(false);

  // Trap focus when open (simple)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed fab-safe right-5 z-50 rounded-full bg-[rgb(var(--destructive))] text-[rgb(var(--destructive-foreground))] px-5 py-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
        aria-haspopup="dialog"
        aria-label="I need help"
      >
        I need help
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-4 dark:bg-slate-900">
            <div className="mx-auto max-w-md">
              <div className="h-1 w-12 mx-auto rounded bg-gray-300/70 mb-3" />
              <h3 className="font-playfair text-xl mb-3">Get support</h3>
              <div className="grid grid-cols-1 gap-2">
                <button className="px-4 py-3 rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]">
                  Call emergency contact
                </button>
                <button className="px-4 py-3 rounded-xl border border-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-[rgb(var(--primary))]/10">
                  Send my location
                </button>
                <button className="px-4 py-3 rounded-xl border border-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-[rgb(var(--primary))]/10">
                  Nearest facility
                </button>
              </div>
              <button className="mt-4 text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
