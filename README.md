# Dr. Mojtahedi Digital Heritage Platform — Frontend

Next.js 16 frontend for the Dr. Mohammad Ali Mojtahedi cultural heritage platform.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- RTL-first Persian UI
- Mock/seed data with Django API abstraction

## SensibleCool lessons applied

- Seed/mock flag (`NEXT_PUBLIC_USE_SEED`) with swap-in Django API modules
- Public vs internal API base URLs for SSR
- Media URL rewriting helpers for `/media/...`
- Local Vazir fonts
- CSS design tokens (RGB channels) + institutional palette
- Domain API modules (`lib/api/*`) and shared types
- SEO: metadata helpers, sitemap, robots, manifest, JSON-LD
- Minimal client JS (header drawer only where needed)

## Develop

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Implementation stages

1. Foundation + design system + layout (current)
2. Homepage polish + biography + timeline
3. People + places + institutions
4. Archive + museum + collections
5. Cultural complex + facilities
6. Events + education + library + oral history
7. Magazine + search + memories + support
8. SEO/a11y/PWA/performance QA
