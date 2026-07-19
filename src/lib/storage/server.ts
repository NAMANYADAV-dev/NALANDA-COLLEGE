import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { parseStorageRef } from './public-url';

/**
 * Server-side Storage cleanup.
 *
 * Runs inside Server Actions to keep Storage and the database in sync:
 *  - after a record UPDATE swaps in a new file → delete the OLD file
 *  - after a record DELETE → delete its file
 *  - as ROLLBACK when a DB write fails after a new file was already uploaded
 *
 * Uses the admin's authenticated session (Storage RLS allows authenticated
 * deletes on our buckets). Cleanup is best-effort: a failed delete is logged but
 * never throws, so it can't break the user-facing action. External URLs and the
 * '#' placeholder are ignored (parseStorageRef returns null for them).
 */
export async function removeStoredFile(publicUrl: string | null | undefined): Promise<void> {
  const ref = parseStorageRef(publicUrl);
  if (!ref) return;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.storage.from(ref.bucket).remove([ref.path]);
    if (error) throw error;
  } catch (err) {
    console.warn('[storage] cleanup failed for', publicUrl, '—', (err as Error).message);
  }
}

/**
 * Delete the old file only when it actually changed. Convenience wrapper for the
 * update flow so a no-op edit (same URL) never deletes the live file.
 */
export async function removeReplacedFile(
  oldUrl: string | null | undefined,
  newUrl: string | null | undefined,
): Promise<void> {
  if (!oldUrl || oldUrl === newUrl) return;
  await removeStoredFile(oldUrl);
}
