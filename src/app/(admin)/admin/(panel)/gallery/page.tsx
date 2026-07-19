import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Icon } from '@/components/ui/Icon';
import { getAllGalleryImages } from '@/features/gallery/queries';
import { tileGradient, hasRealImage } from '@/features/gallery/data';
import { GalleryRowActions } from '@/features/gallery/components/GalleryRowActions';

export const metadata: Metadata = { title: 'Gallery · Admin' };

/** Admin gallery — every image (published or not) as a card grid with controls. */
export default async function AdminGalleryPage() {
  const images = await getAllGalleryImages();

  return (
    <>
      <AdminHeader
        title="Gallery"
        subtitle={`${images.length} image${images.length === 1 ? '' : 's'}`}
        actions={
          <Link
            href="/admin/gallery/new"
            className="flex h-10 items-center gap-1.5 rounded-[9px] bg-gold px-4 font-head text-sm font-semibold text-white hover:bg-gold-hover"
          >
            <Icon name="plus" size={16} /> Add image
          </Link>
        }
      />

      <div className="p-7">
        {images.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
            <Icon name="layers" size={38} className="mx-auto mb-3 text-muted" />
            <p className="font-head text-lg font-semibold text-text">No images yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              Add your first image — paste a photo URL and it appears in the public gallery.
            </p>
            <Link
              href="/admin/gallery/new"
              className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-hover"
            >
              <Icon name="plus" size={16} /> Add image
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <div key={img.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                {/* Thumbnail — real image when available, else a captioned gradient tile */}
                <div className="relative h-40 w-full">
                  {hasRealImage(img.image_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.image_url} alt={img.title} className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center px-4 text-center font-head text-sm font-semibold text-white"
                      style={{ background: tileGradient(i) }}
                    >
                      {img.title}
                    </div>
                  )}
                  {!img.is_published && (
                    <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="truncate font-semibold text-text">{img.title}</div>
                  <div className="mb-3 text-[12.5px] text-muted">{img.category ?? 'Uncategorised'}</div>
                  <GalleryRowActions id={img.id} isPublished={img.is_published} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
