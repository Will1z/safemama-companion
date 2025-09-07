"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  agentId?: string;
  height?: number;
  width?: string;
};

export default function ElevenLabsGlobalWidget({ 
  agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_1801k4hn9rxzfbrv3qes5yn7z9eg",
  height = 560,
  width = "400px"
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

  // Load the ElevenLabs script once
  useEffect(() => {
    const id = "elevenlabs-convai-script";
    if (document.getElementById(id)) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = SCRIPT_SRC;
    script.type = "text/javascript";
    script.onload = () => setReady(true);
    script.onerror = () => console.error("Failed to load ElevenLabs widget script");
    document.body.appendChild(script);
  }, []);

  // Render the widget when ready
  useEffect(() => {
    if (!ready || !containerRef.current || !isOpen) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = "";
    
    // Create the ElevenLabs Convai element
    const convaiElement = document.createElement("elevenlabs-convai");
    convaiElement.setAttribute("agent-id", agentId);
    convaiElement.style.display = "block";
    convaiElement.style.width = "100%";
    convaiElement.style.height = "100%";
    
    // Append to container
    containerRef.current.appendChild(convaiElement);
  }, [ready, agentId, isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };

  // Floating button style
  const floatingButtonStyle = {
    position: "fixed" as const,
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#1C3D3A",
    border: "none",
    cursor: "pointer",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease",
  };

  // Widget modal style
  const widgetModalStyle = {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    height: height,
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: 1001,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    display: isOpen ? "block" : "none"
  };

  // Close button style
  const closeButtonStyle = {
    position: "absolute" as const,
    top: "10px",
    right: "10px",
    background: "#1C3D3A",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "bold"
  };

  // Backdrop style
  const backdropStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: isOpen ? "block" : "none"
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleOpen}
        style={floatingButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2A4F4C";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1C3D3A";
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Voice Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </button>

      {/* Backdrop */}
      <div style={backdropStyle} onClick={closeWidget} />

      {/* Widget Modal */}
      <div style={widgetModalStyle}>
        {/* Close Button */}
        <button
          onClick={closeWidget}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2A4F4C";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1C3D3A";
          }}
        >
          ×
        </button>

        {/* Widget Container */}
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          {!ready && (
            <div style={{ 
              padding: "20px", 
              fontSize: "14px", 
              textAlign: "center",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%"
            }}>
              Loading voice assistant…
            </div>
          )}
        </div>
      </div>
    </>
  );
}