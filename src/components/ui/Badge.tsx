import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Badge — small pill label (course level, notice kind, hero eyebrow chips).
 * Tones map to the brand's navy / gold accent conventions.
 */

type Tone = 'navy' | 'gold' | 'muted';

const tones: Record<Tone, string> = {
  navy: 'text-navy bg-section-alt dark:text-gold-hi',
  gold: 'text-gold bg-faint-gold',
  muted: 'text-muted bg-section-alt',
};

export function Badge({
  tone = 'navy',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-[9px] py-1 text-[11px] font-semibold tracking-[0.06em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
