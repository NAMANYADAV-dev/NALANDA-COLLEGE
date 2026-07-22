'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { hasRealImage, tileGradient, tileHeight } from '@/features/gallery/data';
import type { GalleryImage } from '@/types/database.types';

/**
 * GalleryGrid — masonry photo wall with a full-screen lightbox.
 *
 * Client Component: owns the lightbox open/index state and wires keyboard
 * navigation (Esc to close, ←/→ to move). Images come from the server; each
 * tile shows the real photo when uploaded, otherwise a captioned gradient.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  // The lightbox is a modal dialog: hold a ref to it so focus can be trapped
  // inside while open, and remember which tile opened it so focus can return
  // there on close (WCAG 2.4.3 Focus Order / 2.1.2 No Keyboard Trap).
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openAt = useCallback((index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  // Deep-link support: `/gallery?photo=<id>` from a search result opens the
  // lightbox on that image. Read from the URL on mount (no Suspense needed).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('photo');
    if (!id) return;
    const idx = images.findIndex((img) => img.id === id);
    if (idx >= 0) setOpenIndex(idx);
  }, [images]);

  // Keyboard controls + scroll lock + focus management while open.
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    // Move focus into the dialog so a screen reader announces it and the next
    // Tab stays inside. Restored to the opening tile in the cleanup below.
    const opener = triggerRef.current;
    dialog?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'ArrowRight') {
        move(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        move(-1);
        return;
      }
      // Focus trap: keep Tab cycling among the dialog's own controls (close,
      // prev, next) instead of leaking back to the page behind the overlay.
      if (e.key === 'Tab' && dialog) {
        const focusable = dialog.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === dialog)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      // Return focus to the tile that opened the lightbox (skip on deep-link
      // open, where there is no opener to return to).
      opener?.focus();
    };
  }, [isOpen, close, move]);

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <div className="container-page py-12">
      {/* CSS multi-column masonry */}
      <div className="gap-4 [column-gap:1rem] sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={(e) => openAt(i, e.currentTarget)}
            aria-haspopup="dialog"
            className="mb-4 block w-full overflow-hidden rounded-xl [break-inside:avoid] transition hover:opacity-95"
          >
            <span
              className="relative flex items-end"
              // The gradient doubles as the loading placeholder behind a real
              // photo, so there's never a blank flash while next/image streams in.
              style={{ height: tileHeight(i), background: tileGradient(i) }}
            >
              {hasRealImage(img.image_url) && (
                <Image
                  src={img.image_url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
              <span className="relative z-10 w-full bg-gradient-to-b from-transparent to-[rgba(18,41,77,.7)] px-4 py-3.5 text-left text-[13px] font-medium text-white">
                {img.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery photo: ${current.title}`}
          tabIndex={-1}
          onClick={close}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(11,20,38,.92)] p-3 outline-none sm:p-10"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white hover:bg-white/25"
          >
            <Icon name="close" size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            aria-label="Previous"
            className="absolute left-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 p-2 text-white backdrop-blur hover:bg-white/40 sm:left-4 sm:h-[52px] sm:w-[52px] sm:bg-white/[0.12] sm:p-3 sm:hover:bg-white/25"
          >
            <Icon name="chevron-left" size={24} />
          </button>

          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[820px]">
            <div className="relative h-[60vh] max-h-[520px] overflow-hidden rounded-xl shadow-[0_30px_80px_rgba(0,0,0,.5)]">
              {hasRealImage(current.image_url) ? (
                <Image
                  src={current.image_url}
                  alt={current.title}
                  fill
                  sizes="(max-width: 820px) 100vw, 820px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full" style={{ background: tileGradient(openIndex!) }} />
              )}
            </div>
            <div className="mt-4 text-center text-[15px] text-[#c6d2e4]">{current.title}</div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            aria-label="Next"
            className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 p-2 text-white backdrop-blur hover:bg-white/40 sm:right-4 sm:h-[52px] sm:w-[52px] sm:bg-white/[0.12] sm:p-3 sm:hover:bg-white/25"
          >
            <Icon name="chevron-right" size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
