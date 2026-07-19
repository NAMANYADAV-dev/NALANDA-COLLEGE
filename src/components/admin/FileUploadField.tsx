'use client';

import { useRef, useState, type DragEvent } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { UPLOAD_CONFIG, formatBytes, type UploadModule } from '@/config/storage';
import { uploadFile, deleteUploadedFile } from '@/lib/storage/upload-client';

/**
 * FileUploadField — reusable drag-&-drop uploader for the admin forms.
 *
 * Handles the full client-side flow: pick/drop → validate → optimise (images) →
 * upload to Supabase Storage with a live progress bar → preview. The resulting
 * public URL is written into a hidden <input name={name}> so the surrounding
 * form's Server Action persists it exactly like the old text field did — the
 * form contract is unchanged.
 *
 * Files uploaded during THIS session are tracked so that replacing or removing
 * them cleans up Storage immediately (no orphans). A previously-saved file (when
 * editing) is left untouched here; the Server Action deletes it only after the
 * database commit succeeds.
 */

type Status = 'idle' | 'optimising' | 'uploading' | 'ready' | 'error';

/** A file uploaded in this session — tracked so we can delete it if replaced. */
interface SessionFile {
  bucket: string;
  path: string;
}

export function FileUploadField({
  module,
  name,
  label,
  defaultUrl,
  required = false,
  hint,
}: {
  module: UploadModule;
  name: string;
  label: string;
  defaultUrl?: string | null;
  required?: boolean;
  hint?: string;
}) {
  const cfg = UPLOAD_CONFIG[module];
  const isImage = cfg.kind === 'image';
  const startUrl = defaultUrl && defaultUrl !== '#' ? defaultUrl : '';

  const [url, setUrl] = useState(startUrl);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);

  // The file uploaded in this session (deletable on replace/remove).
  const sessionFile = useRef<SessionFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = status === 'optimising' || status === 'uploading';

  /** Validate + optimise + upload a chosen file; replace any earlier upload. */
  async function handleFile(file: File) {
    setError('');
    setFileMeta({ name: file.name, size: file.size });
    const previous = sessionFile.current; // keep until the new upload succeeds

    try {
      setStatus(isImage ? 'optimising' : 'uploading');
      setProgress(0);

      const result = await uploadFile(module, file, (pct) => {
        setStatus('uploading');
        setProgress(pct);
      });

      // New upload is live — now it's safe to drop the one it replaced.
      if (previous) void deleteUploadedFile(previous.bucket, previous.path);
      sessionFile.current = { bucket: result.bucket, path: result.path };
      setUrl(result.publicUrl);
      setStatus('ready');
    } catch (err) {
      // Upload failed → keep whatever was valid before; surface the reason.
      setStatus(url ? 'ready' : 'error');
      setError((err as Error).message);
    }
  }

  /** Clear the field. Deletes the file only if we uploaded it this session. */
  function handleRemove() {
    const current = sessionFile.current;
    if (current) void deleteUploadedFile(current.bucket, current.path);
    sessionFile.current = null;
    setUrl('');
    setFileMeta(null);
    setStatus('idle');
    setProgress(0);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  const hasFile = Boolean(url);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-text">
        {label}
        {required && <span className="ml-1 text-[#D64545]">*</span>}
        {hint && <span className="ml-2 font-normal text-muted">{hint}</span>}
      </label>

      {/* The value persisted by the form's Server Action. */}
      <input type="hidden" name={name} value={url} readOnly />

      {/* Hidden native picker, opened by the drop zone / change button. */}
      <input
        ref={inputRef}
        type="file"
        accept={cfg.acceptAttr}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {/* ---- Preview (a file is set and not currently uploading) ---- */}
      {hasFile && !busy ? (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Preview" className="h-20 w-20 shrink-0 rounded-md object-cover" />
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-section-alt text-navy dark:text-gold-hi">
              <Icon name="file-down" size={30} />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#2E8B57]">
              <Icon name="check" size={15} /> Uploaded
            </div>
            {fileMeta && (
              <div className="mt-0.5 truncate text-[13px] text-muted">
                {fileMeta.name} · {formatBytes(fileMeta.size)}
              </div>
            )}
            <div className="mt-2 flex gap-3 text-[13px] font-semibold">
              <button type="button" onClick={() => inputRef.current?.click()} className="text-navy hover:underline dark:text-gold-hi">
                Replace
              </button>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:underline">
                View <Icon name="external" size={12} />
              </a>
              <button type="button" onClick={handleRemove} className="text-[#D64545] hover:underline">
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : busy ? (
        /* ---- Uploading / optimising state ---- */
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-text">
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-navy dark:border-t-gold-hi" />
              {status === 'optimising' ? 'Optimising image…' : 'Uploading…'}
            </span>
            {status === 'uploading' && <span className="text-muted">{progress}%</span>}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-section-alt">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-200"
              style={{ width: status === 'uploading' ? `${progress}%` : '15%' }}
            />
          </div>
        </div>
      ) : (
        /* ---- Empty drop zone ---- */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
            dragging ? 'border-navy bg-faint-gold dark:border-gold-hi' : 'border-border bg-surface hover:border-navy/60',
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-section-alt text-navy dark:text-gold-hi">
            <Icon name={isImage ? 'image' : 'upload'} size={22} />
          </span>
          <span className="text-sm font-semibold text-text">
            Click to upload <span className="font-normal text-muted">or drag &amp; drop</span>
          </span>
          <span className="text-[12px] text-muted">
            {cfg.acceptLabel} · up to {formatBytes(cfg.maxBytes)}
          </span>
        </button>
      )}

      {error && <p className="mt-1.5 text-[13px] text-[#D64545]">{error}</p>}
    </div>
  );
}
