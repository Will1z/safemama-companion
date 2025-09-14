"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  agentId: string;            // e.g. "agent_1801k4hn9rxzfbrv3qes5yn7z9eg"
  height?: number;            // container height
};

export default function ElevenLabsWidget({ agentId, height = 440 }: Props) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

  // 1) Inject script once on client
  useEffect(() => {
    const id = "elevenlabs-convai-script";
    if (document.getElementById(id)) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = SCRIPT_SRC;
    s.type = "text/javascript";
    s.onload = () => setReady(true);
    s.onerror = () => console.error("Failed to load ElevenLabs widget script");
    document.body.appendChild(s);
  }, []);

  // 2) Mount the custom element when script is ready
  useEffect(() => {
    if (!ready || !holderRef.current) return;

    // Clear old children if re-mounted
    holderRef.current.innerHTML = "";

    // Create the custom element <elevenlabs-convai agent-id="...">
    const el = document.createElement("elevenlabs-convai");
    el.setAttribute("agent-id", agentId);

    // Optional: styling so it's visible
    el.style.display = "block";
    el.style.width = "100%";
    el.style.height = "100%";

    holderRef.current.appendChild(el);
  }, [ready, agentId]);

  return (
    <div
      ref={holderRef}
      style={{
        width: "100%",
        height,
        border: "1px solid rgb(223, 227, 235)",
        borderRadius: 12,
        overflow: "hidden",
        background: "rgb(250, 250, 250)",
      }}
    >
      {!ready && (
        <div style={{ padding: 12, fontSize: 14 }}>
          Loading voice assistant…
        </div>
      )}
    </div>
  );
}