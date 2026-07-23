# Nalanda College — Website & Admin Portal

Production college website + full admin panel, built with **Next.js 15 (App
Router)**, **Supabase**, **Tailwind CSS** and **TypeScript** — live at
**https://nalanda-college.vercel.app**.

Server Components by default; Client Components only where interactivity truly
needs them. Every public page, the complete admin CRUD, CI, and an E2E test
suite are implemented.

---

## What's inside

**Public site** — Home (hero, streams, portal links, testimonials, downloads),
About, Courses (+detail pages by slug), Admissions (application form), Faculty,
Notices & Events, Gallery (lightbox), Downloads, Contact, site-wide search
(⌘K), dark mode, mobile swipe rails, skip-link + focus-trap accessibility.

**Admin panel** (`/admin`) — email/password login (throttled), dashboard, and
full CRUD for courses, faculty, notices, gallery, downloads, enquiries and site
settings. Image uploads go to Supabase Storage. Password reset via email link.

**Quality rails** — TypeScript strict, ESLint 9 flat config, Vitest unit
tests, two Playwright E2E suites, 3-job GitHub Actions CI.

## Tech stack & why

| Concern       | Choice                              | Notes                                                           |
| ------------- | ----------------------------------- | --------------------------------------------------------------- |
| Framework     | Next.js 15 (App Router)             | Server Components, streaming, file-based routing                |
| Language      | TypeScript (strict)                 | End-to-end type safety, incl. generated DB row types            |
| Styling       | Tailwind CSS + CSS variables        | Semantic tokens (`bg-surface`, `text-navy`); one-flip dark mode |
| Backend / DB  | Supabase (Postgres + Auth + RLS)    | Row Level Security + `admins` allow-list enforce access         |
| Data fetching | Server Components + `@supabase/ssr` | Queries run on the server, close to the DB                      |
| Email         | Nodemailer (SMTP, optional)         | New-enquiry alerts; see `docs/EMAIL_SETUP.md`                   |
| Testing       | Vitest + Playwright                 | Unit + E2E; see `docs/E2E_TESTING.md`                           |

## Design principles applied

- **Feature-based structure** — each domain (`courses`, `notices`, …) owns its
  types, schema, queries, server actions and UI under `src/features/*`.
- **Separation of concerns** — UI components never talk to Supabase directly.
  Reads go through a feature's `queries.ts`; writes through its `actions.ts`
  (Server Actions). Components receive data as props and stay presentational.
- **Server-first** — pages fetch on the server; only genuinely interactive
  pieces are `'use client'`.
- **Reusable UI primitives** — `Button`, `Badge`, `Section`, `Icon`,
  `CardRail` compose the whole site and encode the design system in one place.
- **Graceful degradation** — every public query falls back to seed data if
  Supabase is not configured, so the site renders fully from the first
  `npm run dev` (and the no-secrets E2E suite relies on this).

---

## Folder structure

```
.
├── middleware.ts                  # Refreshes Supabase session + guards /admin
├── playwright.config.ts           # Public E2E (no secrets needed)
├── playwright.admin.config.ts     # Authenticated admin E2E (test project only)
├── .github/workflows/ci.yml       # build+lint+unit / e2e / e2e-auth jobs
├── supabase/
│   ├── migrations/                # 0001 schema+RLS · 0002 admins allow-list
│   │                              # 0003 course slugs · 0004 login throttle
│   └── seed.sql                   # Sample content (optional)
├── e2e/                           # Playwright specs (public, auth-guard, CRUD)
├── docs/
│   ├── EMAIL_SETUP.md             # SMTP notification setup
│   └── E2E_TESTING.md             # Test Supabase project + .env.e2e setup
└── src/
    ├── app/
    │   ├── (public)/              # All public pages + shared chrome
    │   ├── (admin)/admin/         # Login, password reset, (panel)/ CRUD pages
    │   ├── auth/callback/         # Supabase email-link code exchange
    │   ├── api/                   # Route handlers (e.g. search)
    │   ├── robots.ts · sitemap.ts # SEO
    │   └── layout.tsx             # Root: fonts, theme script, metadata
    ├── components/
    │   ├── ui/                    # Button, Badge, Section, Icon, CardRail…
    │   ├── layout/                # SiteNav, SiteFooter, ThemeToggle, SkipLink
    │   └── admin/                 # Admin shell, tables, Toast…
    ├── config/site.ts             # Brand, nav links, contact, images
    ├── features/                  # admin, courses, downloads, enquiries,
    │                              # faculty, gallery, home, notices, search,
    │                              # settings — each with schema/queries/actions
    ├── lib/
    │   ├── supabase/              # client / server / middleware factories
    │   ├── storage/               # Supabase Storage upload helpers
    │   └── utils/
    └── types/database.types.ts    # Generated DB types (+ RPC functions)
```

### The data flow

