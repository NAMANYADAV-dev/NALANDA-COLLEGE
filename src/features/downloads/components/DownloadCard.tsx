import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import type { Download } from '@/types/database.types';

/**
 * DownloadCard — a single downloadable resource, shown on the home "Quick
 * downloads" strip and the /downloads page. Opens the file in a new tab; if no
 * file has been uploaded yet (placeholder), it renders as a non-clickable card.
 */
export function DownloadCard({ download: d }: { download: Download }) {
  const hasFile = Boolean(d.file_url) && d.file_url !== '#';
  const meta = [d.file_type, d.size_label, d.category].filter(Boolean).join(' · ');

  return (
    <a
      href={hasFile ? d.file_url : undefined}
      target={hasFile ? '_blank' : undefined}
      rel={hasFile ? 'noopener noreferrer' : undefined}
      className={cn(
        'flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-card transition-transform duration-150',
        hasFile ? 'hover:-translate-y-1 hover:shadow-card-hover' : 'cursor-default opacity-70',
      )}
    >
      <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[10px] bg-section-alt text-navy dark:text-gold-hi">
        <Icon name="file-down" size={22} />
      </div>
      <div className="min-w-0">
        <div className="truncate font-head text-[15px] font-semibold text-text">{d.name}</div>
        <div className="mt-0.5 text-xs text-muted">{meta}</div>
      </div>
    </a>
  );
}
