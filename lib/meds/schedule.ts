/**
 * Medication scheduling utilities
 * Handles daily and interval-based medication schedules with proper timezone support
 */

export type MedSchedule =
  | { type: 'daily'; at: string }           // 'HH:mm' local time
  | { type: 'interval'; hours: number };    // every N hours

/**
 * Parse medication object into schedule format
 */
export function parseSchedule(med: any): MedSchedule {
  if (med.frequencyType === 'daily') {
    return { type: 'daily', at: med.time || '09:00' };
  } else if (med.frequencyType === 'interval' && med.intervalHours) {
    return { type: 'interval', hours: med.intervalHours };
  }
  // Default fallback
  return { type: 'daily', at: '09:00' };
}

/**
 * Calculate next due time based on schedule and last intake
 */
export function nextDue(now: Date, lastIntakeAt: Date | null, sched: MedSchedule): Date {
  if (sched.type === 'daily') {
    return nextDueDaily(now, lastIntakeAt, sched.at);
  } else {
    return nextDueInterval(now, lastIntakeAt, sched.hours);
  }
}

/**
 * Calculate next due time for daily medications
 */
function nextDueDaily(now: Date, lastIntakeAt: Date | null, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create today's scheduled time in local timezone
  const todayScheduled = new Date(now);
  todayScheduled.setHours(hours, minutes, 0, 0);
  
  // If we have a last intake and it was today at or after the scheduled time
  if (lastIntakeAt && lastIntakeAt >= todayScheduled) {
    // Next dose is tomorrow at the same time
    const tomorrow = new Date(todayScheduled);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  // If current time is before today's scheduled time, next is today
  if (now <= todayScheduled) {
    return todayScheduled;
  }
  
  // Otherwise, next is tomorrow
  const tomorrow = new Date(todayScheduled);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

/**
 * Calculate next due time for interval medications
 */
function nextDueInterval(now: Date, lastIntakeAt: Date | null, hours: number): Date {
  if (!lastIntakeAt) {
    // If never taken, due immediately
    return now;
  }
  
  // Next due is last intake + interval hours
  const nextDue = new Date(lastIntakeAt);
  nextDue.setHours(nextDue.getHours() + hours);
  return nextDue;
}

/**
 * Check if medication is due now
 */
export function isDueNow(now: Date, lastIntakeAt: Date | null, sched: MedSchedule, windowMin: number = 30): boolean {
  // If recently taken, not due
  if (recentlyTaken(now, lastIntakeAt)) {
    return false;
  }
  
  const nextDueTime = nextDue(now, lastIntakeAt, sched);
  const windowMs = windowMin * 60 * 1000; // Convert minutes to milliseconds
  
  // Due if current time is within the window before next due time
  return now >= new Date(nextDueTime.getTime() - windowMs);
}

/**
 * Check if medication was recently taken
 */
export function recentlyTaken(now: Date, lastIntakeAt: Date | null, recentMin: number = 120): boolean {
  if (!lastIntakeAt) return false;
  
  const recentMs = recentMin * 60 * 1000; // Convert minutes to milliseconds
  const timeSinceLastIntake = now.getTime() - lastIntakeAt.getTime();
  
  return timeSinceLastIntake < recentMs;
}

/**
 * Format next due time for display
 */
export function formatNextDue(nextDueTime: Date, now: Date): string {
  const isToday = nextDueTime.toDateString() === now.toDateString();
  const isTomorrow = nextDueTime.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  const timeStr = nextDueTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (isToday) {
    return timeStr;
  } else if (isTomorrow) {
    return `tomorrow ${timeStr}`;
  } else {
    return nextDueTime.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

/**
 * Format time ago for display
 */
export function formatTimeAgo(timestamp: Date, now: Date): string {
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
