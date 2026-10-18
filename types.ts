export type Lang = 'ko' | 'ja' | 'es';

/** Static vocabulary entry. `id` is `${lang}:${term}` so progress survives data re-ordering. */
export interface Word {
  id: string;
  lang: Lang;
  term: string;
  /** Romanization (ko/ja) or syllable-stress guide (es). */
  reading: string;
  meaning: string;
  example: string;
  exampleEn: string;
}

/** Per-word Leitner state. Absent from the store = word has never been reviewed. */
export interface Progress {
  box: number;      // 1..MAX_BOX
  due: number;      // epoch ms when the card is next due
  seen: number;
  correct: number;
  wrong: number;
}

export interface Daily { reviews: number; correct: number }
