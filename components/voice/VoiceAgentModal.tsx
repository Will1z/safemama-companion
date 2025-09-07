"use client";
import ElevenLabsWidget from "./ElevenLabsWidget";

type Props = { onClose: () => void };

export default function VoiceAgentModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30">
      <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white dark:bg-[#121B21] p-5">
        <div className="mx-auto max-w-4xl">
          {/* ElevenLabs Widget - Only Interface */}
          <ElevenLabsWidget 
            agentId="agent_1801k4hn9rxzfbrv3qes5yn7z9eg"
            height={500}
          />
        </div>
      </div>
    </div>
  );
}