import { useState, useCallback } from 'react';

interface MarkTakenResponse {
  ok: boolean;
  demo?: boolean;
  error?: string;
}

interface DemoIntake {
  medicationId: string;
  takenAt: string;
}

export function useMarkMedication() {
  const [loading, setLoading] = useState<string | null>(null);

  const markTaken = useCallback(async (medicationId: string): Promise<boolean> => {
    if (loading === medicationId) return false; // Prevent duplicate calls
    
    setLoading(medicationId);
    
    try {
      const response = await fetch('/api/meds/mark-taken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({ medicationId })
      });

      const result: MarkTakenResponse = await response.json();
      
      if (result.ok) {
        if (result.demo) {
          // Store in localStorage for demo mode
          const existing = JSON.parse(localStorage.getItem('safemama_demo_intakes') || '[]');
          const newIntake: DemoIntake = {
            medicationId,
            takenAt: new Date().toISOString()
          };
          localStorage.setItem('safemama_demo_intakes', JSON.stringify([...existing, newIntake]));
        }
        return true;
      } else {
        console.error('Failed to mark medication as taken:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      return false;
    } finally {
      setLoading(null);
    }
  }, [loading]);

  const undoTaken = useCallback(async (medicationId: string): Promise<boolean> => {
    if (loading === medicationId) return false; // Prevent duplicate calls
    
    setLoading(medicationId);
    
    try {
      const response = await fetch('/api/meds/mark-taken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({ medicationId, undo: true })
      });

      const result: MarkTakenResponse = await response.json();
      
      if (result.ok) {
        if (result.demo) {
          // Remove from localStorage for demo mode
          const existing: DemoIntake[] = JSON.parse(localStorage.getItem('safemama_demo_intakes') || '[]');
          const filtered = existing.filter(intake => intake.medicationId !== medicationId);
          localStorage.setItem('safemama_demo_intakes', JSON.stringify(filtered));
        }
        return true;
      } else {
        console.error('Failed to undo medication intake:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error undoing medication intake:', error);
      return false;
    } finally {
      setLoading(null);
    }
  }, [loading]);

  const isTaken = useCallback((medicationId: string): boolean => {
    // Check localStorage for demo mode
    const existing: DemoIntake[] = JSON.parse(localStorage.getItem('safemama_demo_intakes') || '[]');
    return existing.some(intake => intake.medicationId === medicationId);
  }, []);

  const getLastTakenTime = useCallback((medicationId: string): string | null => {
    // Get last taken time from localStorage for demo mode
    const existing: DemoIntake[] = JSON.parse(localStorage.getItem('safemama_demo_intakes') || '[]');
    const intake = existing.find(i => i.medicationId === medicationId);
    return intake ? intake.takenAt : null;
  }, []);

  const formatTimeAgo = useCallback((timestamp: string): string => {
    const now = new Date();
    const taken = new Date(timestamp);
    const diffMs = now.getTime() - taken.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }, []);

  return {
    markTaken,
    undoTaken,
    isTaken,
    getLastTakenTime,
    formatTimeAgo,
    loading: loading !== null,
    loadingMedicationId: loading
  };
}
