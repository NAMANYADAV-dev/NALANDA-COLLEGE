/**
 * SkipLink — the first focusable element on every public page.
 *
 * WCAG 2.4.1 (Bypass Blocks): a keyboard or screen-reader user landing on a
 * page shouldn't have to tab through the whole nav — brand, search, theme,
 * language, every menu link — before reaching the actual content. This link is
 * visually hidden until focused, then appears top-left; activating it moves
 * focus to <main id="main-content">.
 *
 * Plain <a> with no state, so it stays a Server Component. It must render
 * before the nav in the DOM to be the first thing Tab reaches.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only z-[100] rounded-lg bg-navy px-4 py-2.5 font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}
