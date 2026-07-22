import { test, expect } from '@playwright/test';

/**
 * Authenticated admin CRUD — the flow the no-secrets suite can't reach.
 *
 * Runs via playwright.admin.config.ts against a dedicated *test* Supabase
 * project (never production — the config asserts that). It signs in with a
 * throwaway test admin, creates a uniquely-named course, confirms it lands in
 * the admin list, then deletes it, so the project stays clean and the test is
 * re-runnable. This exercises the whole protected path end to end: login →
 * session cookie → requireAdmin → RLS-guarded insert/delete.
 */

const EMAIL = process.env.E2E_ADMIN_EMAIL;
const PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('Admin course CRUD (authenticated)', () => {
  test.skip(!EMAIL || !PASSWORD, 'Requires E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD in .env.e2e');

  test('sign in, create a course, then delete it', async ({ page }) => {
    const name = `E2E Course ${Date.now()}`;

    // --- Sign in ---
    await page.goto('/admin/login');
    await page.getByLabel('Email address').fill(EMAIL!);
    await page.getByLabel('Password').fill(PASSWORD!);
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Successful auth lands on the dashboard (signIn redirects there).
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // --- Create ---
    await page.goto('/admin/courses/new');
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="duration"]', '3 years');
    await page.fill('input[name="fee"]', 'Rs 20,000');
    await page.fill('input[name="tagline"]', 'Temporary course created by an E2E test');
    await page.fill('textarea[name="about"]', 'Automated CRUD verification — safe to delete.');
    await page.fill('textarea[name="eligibility"]', '10+2, any stream');
    await page.uncheck('input[name="is_published"]'); // keep it off the public site
    await page.getByRole('button', { name: 'Create course' }).click();

    // The action redirects back to the list with the new course present.
    await expect(page).toHaveURL(/\/admin\/courses$/);
    const row = page.getByRole('row').filter({ hasText: name });
    await expect(row).toBeVisible();

    // --- Delete (two-step inline confirm) ---
    await row.getByRole('button', { name: 'Delete' }).click(); // trash icon (title="Delete")
    await row.getByRole('button', { name: 'Delete' }).click(); // confirm

    // Gone from the list — the create was real and the delete undid it.
    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
  });
});
