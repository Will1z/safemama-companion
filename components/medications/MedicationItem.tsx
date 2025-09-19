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
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {getFrequencyText()}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {dosage}
        </div>
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
      
      <div className="flex items-center space-x-2 ml-4">
        {dueNow ? (
          <Button
            onClick={handleMarkTaken}
            disabled={isLoading}
            className="min-w-[108px] h-10 px-4 whitespace-nowrap text-center flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? '...' : 'Mark Taken'}
          </Button>
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-700 p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
