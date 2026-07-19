import { Section, SectionHeading } from '@/components/ui/Section';
import { PLACEMENT_STATS } from '@/features/home/data';

/** Placements — headline placement stats plus a row of recruiter logo slots. */
export function Placements() {
  return (
    <Section>
      <SectionHeading eyebrow="Careers" title="Placements & recruiters" />

      <div className="mb-9 mt-9 grid gap-6 sm:grid-cols-3">
        {PLACEMENT_STATS.map((s) => (
          <div key={s.label} className="rounded-lg bg-section-alt p-7 text-center">
            <div className="font-head text-4xl font-bold text-heading">{s.value}</div>
            <div className="mt-1 text-[15px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recruiter logo placeholders — replace with uploaded logos later. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex h-16 items-center justify-center rounded-lg border border-border bg-surface font-head text-sm font-semibold text-[#9aa6b5]"
          >
            Logo
          </div>
        ))}
      </div>
    </Section>
  );
}
