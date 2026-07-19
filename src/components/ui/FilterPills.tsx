'use client';

import { cn } from '@/lib/utils/cn';

/**
 * FilterPills — reusable pill-style single-select filter.
 *
 * Purely presentational + controlled: the parent owns the active value and gets
 * notified via `onChange`. Shared by the Courses catalog (All/UG/PG) and the
 * Faculty directory (department filter) so the two never duplicate filter chrome.
 */
export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
  className,
}: {
  options: FilterOption<T>[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full px-[18px] py-2.5 text-sm font-semibold transition-colors',
              isActive
                ? 'border border-navy bg-navy text-white'
                : 'border border-border bg-surface text-navy hover:bg-section-alt dark:text-gold-hi',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
