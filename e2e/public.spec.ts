import { test, expect } from '@playwright/test';

/**
 * Public-site smoke tests.
 *
 * These don't need a database: every page under test renders from the seed
 * fallback when Supabase isn't configured, so the suite runs identically on a
 * developer's laptop and in CI with no secrets. They cover the paths a real
 * visitor takes, plus the two keyboard-accessibility features added in Phase 3
 * (skip link, lightbox focus trap) — exactly the interactive behaviour a unit
 * test can't reach.
 */

test.describe('Home', () => {
  test('loads with hero and primary navigation', async ({ page }) => {
    await page.goto('/');
    // The hero H1 is the page's headline — proves the page rendered, not errored.
    await expect(page.getByRole('heading', { level: 1 })).toContainText('capability');
    // Key nav destinations are reachable.
    await expect(page.getByRole('link', { name: 'Admissions' }).first()).toBeVisible();
  });
});

test.describe('Courses', () => {
  test('a course card opens its own detail page', async ({ page }) => {
    await page.goto('/courses');

    // Scope to <main> so we click a catalogue card, not a nav mega-menu link.
    const firstCard = page.locator('main a[href^="/courses/"]').first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute('href');

    await firstCard.click();

    // Landed on a real /courses/<slug> URL with a heading — not a modal, not 404.
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Breadcrumb back to the catalogue confirms this is the detail template.
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
  });
});

test.describe('Accessibility — skip to content (WCAG 2.4.1)', () => {
  test('first Tab reveals the skip link and it jumps to main', async ({ page }) => {
    await page.goto('/');

    // The skip link must be the very first focusable element on the page.
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();

    // Activating it moves focus into the main landmark.
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
    const activeId = await page.evaluate(() => document.activeElement?.id);
    expect(activeId).toBe('main-content');
  });
});

test.describe('Accessibility — gallery lightbox (WCAG 2.1.2 / 2.4.3)', () => {
  test('lightbox is a modal that traps Tab and restores focus on close', async ({ page }) => {
    await page.goto('/gallery');

    const firstTile = page.locator('button[aria-haspopup="dialog"]').first();
    await firstTile.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Tab repeatedly — focus must never escape the dialog to the page behind it.
    for (let i = 0; i < 5; i++) await page.keyboard.press('Tab');
    const focusTrapped = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return !!d && d.contains(document.activeElement);
    });
    expect(focusTrapped).toBe(true);

    // Escape closes it and returns focus to the tile that opened it.
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(firstTile).toBeFocused();
  });
});

test.describe('Admissions form', () => {
  test('an empty submission is blocked by client-side validation', async ({ page }) => {
    await page.goto('/admissions');

    await page.getByRole('button', { name: 'Submit inquiry' }).click();

    // Native constraint validation stops the submit before it reaches the
    // server and moves focus to the first invalid field (Full name).
    await expect(page.locator('#name')).toBeFocused();
    const nameValid = await page
      .locator('#name')
      .evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(nameValid).toBe(false);

    // Still on the form (no success panel), so nothing was submitted.
    await expect(page.getByRole('heading', { name: 'Admission inquiry' })).toBeVisible();
  });
});
