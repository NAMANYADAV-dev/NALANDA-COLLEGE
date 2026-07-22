import { CardRail, cardRailItem } from '@/components/ui/CardRail';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { TESTIMONIALS } from '@/features/home/data';
import { cn } from '@/lib/utils/cn';

/** Testimonials — student quote cards; swipeable on phones, a grid from sm up. */
export function Testimonials() {
  return (
    <Section tone="alt">
      <SectionHeading eyebrow="In their words" title="What our students say" />

      <CardRail label="Student testimonials" className="mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className={cn(cardRailItem, 'rounded-lg bg-surface p-7 shadow-card')}>
            <Icon name="quote" size={30} className="mb-3 text-gold opacity-35" />
            <blockquote className="mb-[18px] text-[15px] leading-relaxed text-text">{t.quote}</blockquote>
            <figcaption className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full font-head font-bold text-white"
                style={{ backgroundColor: t.avatarBg }}
              >
                {t.initials}
              </span>
              <span>
                <span className="block font-head text-[15px] font-semibold text-text">{t.name}</span>
                <span className="block text-[13px] text-muted">{t.meta}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </CardRail>
    </Section>
  );
}
