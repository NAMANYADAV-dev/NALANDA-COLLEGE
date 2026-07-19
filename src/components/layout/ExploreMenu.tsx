'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { exploreNav } from '@/config/site';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

/**
 * ExploreMenu — the desktop "Explore" mega-menu.
 *
 * Opens on hover (with a small close delay so the cursor can travel from the
 * trigger into the panel) and also toggles on click / closes on Escape for
 * keyboard and touch users. Renders a rich two-column panel: descriptive links
 * on the left, a featured Admissions card on the right. Desktop-only — mobile
 * lists these items in the nav drawer instead.
 */

/** Icon + one-line description per Explore destination, keyed by href. */
const META: Record<string, { icon: IconName; desc: string }> = {
  '/faculty': { icon: 'users', desc: 'Meet our professors & departments' },
  '/notices': { icon: 'calendar', desc: 'Announcements and campus events' },
  '/gallery': { icon: 'eye', desc: 'Photos of campus life' },
  '/downloads': { icon: 'file-down', desc: 'Prospectus, syllabus & forms' },
  '/contact': { icon: 'mail', desc: 'Address, phone, email & map' },
};

export function ExploreMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Hover intent: open immediately, close after a short grace period so moving
  // the cursor across the gap into the panel doesn't dismiss it.
  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // Close on Escape or a click outside the menu.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClickAway(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickAway);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickAway);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-1.5 py-1.5 transition-colors hover:text-gold',
          open ? 'text-gold' : 'text-text',
        )}
      >
        Explore
        <Icon name="chevron-down" size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        // `pt-3` renders the visual gap while staying part of the hover area,
        // so there is no dead zone between the trigger and the panel.
        <div className="absolute right-0 top-full z-30 pt-3">
          <div className="grid w-[600px] animate-fade-in grid-cols-[1.4fr_1fr] gap-4 rounded-xl border border-border bg-surface p-4 shadow-[0_16px_44px_rgba(0,0,0,.16)]">
            {/* Links column */}
            <div>
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Explore Nalanda
              </p>
              <div className="flex flex-col">
                {exploreNav.map((link) => {
                  const meta = META[link.href];
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-section-alt"
                    >
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-section-alt text-navy transition-colors group-hover:bg-navy group-hover:text-white dark:text-gold-hi">
                        <Icon name={meta?.icon ?? 'arrow-right'} size={18} />
                      </span>
                      <span>
                        <span className="block font-head text-[15px] font-semibold text-text group-hover:text-navy dark:group-hover:text-gold-hi">
                          {link.label}
                        </span>
                        {meta && <span className="block text-[13px] text-muted">{meta.desc}</span>}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Featured card */}
            <div className="flex flex-col justify-between rounded-lg bg-gradient-to-br from-navy to-navy-deep p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-hi">
                  Admissions
                </p>
                <p className="mt-2 font-head text-lg font-semibold leading-snug text-white">
                  Join us in 2026–27
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#c6d2e4]">
                  Applications are open across all UG &amp; PG programmes.
                </p>
              </div>
              <Button href="/admissions" size="md" className="mt-4 w-full justify-center" onClick={() => setOpen(false)}>
                Apply Now <Icon name="arrow-right" size={15} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
