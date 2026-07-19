/**
 * Deep-link highlight helper (client only).
 *
 * When a search result points at `/route#type-<id>`, the destination listing
 * component calls this to scroll the matching card into view and flash a brief
 * highlight so the user's eye lands on the exact item. The CSS animation lives
 * in globals.css (`.search-highlight`).
 */
export function highlightElement(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.remove('search-highlight');
  // Force reflow so re-adding the class restarts the animation on repeat clicks.
  void el.offsetWidth;
  el.classList.add('search-highlight');
  window.setTimeout(() => el.classList.remove('search-highlight'), 2200);
}