```
READ   page.tsx (Server Component) → features/x/queries.ts → Supabase (RLS)
                                   → typed rows (or seed fallback) → props → UI

WRITE  form → features/x/actions.ts ('use server') → zod-style schema check
            → requireAdmin() → Supabase → revalidatePath()
```

---

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env.local
   # Fill in NEXT_PUBLIC_SUPABASE_URL / ANON_KEY from your Supabase project.
   ```

   The public site runs without this (seed-data fallback), but real data and
   the admin area need Supabase configured.

3. **Provision the database** — run **all four** migrations in order in the
   Supabase SQL Editor (or `supabase db reset` with the CLI):

   | Migration                 | What it does                                             |
   | ------------------------- | -------------------------------------------------------- |
   | `0001_init.sql`           | Tables, enums, triggers, RLS policies                    |
   | `0002_admin_roles.sql`    | `admins` allow-list — **then seed your first admin** (snippet at the end of the file) |
   | `0003_course_slugs.sql`   | Slug column + backfill for course detail URLs            |
   | `0004_login_throttle.sql` | IP-based login rate limiting (RPC functions)             |

   Optionally run `seed.sql` for sample content. Step-by-step (Hinglish) guide:
   [`DATABASE_SETUP.md`](DATABASE_SETUP.md).

4. **Run**

   ```bash
   npm run dev                # http://localhost:3000
   ```

## Scripts

| Command                 | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `npm run dev`           | Start the dev server                                           |
| `npm run build`         | Production build                                               |
| `npm run start`         | Serve the production build                                     |
| `npm run lint`          | ESLint (flat config, next/core-web-vitals)                     |
| `npm run typecheck`     | `tsc --noEmit`                                                 |
| `npm test`              | Vitest unit tests (schemas, slugs, storage helpers)            |
| `npm run test:e2e`      | Public + auth-guard E2E — **no secrets needed**                |
| `npm run test:e2e:auth` | Admin CRUD E2E — needs `.env.e2e` (see `docs/E2E_TESTING.md`)  |
| `npm run db:types`      | Regenerate `src/types/database.types.ts` from local Supabase   |

## Testing & CI

Two-tier E2E on purpose:

- **`npm run test:e2e`** builds the app and runs against **seed-fallback data**
  — zero setup, safe for any contributor and for CI without secrets. Covers
  public pages, forms' native validation, and the `/admin` auth guard.
- **`npm run test:e2e:auth`** logs into the real admin panel and exercises
  create→delete CRUD. It runs against a **dedicated test Supabase project**
  (never production — the config hard-fails if pointed at the prod ref).
  Local setup lives in gitignored `.env.e2e`; full guide:
  [`docs/E2E_TESTING.md`](docs/E2E_TESTING.md).

**GitHub Actions** (`.github/workflows/ci.yml`) runs three jobs on every push /
PR to `main`: `build-and-test` (typecheck, lint, unit, build), `e2e`
(no-secrets suite), and `e2e-auth` (CRUD suite — skips cleanly unless the four
`E2E_*` repository secrets are configured).

## Security model

- **RLS everywhere** — anonymous users read only `is_published = true` rows and
  can insert into `enquiries`; nothing else.
- **`admins` allow-list** (`0002`) — being authenticated is not enough; writes
  require membership in `public.admins`. Non-members land on `/admin/no-access`.
- **Two-layer admin guard** — Edge middleware redirects anonymous visitors;
  `requireAdmin()` in the panel layout re-verifies membership server-side.
- **Login throttling** (`0004`) — 8 failed attempts per IP per 15 minutes,
  enforced in Postgres via SECURITY DEFINER RPCs; fails open if the migration
  is missing. IP-based (not email-based) so an attacker can't lock out a real
  admin's account.
- **Password reset** — emailed link → `/auth/callback` code exchange →
  recovery session → `/admin/reset-password`. Responses are neutral (never
  reveal whether an email is registered). The callback URL must be on the
  Supabase Auth redirect allow-list (see Deployment).

## Deployment (Vercel + Supabase)

1. **Vercel env vars** — `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
   (`https://your-domain`, used by sitemap/OG tags), plus the optional `SMTP_*`
   set for enquiry alerts.
2. **Supabase Auth URL configuration** (Dashboard → Authentication → URL
   Configuration) — set **Site URL** to your live domain and add
   `https://your-domain/auth/callback` (and
   `http://localhost:3000/auth/callback` for local dev) to **Redirect URLs**.
   Without this, password-reset emails silently link to the wrong host.
3. Run all four migrations + first-admin seed on the production project.

## Data model (Supabase)

`courses`, `faculty`, `notices`, `gallery_images`, `downloads`, `enquiries`,
`site_settings`, plus auth-side `admins` and `login_attempts`. Detailed
column-by-column reference: [`DATABASE_SETUP.md`](DATABASE_SETUP.md).
