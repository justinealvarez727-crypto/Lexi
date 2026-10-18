import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Daily, Lang, Progress } from './types';
import { schedule } from './lib/leitner';

export const dayKey = (d = new Date()) => d.toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

interface Store {
  lang: Lang;
  progress: Record<string, Progress>;
  daily: Record<string, Daily>;
  setLang: (l: Lang) => void;
  grade: (id: string, correct: boolean) => void;
  reset: () => void;
}

// Single persisted store. `version` + `migrate` let future schema changes upgrade saved data.
export const useStore = create<Store>()(
  persist(
    (set) => ({
      lang: 'ko',
      progress: {},
      daily: {},
      setLang: (lang) => set({ lang }),
      grade: (id, correct) =>
        set((s) => {
          const k = dayKey();
          const d = s.daily[k] ?? { reviews: 0, correct: 0 };
          return {
            progress: { ...s.progress, [id]: schedule(s.progress[id], correct) },
            daily: { ...s.daily, [k]: { reviews: d.reviews + 1, correct: d.correct + (correct ? 1 : 0) } },
          };
        }),
      reset: () => set({ progress: {}, daily: {} }),
    }),
    {
      name: 'lexi-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lang: s.lang, progress: s.progress, daily: s.daily }),
      migrate: (state) => state as Store,
    },
  ),
);

/** Consecutive days with at least one review; today doesn't break the streak until it ends. */
export function streak(daily: Record<string, Daily>): number {
  const d = new Date();
  if (!daily[dayKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (daily[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
