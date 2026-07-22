import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Playwright config for the AUTHENTICATED admin E2E (course CRUD).
 *
 * Kept separate from playwright.config.ts on purpose: the default suite runs
 * with no secrets against seed-fallback data, so anyone can run it. This one
 * needs a real (but dedicated *test*) Supabase project and a throwaway admin,
 * so it only runs when .env.e2e is present.
 *
 * .env.e2e supplies the test project URL/key and the test admin credentials.
 * Those vars are passed to the web server, where they override .env.local at
 * runtime (Next lets real env vars win over .env files) — so this never touches
 * the production project. As a belt-and-braces check the URL is asserted to
 * differ from a hard-coded production ref before the server starts.
 */

/** Parse .env.e2e into a plain map (no dotenv dependency). */
function loadE2EEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.e2e'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    /* file absent → the spec's test.skip handles it */
  }
  return out;
}

const env = loadE2EEnv();

// Safety rail: refuse to run against the known production project, even if
// .env.e2e were misconfigured. This is destructive-write testing.
const PROD_REF = 'oehyjonihkttegaxpmxz';
if (env.NEXT_PUBLIC_SUPABASE_URL?.includes(PROD_REF)) {
  throw new Error(
    'playwright.admin.config: .env.e2e points at the PRODUCTION Supabase project. ' +
      'Point it at a dedicated test project before running admin CRUD tests.',
  );
}

// Expose credentials to the test process.
process.env.E2E_ADMIN_EMAIL = env.E2E_ADMIN_EMAIL ?? '';
process.env.E2E_ADMIN_PASSWORD = env.E2E_ADMIN_PASSWORD ?? '';

const PORT = 3101;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/admin-crud.spec.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: { baseURL, trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // Merge so PATH etc. survive; the test-project vars override .env.local.
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
  },
});
