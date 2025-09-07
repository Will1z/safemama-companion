import dynamic from "next/dynamic";

const ElevenLabsWidget = dynamic(
  () => import("@/components/voice/ElevenLabsWidget"),
  { ssr: false }
);

export default function Page() {
  return (
    <div style={{ maxWidth: 780, margin: "40px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 16 }}>Safemama Voice (Test)</h1>
      <p style={{ marginBottom: 24 }}>
        If you can see the widget below, your embed works. If not, we debug layout or script.
      </p>
      <ElevenLabsWidget agentId="agent_1801k4hn9rxzfbrv3qes5yn7z9eg" height={480} />
    </div>
  );
}
