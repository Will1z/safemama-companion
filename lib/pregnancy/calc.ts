export function calcFromDueDate(dueDateISO: string, asOf = new Date()) {
  const MS_PER_DAY = 86400000;
  const fortyWeeksDays = 280;
  const due = new Date(dueDateISO + 'T00:00:00Z');
  const daysToDue = Math.floor((+due - +asOf) / MS_PER_DAY);
  const ga = Math.max(0, Math.min(42, 40 - (daysToDue / 7)));
  const trimester = ga < 13 ? 1 : ga < 28 ? 2 : 3;
  return { gaWeeks: +ga.toFixed(1), trimester, daysToDue };
}
