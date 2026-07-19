/**
 * Search types.
 *
 * A single flat `SearchItem` shape represents everything searchable on the
 * site — pages plus every content entity — so the client can rank and render a
 * unified result list. The server builds the index (see `index.ts`); the client
 * filters it (see `filter.ts`).
 */

export type SearchType = 'page' | 'course' | 'faculty' | 'notice' | 'event' | 'gallery' | 'download';

export interface SearchItem {
  /** Stable id (entity id, or a slug for pages). */
  id: string;
  type: SearchType;
  /** Primary label shown and matched with highest weight. */
  title: string;
  /** Secondary context line (e.g. "UG · 3 years"). Also searched. */
  subtitle?: string;
  /** Where selecting this result navigates — includes deep-link anchors. */
  href: string;
  /** Extra hidden text to match against (subjects, careers, body, …). */
  keywords?: string;
}
