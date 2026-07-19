import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { DownloadCard } from '@/features/downloads/components/DownloadCard';
import type { Download } from '@/types/database.types';

/**
 * DownloadsSection — home page "Quick downloads" strip. Shows the first four
 * resources; the full set lives on the dedicated /downloads page. Presentation
 * only; `downloads` are fetched server-side and passed in.
 */
export function DownloadsSection({ downloads }: { downloads: Download[] }) {
  return (
    <Section>
      <SectionHeading eyebrow="Resources" title="Quick downloads" />

      {downloads.length === 0 ? (
        <p className="mt-9 text-center text-muted">Resources will be available here soon.</p>
      ) : (
        <>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {downloads.slice(0, 4).map((d) => (
              <DownloadCard key={d.id} download={d} />
            ))}
          </div>

          {downloads.length > 4 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/downloads"
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy hover:text-gold dark:text-gold-hi"
              >
                View all resources <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
