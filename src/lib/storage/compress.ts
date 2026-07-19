import { IMAGE_OPTIMISATION } from '@/config/storage';

/**
 * Client-side image optimisation (browser only — uses canvas/createImageBitmap).
 *
 * Downscales the image to fit within maxDimension on its longest edge and
 * re-encodes it to WebP at the configured quality. This dramatically shrinks
 * upload size with no visible quality loss and normalises every image to one
 * format. Returns `null` if the browser can't process the file, so callers can
 * gracefully fall back to uploading the original.
 */
export async function compressImage(file: File): Promise<File | null> {
  const { maxDimension, quality, outputType, outputExt } = IMAGE_OPTIMISATION;

  // `imageOrientation: 'from-image'` bakes in EXIF rotation so portrait phone
  // photos don't end up sideways after re-encoding.
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(
    () => null,
  );
  if (!bitmap) return null;

  try {
    let { width, height } = bitmap;
    const longest = Math.max(width, height);
    if (longest > maxDimension) {
      const scale = maxDimension / longest;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, quality),
    );
    if (!blob) return null;

    // Guard against pathological cases where WebP is somehow larger than the
    // original (rare, e.g. already-tiny images) — keep whichever is smaller.
    if (blob.size >= file.size) return null;

    return new File([blob], `image.${outputExt}`, { type: outputType });
  } finally {
    bitmap.close?.();
  }
}
