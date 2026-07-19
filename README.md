# Nalanda College — Website & Admin Portal

Production-grade college website built with **Next.js (App Router)**, **Supabase**,
**Tailwind CSS** and **TypeScript**. Server Components by default; Client
Components only where interactivity truly needs them.

> This repository currently implements the **foundation + the complete Home
> page** end-to-end, plus the **full backend schema** for every entity. The
> remaining public pages and the admin portal are added on the same foundation.

---

## Tech stack & why

| Concern            | Choice                          | Notes                                                        |
| ------------------ | ------------------------------- | ------------------------------------------------------------ |
| Framework          | Next.js 15 (App Router)         | Server Components, streaming, file-based routing             |
| Language           | TypeScript (strict)             | End-to-end type safety, incl. DB row types                   |
| Styling            | Tailwind CSS + CSS variables    | Semantic tokens (`bg-surface`, `text-navy`); one-flip dark mode |
| Backend / DB       | Supabase (Postgres + Auth + RLS)| Row Level Security enforces access rules                     |
| Data fetching      | Server Components + `@supabase/ssr` | Queries run on the server, close to the DB               |

## Design principles applied

- **Feature-based structure** — each domain (`courses`, `notices`, …) owns its
  types, data-access and UI under `src/features/*`.
- **Separation of concerns / SOLID** — UI components never talk to Supabase
  directly. All reads go through a feature's `queries.ts` (the data-access
  layer). Components receive data as props and stay presentational.
- **Server-first** — pages fetch on the server; only genuinely interactive
  pieces (`SiteNav`, `AcademicStreams` modal, `Faq` accordion, `ThemeToggle`)
  are `'use client'`.
- **Reusable UI primitives** — `Button`, `Badge`, `Section`, `Icon` compose the
  whole site and encode the design system in one place.
- **Graceful degradation** — every query falls back to seed data if Supabase is
  not yet connected, so the site renders fully from the first `npm run dev`.

---

## Folder structure

```
.
├── middleware.ts                 # Refreshes Supabase session + guards /admin
├── next.config.mjs               # Image host allowlist, strict mode
├── tailwind.config.ts            # Brand tokens → Tailwind utilities
├── supabase/
│   ├── migrations/0001_init.sql  # Tables, enums, triggers, RLS policies
│   └── seed.sql                  # Sample content (courses, notices, downloads)
└── src/
    ├── app/
    │   ├── layout.tsx            # Root: fonts, theme script, metadata
    │   ├── globals.css           # Tailwind layers + design tokens (light/dark)
    │   └── (public)/             # Route group (adds no URL segment)
    │       ├── layout.tsx        # SiteNav + SiteFooter chrome
    │       └── page.tsx          # Home ("/") — composes feature sections
    ├── components/
    │   ├── ui/                   # Reusable primitives: Button, Badge, Section, Icon
    │   └── layout/               # SiteNav, SiteFooter, ThemeToggle
    ├── config/
    │   └── site.ts               # Brand, nav links, contact, admission dates
    ├── features/                 # Feature-based domains
    │   ├── home/                 # Home-only sections + marketing data
    │   ├── courses/              # Course types, queries, fallback data
    │   ├── notices/              # Notice queries + date helpers
    │   └── downloads/            # Download queries + fallback data
    ├── lib/
    │   ├── supabase/             # client / server / middleware Supabase factories
    │   └── utils/cn.ts           # Tailwind-aware className merge
    └── types/
        └── database.types.ts     # DB row/insert/update types (regenerate via CLI)
```

### The data flow (read path)

```
Server Component (page.tsx)
        │  await getPublishedCourses()
        ▼
features/courses/queries.ts  ──▶  lib/supabase/server.ts  ──▶  Supabase (RLS)
        │  returns typed Course[]  (or seed fallback)
        ▼
<AcademicStreams courses={courses} />   ← presentational, props-in
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

   The app runs without this (falls back to seed data), but real data and the
   admin area need Supabase configured.

3. **Provision the database** (with the Supabase CLI)

   ```bash
   supabase db reset          # applies migrations/0001_init.sql + seed.sql
   npm run db:types           # regenerate src/types/database.types.ts
   ```

4. **Run**

   ```bash
   npm run dev                # http://localhost:3000
   ```

## Scripts

| Command             | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the dev server                     |
| `npm run build`     | Production build                         |
| `npm run start`     | Serve the production build               |
| `npm run lint`      | ESLint (next/core-web-vitals)            |
| `npm run typecheck` | `tsc --noEmit` type check                |
| `npm run db:types`  | Generate DB types from the local Supabase|

---

## Data model (Supabase)

`courses`, `faculty`, `notices`, `gallery_images`, `downloads`, `enquiries`.

**RLS summary**

- Anonymous visitors can **read** rows where `is_published = true`.
- Anonymous visitors can **insert** into `enquiries` (contact form) only.
- Authenticated admins have **full** read/write on all tables.

## Roadmap (next passes)

- Public pages: About, Courses, Admissions, Faculty, Notices, Gallery, Contact
  (Contact posts to `enquiries` via a Server Action).
- Admin portal under `/admin` (login + CRUD for every entity), already guarded
  by `middleware.ts`.
- Supabase Storage wiring for hero/gallery/faculty images.
```
