export function getOrCreateSessionId(): string {
  // Guard for SSR - return empty string if window is not available
  if (typeof window === 'undefined') {
    return '';
  }

  const key = 'safemama_session_id';
  
  // Check if session ID already exists in localStorage
  const existingSessionId = window.localStorage.getItem(key);
  if (existingSessionId) {
    return existingSessionId;
  }

  // Generate new session ID and save it
  const newSessionId = crypto.randomUUID();
  window.localStorage.setItem(key, newSessionId);
  
  return newSessionId;
}
