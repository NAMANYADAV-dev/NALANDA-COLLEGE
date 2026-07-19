'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';

/**
 * AssetImage — a next/image that degrades gracefully.
 *
 * For local brand images the user drops into /public/images. While the file is
 * missing (or fails to load) it renders `fallback` instead of a broken-image
 * icon; the moment the real file exists it shows automatically — no code change
 * needed. next/image still gives us optimisation, lazy-loading and correct
 * sizing for SEO + speed.
 */
export function AssetImage({
  src,
  alt,
  width,
  height,
  className,
  fallback,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallback: ReactNode;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;

  // SVGs are already scalable and tiny — serve them directly. (next/image would
  // otherwise need `dangerouslyAllowSVG`; a plain <img> avoids that surface.)
  if (src.toLowerCase().endsWith('.svg')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

