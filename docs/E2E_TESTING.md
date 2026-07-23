# E2E Testing Guide

Two Playwright suites, deliberately separated:

| Suite | Command | Needs | Config |
| --- | --- | --- | --- |
| Public + auth guard | `npm run test:e2e` | **Nothing** — runs on seed-fallback data | `playwright.config.ts` |
| Admin CRUD (authenticated) | `npm run test:e2e:auth` | A **test** Supabase project + `.env.e2e` | `playwright.admin.config.ts` |

Both build the app and run it with `next start` on their own port (3100 /
3101), so they test the real production build.

---

## Suite 1 — public (zero setup)

```bash
npm run test:e2e
```

Covers: home page renders, course navigation, admissions form native
validation (first invalid field gets focus), contact page, and the `/admin`
auth guard (anonymous visitors are redirected to `/admin/login`).

No Supabase needed — public queries fall back to seed data. This is the suite
any contributor (and the secret-less CI job) can always run.

## Suite 2 — admin CRUD (authenticated)

`e2e/admin-crud.spec.ts` signs into the real admin panel, creates an
unpublished course, verifies it in the table, deletes it (two-step inline
confirm), and verifies it's gone. That is **destructive-write testing**, so it
must never point at production.

### Why a dedicated test Supabase project

- The test writes and deletes rows — production data must be out of reach.
- `playwright.admin.config.ts` passes the test project's URL/key as **process
  env vars to the web server**, and Next.js lets real env vars override
  `.env.local` — so even with prod values in `.env.local`, the server under
  test talks only to the test project.
- Belt-and-braces: the config **hard-fails on startup** if the Supabase URL
  contains the known production project ref.

### One-time setup

1. **Create a second Supabase project** (free tier is fine), e.g.
   `nalanda-e2e-test`.

2. **Run all four migrations** in its SQL Editor, in order:
   `0001_init.sql` → `0002_admin_roles.sql` → `0003_course_slugs.sql` →
   `0004_login_throttle.sql`. (Optionally `seed.sql` for realistic content.)

3. **Create the test admin user** — Dashboard → Authentication → Users →
   *Add user* → e.g. `e2e@nalanda.test` with a throwaway password (tick
   "auto-confirm").

4. **Allow-list that user** — the login works without this, but every write
   would land on `/admin/no-access`. In the SQL Editor:

   ```sql
   insert into public.admins (user_id, email, note)
   select id, email, 'E2E test admin'
   from auth.users
   where email = 'e2e@nalanda.test'
   on conflict (user_id) do nothing;
   ```

5. **Create `.env.e2e`** in the repo root (it is gitignored — never commit it):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<test-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<test-project-anon-key>
   E2E_ADMIN_EMAIL=e2e@nalanda.test
   E2E_ADMIN_PASSWORD=<the-throwaway-password>
   ```

6. **Run it**

   ```bash
   npm run test:e2e:auth
   ```

If `.env.e2e` is absent (or the vars are empty), the spec `test.skip`s itself
— it never fails just because setup is missing.

## CI

`.github/workflows/ci.yml` has three jobs:

1. **build-and-test** — typecheck, lint, unit tests, production build
2. **e2e** — Suite 1 (no secrets)
3. **e2e-auth** — Suite 2, fed by four **repository secrets**:

   | GitHub secret | Maps to |
   | --- | --- |
   | `E2E_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
   | `E2E_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | `E2E_ADMIN_EMAIL` | `E2E_ADMIN_EMAIL` |
   | `E2E_ADMIN_PASSWORD` | `E2E_ADMIN_PASSWORD` |

   If the secrets are unset the job still passes (the spec skips) — forks and
   fresh clones stay green.

## Troubleshooting

- **Test lands on `/admin/no-access`** — the test user authenticated but is
  not in `public.admins` of the *test* project. Re-run step 4.
- **Config throws "refusing to run against production"** — `.env.e2e` (or the
  CI secret) points at the production project. Fix the URL; do not bypass the
  guard.
- **`EADDRINUSE` on port 3100/3101** — a previous test server is still alive.
  Windows: `Get-NetTCPConnection -LocalPort 3101 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`.
  A zombie server serves a **stale build** — results will lie; always kill it.
- **Suite 2 login throttled** ("Too many failed attempts") — migration `0004`
  counts failures per IP in the test project too. Wait out the window or
  `delete from public.login_attempts;` in the test project.
