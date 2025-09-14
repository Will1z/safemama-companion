"use client";
import { useState } from "react";
import ElevenLabsWidget from "./ElevenLabsWidget";

export default function VoiceAgentButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={`rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] px-4 py-2 font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--accent))] hover:brightness-95 transition-colors duration-200 ${className}`}
        onClick={() => setOpen(true)}
        aria-label="Talk to AI"
      >
        Talk to AI
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white dark:bg-slate-900 p-5">
            <div className="mx-auto max-w-4xl">
              <ElevenLabsWidget 
                agentId="agent_1801k4hn9rxzfbrv3qes5yn7z9eg"
                height={500}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
