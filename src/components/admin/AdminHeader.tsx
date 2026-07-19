import type { ReactNode } from 'react';

/**
 * AdminHeader — sticky topbar rendered at the top of each admin page.
 * Left: page title + subtitle. Right: optional actions (e.g. a "New" button).
 */
export function AdminHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-border bg-surface px-7">
      <div className="min-w-0">
        <h1 className="font-head text-[19px] font-semibold text-navy dark:text-gold-hi">{title}</h1>
        {subtitle && <p className="truncate text-[12.5px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3.5">{actions}</div>}
    </header>
  );
}
