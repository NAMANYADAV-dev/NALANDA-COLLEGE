/**
 * Storage configuration — the single source of truth for file uploads.
 *
 * Bucket names, size limits and allowed MIME types live here ONLY, so nothing
 * across the app hardcodes a bucket string or a magic size. These values mirror
 * the buckets provisioned in Supabase (gallery / faculty / downloads); if a
 * limit changes in the dashboard, change it here too.
 */

/** A logical upload target. Each maps 1:1 to a Supabase Storage bucket. */
export type UploadModule = 'gallery' | 'faculty' | 'downloads';

/** Whether a module holds optimisable images or opaque documents. */
export type UploadKind = 'image' | 'document';

export interface UploadModuleConfig {
  /** Supabase Storage bucket id. */
  bucket: string;
  /** Hard size ceiling in bytes (matches the bucket's own limit). */
  maxBytes: number;
  /** Accepted MIME types. */
  accept: readonly string[];
  /** The same list as an <input accept="…"> string. */
  acceptAttr: string;
  /** Human-readable allowed-types label for hints and errors. */
  acceptLabel: string;
  /** image → compressed to WebP before upload; document → uploaded as-is. */
  kind: UploadKind;
}

const MB = 1024 * 1024;

/** Per-module upload rules. Keyed by {@link UploadModule}. */
export const UPLOAD_CONFIG: Record<UploadModule, UploadModuleConfig> = {
  gallery: {
    bucket: 'gallery',
    maxBytes: 10 * MB,
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    acceptAttr: 'image/jpeg,image/png,image/webp',
    acceptLabel: 'JPEG, PNG or WebP',
    kind: 'image',
  },
  faculty: {
    bucket: 'faculty',
    maxBytes: 8 * MB,
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    acceptAttr: 'image/jpeg,image/png,image/webp',
    acceptLabel: 'JPEG, PNG or WebP',
    kind: 'image',
  },
  downloads: {
    bucket: 'downloads',
    maxBytes: 25 * MB,
    accept: ['application/pdf'],
    acceptAttr: 'application/pdf',
    acceptLabel: 'PDF',
    kind: 'document',
  },
};

/** All bucket ids this app manages — used to decide if a URL is ours to delete. */
export const MANAGED_BUCKETS: readonly string[] = Object.values(UPLOAD_CONFIG).map(
  (c) => c.bucket,
);

/**
 * Client-side image optimisation settings. Images are downscaled to fit within
 * MAX_DIMENSION on the longest edge and re-encoded to WebP at QUALITY — small
 * files, no visible quality loss. Documents (PDF) are never touched.
 */
export const IMAGE_OPTIMISATION = {
  maxDimension: 1600,
  quality: 0.82,
  outputType: 'image/webp',
  outputExt: 'webp',
} as const;

/** Format a byte count as a short human label (e.g. "8 MB", "320 KB"). */
export function formatBytes(bytes: number): string {
  if (bytes >= MB) return `${Math.round((bytes / MB) * 10) / 10} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
