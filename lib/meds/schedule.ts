import { addHours, format, isAfter, isBefore, setHours, setMinutes, startOfToday, addDays, differenceInMinutes } from 'date-fns';

export type MedSchedule =
  | { type: 'interval'; hours: number }             // e.g., every 8h
  | { type: 'daily'; at: string };                  // 'HH:mm' local time

// Build a Date for today's HH:mm in local tz
function todayAt(at: string, base = new Date()) {
  const [hh, mm] = at.split(':').map(Number);
  return setMinutes(setHours(startOfToday(), hh), mm);
}

export function nextDue(now: Date, lastIntake: Date | null, sched: MedSchedule, windowMin = 30): Date {
  if (sched.type === 'interval') {
    // If never taken, due immediately, but next after taking becomes now+hours
    if (!lastIntake) return now;
    return addHours(lastIntake, sched.hours);
  } else {
    // daily @ time
    const t = todayAt(sched.at, now);
    const windowMs = windowMin * 60 * 1000;

    // If just taken near today's slot, move to tomorrow
    if (lastIntake && Math.abs(lastIntake.getTime() - t.getTime()) <= windowMs) {
      return addDays(t, 1);
    }
    // If now is before or close to today's slot, next is today
    if (isBefore(now, new Date(t.getTime() + windowMs))) {
      return t;
    }
    // Otherwise tomorrow
    return addDays(t, 1);
  }
}

export function isDueNow(now: Date, lastIntake: Date | null, sched: MedSchedule, windowMin = 30): boolean {
  const next = nextDue(now, lastIntake, sched, windowMin);
  const early = new Date(next.getTime() - windowMin * 60 * 1000);
  // If never taken and interval → due now
  if (sched.type === 'interval' && !lastIntake) return true;
  // Due if we're within window before/after the slot (daily) or past next (interval)
  return isAfter(now, early);
}

export function recentlyTaken(now: Date, lastIntake: Date | null, recentMin = 120): boolean {
  if (!lastIntake) return false;
  return differenceInMinutes(now, lastIntake) <= recentMin;
}

export function formatNextLabel(next: Date, now = new Date()) {
  const tomorrow = startOfToday();
  const nextIsTomorrow = next.getTime() >= addDays(tomorrow, 1).getTime() && next.getTime() < addDays(tomorrow, 2).getTime();
  return `${nextIsTomorrow ? 'Tomorrow ' : ''}${format(next, 'h:mm a')}`;
}

/**
 * Parse medication object into schedule format
 */
export function parseSchedule(med: any): MedSchedule {
  if (med.frequencyType === 'interval' && med.intervalHours) {
    return { type: 'interval', hours: med.intervalHours };
  } else {
    return { type: 'daily', at: med.time || '09:00' };
  }
}
