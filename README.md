# Lexi
Korean / Japanese / Spanish vocabulary trainer (Leitner spaced repetition, PWA).

    npm install
    npm run dev        # local dev
    npm run build      # typecheck + production build (dist/)

Deploy: import the repo in Vercel (framework: Vite). `vercel.json` handles SPA routing and caching.
Optional: set VITE_ANALYTICS_URL to receive LCP/CLS beacons.
Keys: Space reveal, 1 missed, 2 got it, P play audio.
