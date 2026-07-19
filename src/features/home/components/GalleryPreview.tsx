import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils/cn';
import { hasRealImage, tileGradient } from '@/features/gallery/data';
import type { GalleryImage } from '@/types/database.types';

/**
 * GalleryPreview — homepage teaser showing the first few gallery images in a
 * mosaic (one featured tile + four smaller), linking to the full gallery.
 *
 * Images come from the database (same source as the /gallery page), so whatever
 * an admin uploads appears here automatically. A tile whose image hasn't been
 * uploaded yet falls back to a brand gradient; an empty gallery shows a hint.
 */
export function GalleryPreview({ images }: { images: GalleryImage[] }) {
  const tiles = images.slice(0, 5); // one featured + up to four small

  return (
    <Section>
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Life on campus</p>
          <h2 className="section-title mt-1.5">Campus gallery</h2>
        </div>
        <Link href="/gallery" className="text-[15px] font-semibold text-navy hover:text-gold dark:text-gold-hi">
          View all →
        </Link>
      </div>

      {tiles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface py-16 text-center text-muted">
          Campus photos will appear here soon.
        </div>
      ) : (
        <div className="grid h-auto grid-cols-2 grid-rows-[repeat(3,120px)] gap-3.5 sm:h-[360px] sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-2">
          {tiles.map((img, i) => (
            <Link
              key={img.id}
              href="/gallery"
              aria-label={img.title}
              style={
                hasRealImage(img.image_url)
                  ? { backgroundImage: `url(${img.image_url})` }
                  : { backgroundImage: tileGradient(i) }
              }
              className={cn(
                'group relative flex items-end overflow-hidden rounded-[10px] bg-cover bg-center transition hover:brightness-105',
                i === 0 && 'row-span-2', // first image is featured (spans both rows)
              )}
            >
              <span className="w-full bg-gradient-to-b from-transparent to-[rgba(18,41,77,.72)] px-4 py-3 text-left text-[13px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
