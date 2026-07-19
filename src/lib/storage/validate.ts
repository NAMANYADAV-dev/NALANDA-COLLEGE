import { UPLOAD_CONFIG, formatBytes, type UploadModule } from '@/config/storage';

/**
 * File validation — the first gate before any upload.
 *
 * Checks MIME type and size against the module's rules (see storage config).
 * Runs client-side for instant feedback; the Storage bucket enforces the same
 * limits server-side as a backstop, so this can't be bypassed by a crafted request.
 */

export type ValidationResult = { ok: true } | { ok: false; error: string };

/** Validate a picked file against its module's allowed types and size cap. */
export function validateFile(file: File, module: UploadModule): ValidationResult {
  const cfg = UPLOAD_CONFIG[module];

  if (!cfg.accept.includes(file.type)) {
    return { ok: false, error: `Unsupported file type. Please choose a ${cfg.acceptLabel} file.` };
  }
  if (file.size > cfg.maxBytes) {
    return {
      ok: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum is ${formatBytes(cfg.maxBytes)}.`,
    };
  }
  return { ok: true };
}
