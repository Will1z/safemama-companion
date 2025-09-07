export function track(evt: string, props?: Record<string, any>) {
  if (!(window as any).posthog) return;
  try { (window as any).posthog.capture(evt, props || {}); } catch {}
}
