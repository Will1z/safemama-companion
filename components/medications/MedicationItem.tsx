'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Clock, CheckCircle } from 'lucide-react';
import { parseSchedule, nextDue, isDueNow, recentlyTaken, formatNextDue, formatTimeAgo } from '@/lib/meds/schedule';
import { useMedicationIntake } from '@/hooks/useMedicationIntake';

interface MedicationItemProps {
  id: string;
  name: string;
  dosage: string;
  frequencyType: 'daily' | 'interval';
  intervalHours?: number;
  timezone: string;
  dueNow: boolean;
  nextDueAt: string;
  lastTakenAgo: string | null;
  onRemove: (medicationId: string) => void;
}

export function MedicationItem({
  id,
  name,
  dosage,
  frequencyType,
  intervalHours,
  timezone,
  dueNow,
  nextDueAt,
  lastTakenAgo,
  onRemove
}: MedicationItemProps) {
  // Parse the medication schedule
  const sched = parseSchedule({ frequencyType, intervalHours, time: '09:00' });
  
  // Use the new intake hook
  const { lastIntakeAt, loading, markTaken, undoLast } = useMedicationIntake(id, sched);
  
  // Calculate current state
  const now = new Date();
  const isDue = isDueNow(now, lastIntakeAt, sched);
  const isRecent = recentlyTaken(now, lastIntakeAt);
  const nextDueTime = nextDue(now, lastIntakeAt, sched);

  const handleMarkTaken = async () => {
    await markTaken();
  };

  const handleUndo = async () => {
    await undoLast();
  };

  const getFrequencyText = () => {
    if (frequencyType === 'daily') {
      return 'Daily';
    } else if (frequencyType === 'interval' && intervalHours) {
      if (intervalHours < 24) {
        return `Every ${intervalHours}h`;
      } else {
        const days = Math.floor(intervalHours / 24);
        const hours = intervalHours % 24;
        return `Every ${days}d ${hours > 0 ? `${hours}h` : ''}`.trim();
      }
    }
    return 'Daily';
  };

  const getNextDueText = () => {
    return `Next: ${formatNextDue(nextDueTime, now)}`;
  };

  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm">
      {/* Top row: Title + chips + actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Title block can truncate on small screens */}
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-2xl font-bold leading-tight">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {dosage}
          </p>
        </div>

        {/* Chips / delete kept from shrinking the button */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="rounded-full border px-2 py-1 text-xs whitespace-nowrap">
            {getFrequencyText()}
          </span>
          <button
            aria-label="Delete medication"
            onClick={() => onRemove(id)}
            className="rounded-full border px-2 py-1 text-xs hover:bg-red-50"
          >
            ×
          </button>
        </div>
      </div>

        <div className="mt-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{getNextDueText()}</span>
            </div>
            {isDue && !isRecent && (
              <div className="flex items-center space-x-1">
                <span className="text-orange-600 font-medium">Due now</span>
              </div>
            )}
            {isRecent && lastIntakeAt && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Taken {formatTimeAgo(lastIntakeAt, now)}</span>
              </div>
            )}
          </div>
        </div>

      {/* Bottom row: CTA */}
      <div className="mt-4 flex items-center justify-end gap-3">
        {isRecent ? (
          <div className="flex flex-col items-end space-y-1">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Taken {lastIntakeAt ? formatTimeAgo(lastIntakeAt, now) : 'recently'}
            </div>
            <button
              onClick={handleUndo}
              disabled={loading}
              className="text-xs text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Undo'}
            </button>
          </div>
        ) : isDue ? (
          <button
            type="button"
            onClick={handleMarkTaken}
            disabled={loading}
            className="
              inline-flex items-center justify-center
              h-12 min-h-12 px-5
              rounded-xl font-semibold text-base
              whitespace-nowrap
              bg-emerald-600 text-white hover:brightness-95
              disabled:opacity-50 disabled:cursor-not-allowed
              shrink-0
            "
          >
            {loading ? 'Saving…' : 'Mark Taken'}
          </button>
        ) : (
          <div className="text-xs text-gray-500">
            Not due yet
          </div>
        )}
      </div>
    </div>
  );
}
