'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import type { Course } from '@/types/database.types';

/**
 * CoursesMenu — the desktop "Courses" mega-menu.
 *
 * Lists every current programme (fetched on the server and passed in as a
 * prop, so it always reflects the live catalogue), grouped into Undergraduate
 * and Postgraduate columns. Each entry deep-links to that course on the Courses
 * page. Opens on hover (grace-delay + hover bridge), with click/Escape support;
 * the label itself still navigates to /courses. Desktop-only.
 */
export function CoursesMenu({ courses, active }: { courses: Course[]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { ug, pg } = useMemo(
    () => ({
      ug: courses.filter((c) => c.level === 'UG'),
      pg: courses.filter((c) => c.level === 'PG'),
    }),
    [courses],
  );

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

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
      {/* The label still navigates to /courses on click; hover opens the panel. */}
      <Link
        href="/courses"
        onClick={() => setOpen(false)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-1.5 py-1.5 transition-colors hover:text-gold',
          active
            ? 'border-b-2 border-gold font-semibold text-navy dark:text-gold-hi'
            : open
              ? 'text-gold'
              : 'text-text',
        )}
      >
        Courses
        <Icon name="chevron-down" size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </Link>

      {open && (
        <div className="absolute left-0 top-full z-30 pt-3">
          <div className="w-[560px] animate-fade-in rounded-xl border border-border bg-surface p-4 shadow-[0_16px_44px_rgba(0,0,0,.16)]">
            <div className="grid grid-cols-2 gap-x-4">
              <CourseColumn label="Undergraduate" courses={ug} onNavigate={() => setOpen(false)} />
              <CourseColumn label="Postgraduate" courses={pg} onNavigate={() => setOpen(false)} />
            </div>

            <div className="mt-3 border-t border-border pt-3">
              <Link
                href="/courses"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 px-2 text-[13px] font-semibold text-navy hover:text-gold dark:text-gold-hi"
              >
                View all courses <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** One level group (UG / PG) inside the menu. */
function CourseColumn({
  label,
  courses,
  onNavigate,
}: {
  label: string;
  courses: Course[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      {courses.length === 0 ? (
        <p className="px-2 py-2 text-[13px] text-muted">Coming soon</p>
      ) : (
        courses.map((c) => (
          <Link
            key={c.id}
            href={`/courses/${c.slug}`}
            onClick={onNavigate}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-section-alt"
          >
            <span className="font-head text-[14px] font-semibold text-text">{c.name}</span>
            <span className="flex-none text-[12px] text-muted">{c.duration}</span>
          </Link>
        ))
      )}
    </div>
  );
}
