'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { primaryNav, exploreNav, siteConfig } from '@/config/site';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { SiteSearch } from '@/components/layout/SiteSearch';
import { ExploreMenu } from '@/components/layout/ExploreMenu';
import { CoursesMenu } from '@/components/layout/CoursesMenu';
import type { Course } from '@/types/database.types';

/**
 * SiteNav — sticky top navigation shared by every public page.
 *
 * Client Component because it is inherently interactive: Explore dropdown,
 * language menu, expanding search, and the mobile drawer all hold local UI
 * state. Static content (links, brand, contact) is injected from `site.ts`,
 * keeping this file about behaviour, not data.
 */
export function SiteNav({ courses }: { courses: Course[] }) {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'हिन्दी'>('EN');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);

  /** Close the popover menus when clicking outside or pressing Escape. */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      // ⌘K / Ctrl+K toggles search from anywhere.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape') {
        setLangOpen(false);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  /** Lock body scroll while the mobile drawer is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface shadow-nav">
      <div className="flex h-[72px] items-center justify-between px-5 sm:px-6 lg:px-10">
        {/* Brand — monogram + college name (matches the footer). */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={siteConfig.name}>
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-lg bg-navy font-head text-lg font-bold text-white">
            N
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-head text-base font-bold text-heading sm:text-lg">
              {siteConfig.name}
            </span>
            <span className="hidden truncate font-body text-[11px] tracking-[0.04em] text-muted min-[360px]:block">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        {/* Primary nav (desktop) */}
        <nav className="hidden items-center gap-6 text-[15px] font-medium lg:flex">
          {primaryNav.map((link) =>
            // "Courses" becomes a hover mega-menu listing the live catalogue;
            // the other primary items stay simple links.
            link.href === '/courses' ? (
              <CoursesMenu key={link.href} courses={courses} active={isActive(link.href)} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'py-1.5 transition-colors hover:text-gold',
                  isActive(link.href)
                    ? 'border-b-2 border-gold font-semibold text-navy dark:text-gold-hi'
                    : 'text-text',
                )}
              >
                {link.label}
              </Link>
            ),
          )}

          {/* Explore mega-menu (opens on hover) */}
          <ExploreMenu />
        </nav>

        {/* Actions */}
        <div className="flex flex-none items-center gap-2 sm:gap-3.5">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            title="Search"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-border bg-surface text-navy hover:bg-section-alt dark:text-gold-hi"
          >
            <Icon name="search" size={18} />
          </button>

          <ThemeToggle />

          {/* Language switch (desktop) */}
          <div className="relative hidden lg:block" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex h-[38px] items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-navy hover:bg-section-alt dark:text-gold-hi"
            >
              <Icon name="globe" size={16} />
              {lang}
              <Icon name="chevron-down" size={11} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[130px] animate-fade-in rounded-lg border border-border bg-surface p-1.5 shadow-[0_10px_30px_rgba(0,0,0,.12)]">
                {(['EN', 'हिन्दी'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-text hover:bg-section-alt hover:text-gold"
                  >
                    {l === 'EN' ? 'English' : 'हिन्दी'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button href="/admissions" size="md" className="hidden sm:inline-flex shadow-none">
            Apply Now
          </Button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            title="Menu"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-border bg-surface text-navy hover:bg-section-alt lg:hidden dark:text-gold-hi"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Expanding instant-search bar */}
      {searchOpen && (
        <div className="animate-fade-in border-b border-border bg-surface px-5 py-4 shadow-[0_6px_16px_rgba(0,0,0,.06)] sm:px-6 lg:px-10">
          <SiteSearch onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-[72px] z-40 h-[calc(100vh-72px)] overflow-y-auto bg-surface px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">
            {[...primaryNav, ...exploreNav].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-3.5 font-head text-[17px] font-medium hover:bg-section-alt hover:text-gold',
                  isActive(link.href) ? 'text-navy dark:text-gold-hi' : 'text-text',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button href="/admissions" size="lg" className="mt-3" onClick={() => setMenuOpen(false)}>
              Apply Now
            </Button>

            {/* Language switch — the desktop version is hidden below lg, so the
                drawer is the only place tablet/mobile users can change language. */}
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">
                Language
              </div>
              <div className="inline-flex rounded-lg bg-section-alt p-1">
                {(['EN', 'हिन्दी'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                      lang === l ? 'bg-surface text-navy shadow-card dark:text-gold-hi' : 'text-muted',
                    )}
                  >
                    {l === 'EN' ? 'English' : 'हिन्दी'}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
