/**
 * Medication scheduling utilities
 * Supports DAILY and INTERVAL frequency types with timezone awareness
 */

export type FrequencyType = 'daily' | 'interval';

export interface DueStatus {
  dueNow: boolean;
  nextDueAt: string; // ISO string
  lastTakenAgo: string | null; // humanized duration or null
}

export interface ComputeDueStatusParams {
  now: Date;
  tz: string;
  frequencyType: FrequencyType;
  intervalHours?: number;
  latestIntakeAt?: string | null; // ISO string
}

/**
 * Get local date string (YYYY-MM-DD) for a given date and timezone
 */
export function getLocalToday(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Humanize duration in milliseconds to readable format
 */
export function humanizeDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ago`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'just now';
  }
}

/**
 * Compute medication due status based on frequency type and latest intake
 */
export function computeDueStatus({
  now,
  tz,
  frequencyType,
  intervalHours,
  latestIntakeAt
}: ComputeDueStatusParams): DueStatus {
  const result: DueStatus = {
    dueNow: false,
    nextDueAt: '',
    lastTakenAgo: null
  };

  // Calculate last taken ago if we have a latest intake
  if (latestIntakeAt) {
    const latestIntake = new Date(latestIntakeAt);
    const timeDiff = now.getTime() - latestIntake.getTime();
    result.lastTakenAgo = humanizeDuration(timeDiff);
  }

  if (frequencyType === 'daily') {
    // DAILY: Check if taken today in local timezone
    const localToday = getLocalToday(now, tz);
    
    if (!latestIntakeAt) {
      // No intake ever - due now
      result.dueNow = true;
      result.nextDueAt = now.toISOString();
    } else {
      // Check if latest intake was today in local timezone
      const latestIntakeLocalDate = getLocalToday(new Date(latestIntakeAt), tz);
      result.dueNow = latestIntakeLocalDate !== localToday;
      
      if (result.dueNow) {
        // Due now - next due is immediate
        result.nextDueAt = now.toISOString();
      } else {
        // Taken today - next due is start of next local day
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStart = new Date(getLocalToday(nextDay, tz) + 'T00:00:00');
        // Convert to UTC for storage
        result.nextDueAt = new Date(nextDayStart.toLocaleString('en-US', { timeZone: tz })).toISOString();
      }
    }
  } else if (frequencyType === 'interval' && intervalHours) {
    // INTERVAL: Check if enough time has passed since last intake
    if (!latestIntakeAt) {
      // No intake ever - due now
      result.dueNow = true;
      result.nextDueAt = now.toISOString();
    } else {
      const latestIntake = new Date(latestIntakeAt);
      const nextDue = new Date(latestIntake.getTime() + (intervalHours * 60 * 60 * 1000));
      
      result.dueNow = now >= nextDue;
      result.nextDueAt = nextDue.toISOString();
    }
  } else {
    // Invalid configuration - treat as due
    result.dueNow = true;
    result.nextDueAt = now.toISOString();
  }

  return result;
}

/**
 * Format next due time for display in UI
 */
export function formatNextDueTime(nextDueAt: string, tz: string): string {
  const date = new Date(nextDueAt);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Get user's timezone with fallback
 */
export function getUserTimezone(userTz?: string | null): string {
  return userTz || 'Africa/Lagos';
}
