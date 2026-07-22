/**
 * Course URL slugs.
 *
 * Kept dependency-free and separate from the schema so it can be unit-tested
 * and reused by the admin form (which previews the slug as you type) and the
 * validator.
 *
 * IMPORTANT: `slugify` must produce the same output as the SQL backfill in
 * supabase/migrations/0003_course_slugs.sql. If the two drift, a course created
 * in the app and the same course backfilled in the database end up on different
 * URLs. The rule in both places is: lowercase, every run of non-alphanumeric
 * characters becomes a single hyphen, then trim leading/trailing hyphens.
 */

/** Longest slug we'll generate. Long URLs get truncated in search results. */
const MAX_SLUG_LENGTH = 60;

/**
 * Turn any text into a URL-safe slug.
 * "Bachelor of Science (B.Sc.)" → "bachelor-of-science-b-sc"
 *
 * Accented characters are folded to ASCII first (via NFD normalisation), so
 * "Māori Studies" becomes "maori-studies" rather than losing the letter.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip the combining accents NFD split off
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, ''); // slicing can leave a trailing hyphen
}

/**
 * Is this a slug we're willing to put in a URL?
 *
 * Deliberately stricter than "did slugify produce it": the admin can type a
 * slug by hand, and this is what stops a leading hyphen, a double hyphen or a
 * stray uppercase letter from reaching the database.
 */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= MAX_SLUG_LENGTH;
}
