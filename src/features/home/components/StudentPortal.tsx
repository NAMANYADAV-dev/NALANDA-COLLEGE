import { CardRail, cardRailItem } from '@/components/ui/CardRail';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon, SvgGlyph } from '@/components/ui/Icon';
import { PORTAL_ITEMS } from '@/features/home/data';
import { cn } from '@/lib/utils/cn';

/**
 * StudentPortal — quick links to the affiliated university's exam services.
 * Grid of shortcut cards; each URL comes from the admin site settings (keyed by
 * the item's `key`), falling back to the item's placeholder until one is set.
 */
export function StudentPortal({ links }: { links?: Record<string, string> }) {
  return (
    <Section>
      <SectionHeading
        eyebrow="For current students"
        title="Student portal"
        subtitle={
          <>
            Admit cards, results and exam services on the affiliated university portal.{' '}
            <span className="font-semibold text-gold">↗ Opens the university portal in a new tab.</span>
          </>
        }
      />
      {/* Six shortcut cards stack very tall on a phone — swipe them instead. */}
      <CardRail label="Student portal links" className="mt-9 sm:grid-cols-2 lg:grid-cols-3">
        {PORTAL_ITEMS.map((item) => (
          <a
            key={item.label}
            href={links?.[item.key] || item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              cardRailItem,
              'flex flex-col rounded-[10px] border border-border bg-surface p-6 shadow-card transition-transform duration-150 hover:-translate-y-1 hover:shadow-card-hover',
            )}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-section-alt text-navy dark:text-gold-hi">
              <SvgGlyph d={item.icon} size={24} />
            </div>
            <h3 className="font-head text-[19px] font-semibold text-text">{item.label}</h3>
            <p className="mb-[18px] mt-1.5 text-sm text-muted">{item.desc}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              Open portal <Icon name="arrow-up-right" size={15} />
            </span>
          </a>
        ))}
      </CardRail>
    </Section>
  );
}
