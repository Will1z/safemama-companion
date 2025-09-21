'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import clsx from 'clsx';

export default function DraggableFabMic({ onClick }: { onClick?: () => void }) {
  const key = 'safemama_fab_pos';
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{x:number;y:number}|null>(null);
  const [drag, setDrag] = useState(false);
  const [dragStart, setDragStart] = useState<{x:number;y:number} | null>(null);
  const [clicked, setClicked] = useState(false);

  // Load saved position
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { 
        const saved = JSON.parse(raw);
        setPos(saved);
      } catch {}
    }
  }, []);

  // Default position
  useEffect(() => {
    if (!pos) {
      setPos({ 
        x: Math.max(16, window.innerWidth - 84), 
        y: Math.max(16, window.innerHeight - 140) 
      });
    }
  }, [pos]);

  // Save position
  useEffect(() => {
    if (!pos) return;
    localStorage.setItem(key, JSON.stringify(pos));
  }, [pos]);

  // Handle window resize
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

  // Improved drag handling
  const startDrag = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const button = e.currentTarget as HTMLElement;
    button.setPointerCapture(e.pointerId);
    
    setDrag(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setClicked(false);
  }, []);

  const move = useCallback((e: React.PointerEvent) => {
    if (!drag || !dragStart) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Only start dragging after a small movement to distinguish from click
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setClicked(false);
      
      if (pos) {
        const newX = Math.min(Math.max(16, pos.x + deltaX), window.innerWidth - 72);
        const newY = Math.min(Math.max(16, pos.y + deltaY), window.innerHeight - 72 - 34);
        setPos({ x: newX, y: newY });
      }
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [drag, dragStart, pos]);

  const endDrag = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const button = e.currentTarget as HTMLElement;
    button.releasePointerCapture(e.pointerId);
    
    setDrag(false);
    setDragStart(null);
    
    // If it was a click (no significant movement), trigger onClick
    if (clicked && onClick) {
      onClick();
    }
  }, [clicked, onClick]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!drag) {
      setClicked(true);
      if (onClick) {
        onClick();
      }
    }
  }, [drag, onClick]);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Voice assistant"
      onClick={handleClick}
      onPointerDown={startDrag}
      onPointerMove={move}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onTouchStart={(e) => e.preventDefault()} // Prevent default touch behavior
      className={clsx(
        'fixed z-50 h-14 w-14 rounded-full shadow-xl bg-primary text-white flex items-center justify-center',
        'touch-manipulation select-none cursor-grab active:cursor-grabbing',
        'transition-transform duration-150 ease-out',
        drag && 'scale-105 shadow-2xl',
        'hover:scale-105 hover:shadow-2xl'
      )}
      style={pos ? { 
        left: pos.x, 
        top: pos.y,
        transform: drag ? 'scale(1.05)' : 'scale(1)',
        transition: drag ? 'none' : 'transform 0.15s ease-out'
      } : undefined}
    >
      {/* mic icon svg */}
      <svg viewBox="0 0 24 24" className="h-6 w-6 pointer-events-none">
        <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V20H9v2h6v-2h-2v-2.08A7 7 0 0 0 19 11h-2z"/>
      </svg>
    </button>
  );
}
