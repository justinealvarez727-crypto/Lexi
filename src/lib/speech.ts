import type { Lang } from '../types';

// Web Speech API: zero-cost, offline-capable on most devices, no audio assets to ship.
const LOCALE: Record<Lang, string> = { ko: 'ko-KR', ja: 'ja-JP', es: 'es-ES' };

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text: string, lang: Lang) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LOCALE[lang];
  u.rate = 0.85; // slightly slower for learners
  window.speechSynthesis.speak(u);
}
