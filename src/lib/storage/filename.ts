/**
 * Object-path generation.
 *
 * Every uploaded file gets a collision-proof name: a timestamp (keeps listings
 * roughly chronological) plus a UUID, then the correct extension. The original
 * filename is intentionally dropped — it may contain unsafe characters, PII, or
 * duplicate across uploads.
 */

/** Build a unique storage object path, e.g. `1721400000000-1f2e….webp`. */
export function buildObjectPath(ext: string): string {
  const safeExt = ext.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  return `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
}

/** Lower-cased extension from a filename (without the dot), or '' if none. */
export function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot + 1).toLowerCase();
}
