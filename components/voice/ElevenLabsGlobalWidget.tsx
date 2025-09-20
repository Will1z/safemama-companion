"use client";
import { useEffect, useRef, useState } from "react";
import DraggableFabMic from "@/components/ui/DraggableFabMic";

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


  // Widget modal style
  const widgetModalStyle = {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    height: height,
    background: "rgb(250, 250, 250)",
    border: "1px solid rgb(223, 227, 235)",
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
    background: "rgb(194, 227, 226)",
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
      {/* Draggable Floating Button */}
      <DraggableFabMic onClick={toggleOpen} />

      {/* Backdrop */}
      <div style={backdropStyle} onClick={closeWidget} />

      {/* Widget Modal */}
      <div style={widgetModalStyle}>
        {/* Close Button */}
        <button
          onClick={closeWidget}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgb(181, 229, 247)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgb(194, 227, 226)";
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
              color: "rgb(71, 85, 105)",
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