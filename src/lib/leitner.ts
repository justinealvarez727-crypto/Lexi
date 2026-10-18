import type { Progress, Word } from '../types';

/**
 * Leitner system with 5 boxes and geometric intervals:
 *   interval(box) = 2^(box-1) days  ->  1, 2, 4, 8, 16
 * Correct answer: promote one box (capped). Wrong answer: demote to box 1.
 * Doubling matches the exponential shape of the forgetting curve: each success
 * means the memory is stronger, so we wait roughly twice as long before testing it again.
 */
export const MAX_BOX = 5;
const DAY = 86_400_000;

export const intervalDays = (box: number) => 2 ** (box - 1);

export function schedule(prev: Progress | undefined, correct: boolean, now = Date.now()): Progress {
  const p = prev ?? { box: 1, due: now, seen: 0, correct: 0, wrong: 0 };
  const box = correct ? Math.min(p.box + 1, MAX_BOX) : 1;
  return {
    box,
    due: now + intervalDays(box) * DAY,
    seen: p.seen + 1,
    correct: p.correct + (correct ? 1 : 0),
    wrong: p.wrong + (correct ? 0 : 1),
  };
}

/** Most-overdue cards first, then up to `newLimit` unseen cards to keep sessions short. */
export function buildQueue(
  words: Word[],
  progress: Record<string, Progress>,
  newLimit = 10,
  now = Date.now(),
): Word[] {
  const due = words
    .filter((w) => progress[w.id] && progress[w.id].due <= now)
    .sort((a, b) => progress[a.id].due - progress[b.id].due);
  const fresh = words.filter((w) => !progress[w.id]).slice(0, newLimit);
  return [...due, ...fresh];
}
