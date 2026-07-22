import { test, expect } from '@playwright/test';

/**
 * Admin access-guard E2E.
 *
 * Locks in the Phase 1 security behaviour: the /admin area is closed to anyone
 * without a session. No database and no credentials are needed — with no
 * Supabase session cookie the middleware treats the request as unauthenticated
 * and redirects, which is exactly the path an anonymous visitor hits.
 *
 * A successful *login* flow is deliberately out of scope: it needs a seeded
 * test admin in a real Supabase project, which is a separate setup decision.
 * What matters most — that the guard cannot be walked past — is covered here.
 */

test.describe('Admin access guard (Phase 1 security)', () => {
  test('an unauthenticated visitor to a protected route is sent to login', async ({ page }) => {
    await page.goto('/admin/courses');

    // The request never reaches the courses admin — it lands on the sign-in
    // page instead. (Two layers enforce this: the edge middleware and the
    // panel layout's requireAdmin(); either alone is enough to bounce us here.)
    await expect(page).toHaveURL(/\/admin\/login(\?|$)/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('the login page is reachable directly', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('a second protected route is also guarded', async ({ page }) => {
    await page.goto('/admin/notices');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
