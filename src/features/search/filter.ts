import type { SearchItem, SearchType } from './types';

/**
 * Client-side search ranking.
 *
 * Runs entirely in the browser over the pre-fetched index, so results update
 * instantly on every keystroke with no network round-trip. Matching is
 * token-AND (every word in the query must appear somewhere in the item), and
 * scoring favours title matches, then prefix matches, then a small per-type
 * priority so the most relevant kinds float up on ties.
 */

/** Higher = surfaces earlier when scores are otherwise close. */
const TYPE_PRIORITY: Record<SearchType, number> = {
  page: 8,
  course: 10,
  faculty: 6,
  notice: 5,
  event: 5,
  gallery: 3,
  download: 4,
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

/**
 * searchItems — filter + rank the index for a query.
 * @returns up to `limit` items, best match first. Empty query → no results.
 */
export function searchItems(items: SearchItem[], query: string, limit = 10): SearchItem[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(/\s+/);

  const scored: { item: SearchItem; score: number }[] = [];

  for (const item of items) {
    const title = item.title.toLowerCase();
    const haystack = `${title} ${(item.subtitle ?? '').toLowerCase()} ${(item.keywords ?? '').toLowerCase()}`;

    // Every token must appear somewhere, otherwise it is not a match.
    if (!tokens.every((t) => haystack.includes(t))) continue;

    let score = TYPE_PRIORITY[item.type] ?? 0;
    if (title.startsWith(q)) score += 100;
    else if (title.includes(q)) score += 60;
    if (tokens.every((t) => title.includes(t))) score += 30;

    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * splitHighlight — split a title into [before, match, after] for the first
 * case-insensitive occurrence of the query, so the UI can bold the match.
 * Returns null when there is no contiguous match to highlight.
 */
export function splitHighlight(title: string, query: string): [string, string, string] | null {
  const q = normalize(query);
  if (!q) return null;
  const idx = title.toLowerCase().indexOf(q);
  if (idx === -1) return null;
  return [title.slice(0, idx), title.slice(idx, idx + q.length), title.slice(idx + q.length)];
}
