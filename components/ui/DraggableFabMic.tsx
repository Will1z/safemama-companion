'use client';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function DraggableFabMic({ onClick }: { onClick?: () => void }) {
  const key = 'safemama_fab_pos';
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{x:number;y:number}|null>(null);
  const [drag, setDrag] = useState(false);

  // Load saved
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { setPos(JSON.parse(raw)); } catch {}
    }
  }, []);

  // Default position
  useEffect(() => {
    if (!pos) setPos({ x: window.innerWidth - 84, y: window.innerHeight - 140 });
  }, [pos]);

  useEffect(() => {
    if (!pos) return;
    localStorage.setItem(key, JSON.stringify(pos));
  }, [pos]);

  useEffect(() => {
    function onResize() {
      setPos(p => {
        if (!p) return p;
        const x = Math.min(Math.max(16, p.x), window.innerWidth - 72);
        const y = Math.min(Math.max(16, p.y), window.innerHeight - 72 - 34); // keep above iOS bar
        return { x, y };
      });
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function startDrag(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag(true);
  }
  function move(e: React.PointerEvent) {
    if (!drag) return;
    const x = Math.min(Math.max(16, e.clientX - 36), window.innerWidth - 72);
    const y = Math.min(Math.max(16, e.clientY - 36), window.innerHeight - 72);
    setPos({ x, y });
  }
  function endDrag(e: React.PointerEvent) {
    setDrag(false);
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Voice assistant"
      onClick={onClick}
      onPointerDown={startDrag}
      onPointerMove={move}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={clsx(
        'fixed z-50 h-14 w-14 rounded-full shadow-xl bg-primary text-white flex items-center justify-center',
        'touch-manipulation select-none'
      )}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
    >
      {/* mic icon svg here */}
      <svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V20H9v2h6v-2h-2v-2.08A7 7 0 0 0 19 11h-2z"/></svg>
    </button>
  );
}
