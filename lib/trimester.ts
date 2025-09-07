/**
 * Trimester calculation utilities for SafeMama
 * Calculates current trimester based on due date or last menstrual period
 */

export function currentTrimester(dueDate?: string, lmp?: string): 1 | 2 | 3 {
  const now = new Date();
  let weeks = 0;
  
  if (lmp) {
    const start = new Date(lmp);
    weeks = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
  } else if (dueDate) {
    const due = new Date(dueDate);
    const totalWeeks = 40;
    const weeksToDue = Math.max(0, Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
    weeks = Math.max(0, totalWeeks - weeksToDue);
  }
  
  if (weeks <= 13) return 1;
  if (weeks <= 27) return 2;
  return 3;
}

export function getTrimesterInfo(trimester: 1 | 2 | 3) {
  const info = {
    1: {
      name: "First Trimester",
      weeks: "1-13 weeks",
      description: "Early pregnancy changes and development"
    },
    2: {
      name: "Second Trimester", 
      weeks: "14-27 weeks",
      description: "Growing baby and energy changes"
    },
    3: {
      name: "Third Trimester",
      weeks: "28-40 weeks", 
      description: "Final preparations for birth"
    }
  };
  
  return info[trimester];
}

export function getCurrentWeek(dueDate?: string, lmp?: string): number {
  const now = new Date();
  let weeks = 0;
  
  if (lmp) {
    const start = new Date(lmp);
    weeks = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
  } else if (dueDate) {
    const due = new Date(dueDate);
    const totalWeeks = 40;
    const weeksToDue = Math.max(0, Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
    weeks = Math.max(0, totalWeeks - weeksToDue);
  }
  
  return Math.max(1, Math.min(40, weeks));
}
