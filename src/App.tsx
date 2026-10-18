import { lazy, Suspense, useState } from 'react';
import { useStore } from './store';
import type { Lang } from './types';

// Code splitting: each view is its own chunk, fetched on first visit.
const Dashboard = lazy(() => import('./views/Dashboard'));
const Review = lazy(() => import('./views/Review'));
const Library = lazy(() => import('./views/Library'));

const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: 'ko', label: '한국어', name: 'Korean' },
  { id: 'ja', label: '日本語', name: 'Japanese' },
  { id: 'es', label: 'Español', name: 'Spanish' },
];
const TABS = [['dashboard', 'Progress'], ['review', 'Review'], ['library', 'Words']] as const;
type Tab = (typeof TABS)[number][0];

export default function App() {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 pb-12 pt-6">
      <a href="#main" className="sr-only focus:not-sr-only focus:underline">Skip to content</a>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-lg font-semibold tracking-tight">Lexi</span>
        <div className="flex gap-1" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l.id}
              aria-pressed={lang === l.id}
              aria-label={l.name}
              onClick={() => setLang(l.id)}
              className={`btn min-h-11 min-w-11 ${lang === l.id ? 'btn-primary' : ''}`}
            >
              <span lang={l.id}>{l.label}</span>
            </button>
          ))}
        </div>
      </header>

      <nav aria-label="Primary" className="mt-6 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => setTab(id)}
            className={`-mb-px min-h-11 border-b-2 px-3 text-sm font-medium ${
              tab === id ? 'border-indigo-500' : 'muted border-transparent hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main id="main" className="mt-6">
        <Suspense fallback={<div role="status" aria-label="Loading" className="h-48 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />}>
          {tab === 'dashboard' && <Dashboard onStart={() => setTab('review')} />}
          {/* key={lang} resets the session queue when the language changes */}
          {tab === 'review' && <Review key={lang} onDone={() => setTab('dashboard')} />}
          {tab === 'library' && <Library />}
        </Suspense>
      </main>
    </div>
  );
}
