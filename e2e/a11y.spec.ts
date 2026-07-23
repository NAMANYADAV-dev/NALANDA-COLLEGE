import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility audit.
 *
 * Runs the axe-core engine (the same rules Lighthouse and most a11y tooling
 * use) against every key public page and asserts **zero** WCAG 2.0/2.1 A & AA
 * violations. This turns accessibility from "we think it's fine" into a
 * regression gate: a future change that ships a contrast failure, a missing
 * label, or an unlabelled control fails CI instead of shipping.
 *
 * Runs on seed-fallback data like the rest of the public suite — no secrets.
 * We scope to the standard WCAG A/AA tags; best-practice-only rules are left
 * out so the gate reflects the actual conformance target, not opinion.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const PAGES: { name: string; path: string }[] = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Contact', path: '/contact' },
  { name: 'About', path: '/about' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Notices', path: '/notices' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Downloads', path: '/downloads' },
  { name: 'Admin login', path: '/admin/login' },
];

for (const { name, path } of PAGES) {
  test(`${name} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    // Wait for the page to settle so late-mounted client components (nav,
    // theme toggle, card rails) are in the DOM when axe scans.
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    // On failure, surface each violation's id + the nodes it hit so the CI log
    // points straight at the offending element rather than a bare count.
    expect(
      results.violations,
      results.violations
        .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.help}`)
        .join('\n'),
    ).toEqual([]);
  });
}
