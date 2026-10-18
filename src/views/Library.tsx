import { useDeferredValue, useMemo, useState } from 'react';
import { useStore } from '../store';
import { wordsFor } from '../data/vocab';
import { canSpeak, speak } from '../lib/speech';

export default function Library() {
  const lang = useStore((s) => s.lang);
  const progress = useStore((s) => s.progress);
  const [q, setQ] = useState('');
  const query = useDeferredValue(q.trim().toLowerCase()); // keeps typing responsive on long lists
  const words = useMemo(
    () => wordsFor(lang).filter((w) => !query || [w.term, w.reading, w.meaning].some((s) => s.toLowerCase().includes(query))),
    [lang, query],
  );

  return (
    <div>
      <label htmlFor="search" className="sr-only">Search words</label>
      <input
        id="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search words"
        className="min-h-11 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm dark:border-zinc-700"
      />
      <p className="muted mt-2 text-xs" aria-live="polite">{words.length} words</p>
      <ul className="card mt-2 divide-y divide-zinc-200 p-0 dark:divide-zinc-800">
        {words.map((w) => (
          <li key={w.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p><span lang={lang} className="text-lg font-medium">{w.term}</span> <span className="muted text-sm">{w.reading}</span></p>
              <p className="text-sm">{w.meaning}</p>
            </div>
            <span className="muted text-xs">{progress[w.id] ? `Box ${progress[w.id].box}` : 'New'}</span>
            {canSpeak() && (
              <button className="btn px-3" onClick={() => speak(w.term, lang)} aria-label={`Play ${w.term}`}>Listen</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
