// Lightweight analytics tracker; stores events locally and optionally POSTs if backend endpoint exists
export type AnalyticsEvent = {
  t: number; // timestamp
  type: string;
  props?: Record<string, any>;
};

const KEY = 'photoskop-analytics-events';

export function track(type: string, props?: Record<string, any>) {
  const ev: AnalyticsEvent = { t: Date.now(), type, props };
  try {
    const raw = localStorage.getItem(KEY);
    const arr: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    arr.push(ev);
    // keep last 500 events
    while (arr.length > 500) arr.shift();
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch {}

  // best-effort POST (ignore network errors)
  try {
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ev) })
      .catch(() => {});
  } catch {}
}

export function getEvents(): AnalyticsEvent[] {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function clearEvents() { try { localStorage.removeItem(KEY); } catch {} }
