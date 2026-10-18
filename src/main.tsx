import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { reportVitals } from './lib/perf';

// MotionConfig reducedMotion="user" makes every animation honor prefers-reduced-motion (WCAG 2.3.3).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
);
reportVitals();
