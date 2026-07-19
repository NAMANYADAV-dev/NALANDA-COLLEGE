'use client';

import { useState } from 'react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { FAQS } from '@/features/home/data';

/**
 * Faq — single-open accordion.
 *
 * Client Component (holds the "which item is expanded" state). Content is
 * static config; behaviour is an accessible disclosure pattern.
 */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section tone="alt">
      <div className="mx-auto max-w-[820px]">
        <SectionHeading eyebrow="Good to know" title="Frequently asked questions" className="mb-9" />

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.q} className="overflow-hidden rounded-lg border border-border bg-surface">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-head text-base font-semibold text-text"
                >
                  {faq.q}
                  <Icon
                    name="chevron-down"
                    size={20}
                    className={cn('flex-none text-muted transition-transform', open && 'rotate-180')}
                  />
                </button>
                {open && (
                  <div className="animate-fade-in px-6 pb-[18px] text-sm leading-relaxed text-muted">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
