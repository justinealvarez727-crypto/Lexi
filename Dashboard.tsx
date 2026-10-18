import { motion } from 'framer-motion';
import { dayKey, streak, useStore } from '../store';
import { wordsFor } from '../data/vocab';
import { intervalDays, MAX_BOX } from '../lib/leitner';

export default function Dashboard({ onStart }: { onStart: () => void }) {
  const lang = useStore((s) => s.lang);
  const progress = useStore((s) => s.progress);
  const daily = useStore((s) => s.daily);
  const reset = useStore((s) => s.reset);

  const words = wordsFor(lang);
  const now = Date.now();
  const due = words.filter((w) => progress[w.id] && progress[w.id].due <= now).length;
  const fresh = words.filter((w) => !progress[w.id]).length;
  const boxes = Array.from({ length: MAX_BOX }, (_, i) => words.filter((w) => progress[w.id]?.box === i + 1).length);
  const seen = words.reduce((n, w) => n + (progress[w.id]?.seen ?? 0), 0);
  const right = words.reduce((n, w) => n + (progress[w.id]?.correct ?? 0), 0);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString('en', { weekday: 'short' }), n: daily[dayKey(d)]?.reviews ?? 0 };
  });
  const peak = Math.max(1, ...week.map((d) => d.n));
  const stats: [string, string | number][] = [
    ['Due now', due], ['New words', Math.min(fresh, 10)], ['Day streak', streak(daily)],
    ['Mastered', boxes[MAX_BOX - 1]], ['Accuracy', seen ? `${Math.round((right / seen) * 100)}%` : '–'],
    ['Words learned', words.length - fresh],
  ];

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map(([k, v]) => (
          <div key={k} className="card py-4">
            <dt className="muted text-xs">{k}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <button className="btn btn-primary w-full" onClick={onStart} disabled={!due && !fresh}>
        {due + fresh ? 'Start review' : 'All caught up'}
      </button>

      <section className="card" aria-labelledby="boxes">
        <h2 id="boxes" className="text-sm font-semibold">Leitner boxes</h2>
        <ul className="mt-3 space-y-2">
          {boxes.map((n, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="muted w-28 shrink-0">Box {i + 1} · {intervalDays(i + 1)}d</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" aria-hidden>
                <motion.div className="h-full bg-indigo-500" initial={{ width: 0 }} animate={{ width: `${(n / words.length) * 100}%` }} />
              </div>
              <span className="w-6 text-right tabular-nums">{n}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="week">
        <h2 id="week" className="text-sm font-semibold">Reviews this week</h2>
        <ul className="mt-3 flex h-28 items-end gap-2">
          {week.map((d, i) => (
            <li key={i} className="flex flex-1 flex-col items-center gap-1 text-xs">
              <span className="tabular-nums">{d.n}</span>
              <motion.div className="w-full rounded bg-indigo-500" initial={{ height: 0 }} animate={{ height: `${(d.n / peak) * 64}px` }} style={{ minHeight: 2 }} />
              <span className="muted">{d.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <button
        className="muted text-xs underline"
        onClick={() => { if (confirm('Erase all progress on this device?')) reset(); }}
      >
        Reset progress
      </button>
    </div>
  );
}
