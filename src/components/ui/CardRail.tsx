import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * CardRail — responsive card layout: a swipeable snap carousel on phones, a
 * plain grid from `sm:` up.
 *
 * On mobile a stack of cards makes the home page enormously tall, so below
 * `sm` the children lay out in a horizontal rail with CSS scroll-snap: each
 * card takes ~85% of the viewport so the next one peeks in from the right —
 * the visual cue that the row swipes. No JavaScript, no library; it's just
 * overflow + snap, so it costs nothing and can't break.
 *
 * The rail bleeds to the screen edge (negative margin against the page
 * gutter) and `scroll-px-5` re-aligns the snap points with the gutter, so
 * cards rest exactly where the section heading starts.
 *
 * Keyboard/AT: the region is labelled and focusable, so a keyboard user can
 * focus it and scroll with arrow keys even when no child is interactive
 * (testimonials); DOM order is unchanged for screen readers and SEO.
 *
 * Pass grid columns for larger screens via `className`
 * (e.g. "sm:grid-cols-2 lg:grid-cols-3") and add `cardRailItem` to each child.
 */
export function CardRail({
  label,
  className,
  children,
}: {
  /** Accessible name for the scrollable region, e.g. "Courses". */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        // Phones: edge-bleeding horizontal snap rail.
        '-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-3 scroll-px-5',
        // sm and up: an ordinary grid; every rail style neutralised.
        'sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Sizing/snap classes for each direct child of a CardRail. */
export const cardRailItem = 'w-[85%] flex-none snap-start sm:w-auto';
