import { MANAGED_BUCKETS } from '@/config/storage';

/**
 * Public-URL ↔ storage-path helpers.
 *
 * The database stores the full public URL (in image_url / photo_url / file_url).
 * To delete or replace a file we must recover the bucket + object path from that
 * URL. This is shared by client and server, and deliberately returns `null` for
 * anything that isn't one of OUR managed buckets — external links and the '#'
 * placeholder are never touched.
 */

const PUBLIC_MARKER = '/storage/v1/object/public/';

export interface StorageRef {
  bucket: string;
  path: string;
}

/**
 * Parse a Supabase public URL into { bucket, path }, or null when the URL is a
 * placeholder, an external link, or not in a bucket this app manages.
 */
export function parseStorageRef(publicUrl: string | null | undefined): StorageRef | null {
  if (!publicUrl || publicUrl === '#') return null;

  const at = publicUrl.indexOf(PUBLIC_MARKER);
  if (at === -1) return null;

  const rest = publicUrl.slice(at + PUBLIC_MARKER.length); // "bucket/path/to/file.ext?..."
  const slash = rest.indexOf('/');
  if (slash === -1) return null;

  const bucket = rest.slice(0, slash);
  if (!MANAGED_BUCKETS.includes(bucket)) return null;

  // Drop any query string, then decode percent-encoding in the object path.
  const path = decodeURIComponent(rest.slice(slash + 1).split('?')[0]);
  if (!path) return null;

  return { bucket, path };
}

/** True when the URL points at a file we uploaded (and may safely delete). */
export function isManagedStorageUrl(url: string | null | undefined): boolean {
  return parseStorageRef(url) !== null;
}
