'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Clock, CheckCircle } from 'lucide-react';
import { formatNextDueTime } from '@/lib/medication-schedule';

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
  onMarkTaken: (medicationId: string) => Promise<void>;
  onRemove: (medicationId: string) => void;
  onUndo?: (medicationId: string) => Promise<void>;
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
  onMarkTaken,
  onRemove,
  onUndo
}: MedicationItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkTaken = async () => {
    setIsLoading(true);
    try {
      await onMarkTaken(id);
    } catch (error) {
      console.error('Error marking medication as taken:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!onUndo) return;
    setIsLoading(true);
    try {
      await onUndo(id);
    } catch (error) {
      console.error('Error undoing medication intake:', error);
    } finally {
      setIsLoading(false);
    }
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
    if (dueNow) return 'Due now';
    return `Next: ${formatNextDueTime(nextDueAt, timezone)}`;
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
          {lastTakenAgo && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-green-600">Taken {lastTakenAgo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: due label + CTA */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">{getNextDueText()}</div>
        {dueNow ? (
          <button
            onClick={handleMarkTaken}
            disabled={isLoading}
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
            {isLoading ? '...' : 'Mark Taken'}
          </button>
        ) : (
          <div className="flex flex-col items-end space-y-1">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Taken {lastTakenAgo}
            </div>
            {onUndo && frequencyType === 'daily' && (
              <button
                onClick={handleUndo}
                disabled={isLoading}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                {isLoading ? '...' : 'Undo'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
