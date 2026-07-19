import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Button — the one call-to-action primitive for the whole site.
 *
 * Polymorphic by design: pass `href` to render a Next.js <Link> (used for the
 * many "Apply Now" / "Explore Courses" links), or omit it to render a native
 * <button> (used for interactive triggers like opening the stream modal).
 * Variants and sizes encode the design's button styles in one place.
 */

type Variant = 'primary' | 'ghost' | 'hero-ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold ' +
  'transition-[background-color,transform,box-shadow] duration-150 whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-gold text-white hover:bg-gold-hover shadow-[0_8px_22px_rgba(184,134,43,.28)]',
  ghost: 'border-[1.5px] border-navy text-navy hover:bg-section-alt dark:border-gold-hi dark:text-gold-hi',
  'hero-ghost': 'border-[1.5px] border-white/70 text-white hover:bg-white/10',
};

const sizes: Record<Size, string> = {
  md: 'text-[15px] px-5 py-[11px]',
  lg: 'text-base px-7 py-[15px]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<'button'>, 'className'>;

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  // `href` present → navigational link; otherwise → real button element.
  if ('href' in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
