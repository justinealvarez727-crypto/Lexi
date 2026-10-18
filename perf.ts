/** Lightweight Core Web Vitals reporting (LCP, CLS). Logs in dev; beacons to VITE_ANALYTICS_URL in prod. */
export function reportVitals() {
  if (!('PerformanceObserver' in window)) return;
  const url = import.meta.env.VITE_ANALYTICS_URL as string | undefined;
  const send = (name: string, value: number) => {
    if (import.meta.env.DEV) console.info(`[perf] ${name}: ${value.toFixed(2)}`);
    else if (url) navigator.sendBeacon(url, JSON.stringify({ name, value }));
  };
  try {
    new PerformanceObserver((l) => {
      const e = l.getEntries().at(-1);
      if (e) send('LCP', e.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    let cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[])
        if (!e.hadRecentInput) cls += e.value;
      send('CLS', cls);
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* unsupported entry type: ignore */ }
}
