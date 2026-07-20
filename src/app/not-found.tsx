import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, exploreNav, primaryNav } from '@/config/site';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * 404 page for any unmatched URL.
 *
 * Lives at the app root, so it renders inside the root layout only — the
 * (public) group's nav and footer are not available here. Rather than half-
 * rebuild that chrome, it offers the real navigation links straight from
 * `siteConfig`, which is more useful on a dead end anyway: a visitor who
 * mistyped a URL or followed an old link mainly needs a way onward.
 */
export default function NotFound() {
  const links = [...primaryNav, ...exploreNav];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-section-alt px-6 py-20 text-center">
      <span className="font-head text-[64px] font-bold leading-none text-navy dark:text-gold-hi">
        404
      </span>

      <h1 className="mt-4 font-head text-[28px] font-bold leading-tight text-heading">
        We couldn&apos;t find that page
      </h1>

      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">
        The link may be out of date, or the page may have moved. Here&apos;s everything on the{' '}
        {siteConfig.name} website:
      </p>

      <nav aria-label="Site sections" className="mt-8 flex max-w-[540px] flex-wrap justify-center gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-[9px] border border-border bg-surface px-4 py-2.5 font-head text-sm font-semibold text-navy transition-colors hover:bg-chip-bg dark:text-gold-hi"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        className="mt-10 inline-flex items-center rounded-md bg-gold px-7 py-[13px] font-head text-[15px] font-semibold text-white transition-colors hover:bg-gold-hover"
      >
        Back to home
      </Link>
    </main>
  );
}
