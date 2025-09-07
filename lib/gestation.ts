export function weeksFromLMP(lmp?: string) {
  if (!lmp) return null;
  const d = new Date(lmp);
  const ms = Date.now() - d.getTime();
  const weeks = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
  return weeks >= 0 ? weeks : null;
}
export function weeksToEDD(edd?: string) {
  if (!edd) return null;
  const d = new Date(edd);
  const ms = d.getTime() - Date.now();
  const weeks = Math.ceil(ms / (1000 * 60 * 60 * 24 * 7));
  return weeks <= 40 ? 40 - weeks : null;
}
