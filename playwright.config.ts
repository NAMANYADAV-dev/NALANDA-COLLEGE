import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright end-to-end config.
 *
 * These tests drive a real browser against a real production build of the site
 * — the layer Vitest can't reach (routing, focus management, client
 * interactivity). Unit tests stay in `src/**​/*.test.ts` on Vitest; E2E specs
 * live in `e2e/` as `*.spec.ts`, so the two runners never pick up each other's
 * files.
 *
 * The web server is a real `next build` + `next start` on a dedicated port
 * (3100) so it never collides with a dev server on 3000. No Supabase secrets
 * are provided: the site falls back to its seed data, which is enough to
 * exercise every public page and interaction under test.
 */
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  // The authenticated admin CRUD spec needs a real test Supabase project and
  // runs from playwright.admin.config.ts instead — keep it out of this
  // no-secrets suite so this one stays runnable with zero setup.
  testIgnore: '**/admin-crud.spec.ts',
  // Fail the CI run if a `test.only` is accidentally committed.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL,
    // Only keep a trace when a test fails on retry — cheap, and enough to debug.
    trace: 'on-first-retry',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
