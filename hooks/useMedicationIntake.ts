'use client';
import { useEffect, useState, useCallback } from 'react';
import { MedSchedule, nextDue, isDueNow, recentlyTaken } from '@/lib/meds/schedule';

type Source = 'supabase' | 'demo';

export function useMedicationIntake(medId: string, sched: MedSchedule, source: Source = 'demo') {
  const [lastIntakeAt, setLastIntakeAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  // Load latest intake
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (source === 'demo') {
        const raw = localStorage.getItem('safemama_demo_intakes') || '{}';
        const map = JSON.parse(raw) as Record<string, string>;
        if (!cancelled && map[medId]) setLastIntakeAt(new Date(map[medId]));
      } else {
        // TODO: replace with real Supabase query for latest intake row
        // const { data } = await supabase.from('medication_intakes').select('*').eq('medication_id', medId).order('created_at', { ascending: false }).limit(1).single();
        // if (!cancelled && data) setLastIntakeAt(new Date(data.created_at));
      }
    }
    load();
    return () => { cancelled = true; };
  }, [medId, source]);

  const persist = useCallback(async (dt: Date | null) => {
    if (source === 'demo') {
      const raw = localStorage.getItem('safemama_demo_intakes') || '{}';
      const map = JSON.parse(raw) as Record<string, string>;
      if (dt) map[medId] = dt.toISOString(); else delete map[medId];
      localStorage.setItem('safemama_demo_intakes', JSON.stringify(map));
      return;
    }
    // TODO: Supabase insert/delete here
  }, [medId, source]);

  const markTaken = useCallback(async () => {
    const now = new Date();
    setSaving(true);
    setLastIntakeAt(now);              // optimistic
    try {
      await persist(now);
    } finally {
      setSaving(false);
    }
  }, [persist]);

  const undoLast = useCallback(async () => {
    setSaving(true);
    setLastIntakeAt(null);
    try {
      await persist(null);
    } finally {
      setSaving(false);
    }
  }, [persist]);

  const computed = (() => {
    const now = new Date();
    const due = isDueNow(now, lastIntakeAt, sched);
    const next = nextDue(now, lastIntakeAt, sched);
    const recent = recentlyTaken(now, lastIntakeAt);
    return { due, next, recent };
  })();

  return { lastIntakeAt, setLastIntakeAt, ...computed, markTaken, undoLast, saving };
}
