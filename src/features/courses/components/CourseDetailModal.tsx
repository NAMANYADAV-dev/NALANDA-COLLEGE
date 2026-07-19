'use client';

import { useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import type { Course } from '@/types/database.types';

/**
 * CourseDetailModal — shared course detail dialog.
 *
 * Used by BOTH the home page "Academic streams" section and the /courses
 * catalogue, so a card opens the exact same rich view everywhere (facts,
 * subjects, eligibility, career paths, apply CTA). Owns its own Escape-to-close
 * and background scroll lock; the parent just toggles which course is open.
 */
export function CourseDetailModal({ course, onClose }: { course: Course; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const facts = [
    { label: 'Duration', value: course.duration },
    { label: 'Seats', value: String(course.seats) },
    { label: 'Annual fee', value: course.fee },
  ];

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={course.name}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(11,20,38,.6)] p-4 backdrop-blur-[3px] sm:p-8"
    >
      {/* stopPropagation keeps clicks inside the panel from closing it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-[640px] max-w-full animate-fade-in overflow-y-auto rounded-2xl bg-surface shadow-[0_30px_80px_rgba(0,0,0,.4)]"
      >
        <div className="relative rounded-t-2xl bg-navy-deep px-6 py-8 sm:px-9">
          <button
            onClick={onClose}
            title="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.12] text-white hover:bg-white/25"
          >
            <Icon name="close" size={18} />
          </button>
          <span className="inline-block rounded-full border border-gold/40 bg-gold/[0.18] px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-gold-hi">
            {course.level} · {course.duration}
          </span>
          <h3 className="mb-1.5 mt-3.5 font-head text-[28px] font-bold text-white">{course.name}</h3>
          <p className="text-[15px] leading-relaxed text-[#c6d2e4]">{course.about}</p>
        </div>

        <div className="px-6 pb-8 pt-7 sm:px-9">
          <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-lg bg-section-alt px-4 py-3.5">
                <div className="mb-1 text-xs text-muted">{f.label}</div>
                <div className="font-head text-base font-semibold text-navy dark:text-gold-hi">{f.value}</div>
              </div>
            ))}
          </div>

          <ModalSubhead>Core subjects</ModalSubhead>
          <div className="mb-6 flex flex-wrap gap-2">
            {course.subjects.map((s) => (
              <span key={s} className="rounded-full bg-section-alt px-3 py-1.5 text-[13px] font-medium text-navy dark:text-gold-hi">
                {s}
              </span>
            ))}
          </div>

          <ModalSubhead>Eligibility</ModalSubhead>
          <p className="mb-6 text-sm leading-relaxed text-muted">{course.eligibility}</p>

          <ModalSubhead>Career paths</ModalSubhead>
          <div className="mb-7 flex flex-wrap gap-2">
            {course.careers.map((c) => (
              <span key={c} className="rounded-full bg-faint-gold px-3 py-1.5 text-[13px] font-medium text-gold">
                {c}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <Button href="/admissions" className="flex-1 shadow-none">
              Apply for this programme
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalSubhead({ children }: { children: React.ReactNode }) {
  return <div className="mb-2.5 font-head text-[15px] font-semibold text-text">{children}</div>;
}
