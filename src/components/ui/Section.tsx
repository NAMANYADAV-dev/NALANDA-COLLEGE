import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Section — consistent vertical rhythm + optional background band, with an
 * inner max-width container. Almost every home-page block is a <Section>.
 *
 * `tone`: 'default' (page bg) · 'alt' (light grey) · 'band' (dark navy).
 */

type Tone = 'default' | 'alt' | 'band';

const tones: Record<Tone, string> = {
  default: '',
  alt: 'bg-section-alt',
  band: 'bg-band',
};

export function Section({
  as: Tag = 'section',
  tone = 'default',
  container = true,
  className,
  innerClassName,
  children,
}: {
  as?: ElementType;
  tone?: Tone;
  /** When false, children span full width (caller manages its own container). */
  container?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn('py-11 sm:py-16', tones[tone], className)}>
      <div className={cn(container && 'container-page', innerClassName)}>{children}</div>
    </Tag>
  );
}

/**
 * SectionHeading — the recurring centered "eyebrow → title → subtitle" header.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  className?: string;
  /** Use on dark bands so the title reads white. */
  invert?: boolean;
}) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn('section-title mt-2', invert && 'text-white')}>{title}</h2>
      {subtitle && <p className="mt-2.5 text-[15px] text-muted sm:text-base">{subtitle}</p>}
    </div>
  );
}
