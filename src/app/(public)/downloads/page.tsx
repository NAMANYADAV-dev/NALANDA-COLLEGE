import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { getDownloads } from '@/features/downloads/queries';
import { DownloadCard } from '@/features/downloads/components/DownloadCard';

export const metadata: Metadata = {
  title: 'Downloads',
  description:
    'Download the prospectus, fee structure, syllabus, academic calendar, forms and other resources for Nalanda College.',
};

/** Downloads page — all downloadable resources, fetched on the server. */
export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Downloads"
        subtitle="Prospectus, fee structure, syllabus, forms and more — all in one place."
      />

      <div className="container-page py-12">
        {downloads.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((d) => (
              <DownloadCard key={d.id} download={d} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted">
            <Icon name="file-down" size={46} className="mx-auto mb-3.5 text-gold" />
            <div className="font-head text-lg font-semibold text-text">No resources yet</div>
            <p className="mt-2 text-[15px]">Downloadable resources will appear here soon.</p>
          </div>
        )}
      </div>
    </>
  );
}
