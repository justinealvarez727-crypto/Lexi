import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store';
import { wordsFor } from '../data/vocab';
import { buildQueue } from '../lib/leitner';
import { canSpeak, speak } from '../lib/speech';
import type { Word } from '../types';

// A missed card is re-queued once-or-more this session (retry=true) but only the
// FIRST answer is scheduled, so a lucky retry can't inflate its box.
interface Item { word: Word; retry: boolean }

export default function Review({ onDone }: { onDone: () => void }) {
  const lang = useStore((s) => s.lang);
  const grade = useStore((s) => s.grade);
  const [queue, setQueue] = useState<Item[]>(() =>
    buildQueue(wordsFor(lang), useStore.getState().progress).map((word) => ({ word, retry: false })),
  );
  const [total] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [shown, setShown] = useState(false);
  const cur = queue[0];

  const answer = useCallback((ok: boolean) => {
    if (!cur || !shown) return;
    if (!cur.retry) grade(cur.word.id, ok);
    setQueue(([head, ...rest]) => (ok ? rest : [...rest, { word: head.word, retry: true }]));
    if (ok) setDone((n) => n + 1);
    setShown(false);
  }, [cur, shown, grade]);

  // Keyboard: Space = reveal, 1 = missed, 2 = got it, P = play audio.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ') { e.preventDefault(); setShown(true); }
      else if (e.key === '1') answer(false);
      else if (e.key === '2') answer(true);
      else if (e.key.toLowerCase() === 'p' && cur) speak(cur.word.term, lang);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answer, cur, lang]);

  if (!cur) {
    return (
      <div className="card text-center" role="status">
        <h2 className="text-lg font-semibold">{total ? 'Session complete' : 'Nothing due right now'}</h2>
        <p className="muted mt-1 text-sm">
          {total ? `You reviewed ${total} word${total > 1 ? 's' : ''}.` : 'Come back later, or switch language.'}
        </p>
        <button className="btn btn-primary mt-5" onClick={onDone}>See progress</button>
      </div>
    );
  }

  const w = cur.word;
  return (
    <section aria-label="Flashcard review">
      <div
        role="progressbar" aria-label="Session progress"
        aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}
        className="h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <motion.div className="h-full bg-indigo-500" animate={{ width: `${(done / total) * 100}%` }} />
      </div>
      <p className="muted mt-2 text-xs">{done} of {total} done{cur.retry ? ' · retrying a missed word' : ''}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${w.id}-${cur.retry}`}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="card mt-3 py-10 text-center"
        >
          <p lang={lang} className="text-5xl font-semibold">{w.term}</p>
          {canSpeak() && (
            <button className="btn mt-4" onClick={() => speak(w.term, lang)} aria-label={`Play pronunciation of ${w.term}`}>
              Listen (P)
            </button>
          )}
          {/* aria-live: screen readers announce the answer when revealed */}
          <div aria-live="polite" className="mt-6 min-h-32">
            {shown && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="muted">{w.reading}</p>
                <p className="mt-1 text-xl font-medium">{w.meaning}</p>
                <p lang={lang} className="mt-4 text-lg">{w.example}</p>
                <p className="muted text-sm">{w.exampleEn}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex gap-2">
        {shown ? (
          <>
            <button className="btn flex-1" onClick={() => answer(false)}>Missed (1)</button>
            <button className="btn btn-primary flex-1" onClick={() => answer(true)}>Got it (2)</button>
          </>
        ) : (
          <button className="btn btn-primary flex-1" onClick={() => setShown(true)}>Show answer (Space)</button>
        )}
      </div>
    </section>
  );
}
