# Dr. Mojtahedi — Frontend monorepo

npm workspaces monorepo for the public site and staff admin, talking to the Django API in `drmojtahedi-back`.

## Packages

| Package | Port | Description |
|---------|------|-------------|
| `@drmojtahedi/site` | 3000 | Public Next.js site |
| `@drmojtahedi/admin` | 3001 | Staff admin (Bina-like shell) |
| `@drmojtahedi/shared` | — | Brand constants, ports |
| `@drmojtahedi/config` | — | Shared TypeScript base |

## Setup

```bash
cp .env.example apps/site/.env.local
cp apps/admin/.env.example apps/admin/.env.local
npm install
```

### Env (site)

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_USE_SEED` | `true` = mock data; `false` = hit Django |
| `NEXT_PUBLIC_API_URL` | e.g. `http://127.0.0.1:8000/api/v1` |
| `API_INTERNAL_URL` | Optional SSR base |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin |

### Env (admin)

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | Same Django `/api/v1` base |
| `NEXT_PUBLIC_USE_SEED` | Keep `false` for real admin CRUD |

## Develop

```bash
# Site only
npm run dev:site

# Admin only
npm run dev:admin

# Both
npm run dev:all
```

With API:

1. In `drmojtahedi-back`: `python manage.py migrate && python manage.py seed_content && python manage.py runserver`
2. Site: set `NEXT_PUBLIC_USE_SEED=false` and `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1`
3. Admin login: `admin` / `admin123456` (created by seed)

## Build

```bash
npm run build:site
npm run build:admin
```

## Stack

- Next.js 16 · React 19 · Tailwind CSS 4 · RTL Vazir
- Seed/mock flag with Django DRF swap-in (`lib/api/*`)
