'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { UPLOAD_CONFIG, type UploadModule } from '@/config/storage';
import { validateFile } from './validate';
import { compressImage } from './compress';
import { buildObjectPath, extensionOf } from './filename';

/**
 * Browser-side upload service.
 *
 * Uploads straight from the browser to Supabase Storage (guarded by Storage RLS
 * — only an authenticated admin session can write). We use a raw XHR against the
 * Storage REST endpoint rather than supabase-js `.upload()` specifically to get
 * real byte-level progress events for the progress bar. Images are optimised to
 * WebP first; PDFs upload as-is. Returns the public URL to store in the DB.
 */

export interface UploadOutcome {
  publicUrl: string;
  bucket: string;
  path: string;
}

/** Extract a useful message from a Storage error XHR response. */
function readXhrError(xhr: XMLHttpRequest): string {
  try {
    const body = JSON.parse(xhr.responseText);
    if (body?.message) return String(body.message);
  } catch {
    /* not JSON */
  }
  if (xhr.status === 413) return 'File is too large for the storage bucket.';
  if (xhr.status === 403) return 'Not allowed — please sign in again.';
  return `Upload failed (status ${xhr.status || 'network'}).`;
}

/**
 * Validate → (optimise) → upload a file, reporting progress 0–100.
 * Throws an Error with a user-friendly message on any failure.
 */
export async function uploadFile(
  module: UploadModule,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadOutcome> {
  const cfg = UPLOAD_CONFIG[module];

  // 1) Validate the original file up front.
  const check = validateFile(file, module);
  if (!check.ok) throw new Error(check.error);

  // 2) Optimise images to WebP; leave documents untouched.
  let payload: Blob = file;
  let ext = extensionOf(file.name);
  if (cfg.kind === 'image') {
    const optimised = await compressImage(file);
    if (optimised) {
      payload = optimised;
      ext = 'webp';
    }
  }

  // 3) Need a live admin session to authorise the upload.
  const supabase = createBrowserSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Your session has expired. Please sign in again.');

  // 4) Unique object path, then POST the bytes with progress tracking.
  const path = buildObjectPath(ext);
  const endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${cfg.bucket}/${path}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('authorization', `Bearer ${session.access_token}`);
    xhr.setRequestHeader('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('cache-control', '3600');
    if (payload.type) xhr.setRequestHeader('content-type', payload.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(readXhrError(xhr)));
    xhr.onerror = () => reject(new Error('Network error during upload. Please try again.'));
    xhr.send(payload);
  });

  // 5) Resolve the public URL to persist in the database.
  const { data } = supabase.storage.from(cfg.bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl, bucket: cfg.bucket, path };
}

/**
 * Delete a just-uploaded object from the browser. Used only to clean up files
 * the user replaced or cancelled within the same session (so they don't orphan);
 * deletion of previously-saved files is done server-side after a DB commit.
 */
export async function deleteUploadedFile(bucket: string, path: string): Promise<void> {
  try {
    const supabase = createBrowserSupabaseClient();
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // Best-effort cleanup — never block the UI on it.
  }
}
