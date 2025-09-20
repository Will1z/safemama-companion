import { useState, useEffect, useCallback } from 'react';
import { MedSchedule } from '@/lib/meds/schedule';

interface IntakeRecord {
  medicationId: string;
  takenAt: string;
  id?: string; // For Supabase records
}

export function useMedicationIntake(medId: string, sched: MedSchedule) {
  const [lastIntakeAt, setLastIntakeAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastIntakeId, setLastIntakeId] = useState<string | null>(null);

  // Load last intake on mount
  useEffect(() => {
    loadLastIntake();
  }, [medId]);

  const loadLastIntake = useCallback(async () => {
    try {
      // Check if we have authentication (demo mode uses localStorage)
      const isDemo = !localStorage.getItem('supabase_auth_token');
      
      if (isDemo) {
        // Demo mode: load from localStorage
        const demoIntakes = JSON.parse(localStorage.getItem('safemama_demo_intakes') || '[]');
        const medIntakes = demoIntakes.filter((intake: IntakeRecord) => intake.medicationId === medId);
        
        if (medIntakes.length > 0) {
          // Get the most recent intake
          const latest = medIntakes.sort((a: IntakeRecord, b: IntakeRecord) => 
            new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
          )[0];
          setLastIntakeAt(new Date(latest.takenAt));
          setLastIntakeId(latest.id || null);
        }
      } else {
        // Authenticated mode: load from Supabase
        const response = await fetch(`/api/meds/intakes/${medId}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.lastIntake) {
            setLastIntakeAt(new Date(data.lastIntake.taken_at));
            setLastIntakeId(data.lastIntake.id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading last intake:', error);
    }
  }, [medId]);

  const markTaken = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    
    setLoading(true);
    const now = new Date();
    
    try {
      const isDemo = !localStorage.getItem('supabase_auth_token');
      
      if (isDemo) {
        // Demo mode: store in localStorage
        const demoIntakes = JSON.parse(localStorage.getItem('safemama_demo_intakes') || '[]');
        const newIntake: IntakeRecord = {
          medicationId: medId,
          takenAt: now.toISOString(),
          id: `demo_${Date.now()}`
        };
        
        const updatedIntakes = [...demoIntakes, newIntake];
        localStorage.setItem('safemama_demo_intakes', JSON.stringify(updatedIntakes));
        
        setLastIntakeAt(now);
        setLastIntakeId(newIntake.id);
        return true;
      } else {
        // Authenticated mode: call API
        const response = await fetch('/api/meds/mark-taken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
          },
          body: JSON.stringify({ medicationId: medId })
        });
        
        const result = await response.json();
        if (result.ok) {
          setLastIntakeAt(now);
          setLastIntakeId(result.intakeId);
          return true;
        } else {
          console.error('Failed to mark medication as taken:', result.error);
          return false;
        }
      }
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [medId, loading]);

  const undoLast = useCallback(async (): Promise<boolean> => {
    if (loading || !lastIntakeAt) return false;
    
    setLoading(true);
    
    try {
      const isDemo = !localStorage.getItem('supabase_auth_token');
      
      if (isDemo) {
        // Demo mode: remove from localStorage
        const demoIntakes = JSON.parse(localStorage.getItem('safemama_demo_intakes') || '[]');
        const filteredIntakes = demoIntakes.filter((intake: IntakeRecord) => 
          !(intake.medicationId === medId && intake.id === lastIntakeId)
        );
        
        localStorage.setItem('safemama_demo_intakes', JSON.stringify(filteredIntakes));
        
        // Find the previous intake
        const remainingIntakes = filteredIntakes.filter((intake: IntakeRecord) => intake.medicationId === medId);
        if (remainingIntakes.length > 0) {
          const previous = remainingIntakes.sort((a: IntakeRecord, b: IntakeRecord) => 
            new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
          )[0];
          setLastIntakeAt(new Date(previous.takenAt));
          setLastIntakeId(previous.id || null);
        } else {
          setLastIntakeAt(null);
          setLastIntakeId(null);
        }
        
        return true;
      } else {
        // Authenticated mode: call API
        const response = await fetch('/api/meds/mark-taken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
          },
          body: JSON.stringify({ medicationId: medId, undo: true })
        });
        
        const result = await response.json();
        if (result.ok) {
          // Reload the last intake to get updated state
          await loadLastIntake();
          return true;
        } else {
          console.error('Failed to undo medication intake:', result.error);
          return false;
        }
      }
    } catch (error) {
      console.error('Error undoing medication intake:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [medId, loading, lastIntakeAt, lastIntakeId, loadLastIntake]);

  return {
    lastIntakeAt,
    loading,
    markTaken,
    undoLast,
    refresh: loadLastIntake
  };
}
