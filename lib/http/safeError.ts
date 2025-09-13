/**
 * Safely extract error message from unknown response objects
 */
export const safeMessage = (v: unknown, fallback = 'Request failed'): string => {
  if (typeof v === 'object' && v && ('message' in v || 'error' in v)) {
    return ((v as any).message ?? (v as any).error ?? fallback);
  }
  return fallback;
};
