import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { admissionDates } from '@/config/site';

/**
 * DatesBar — navy strip highlighting the current admission-cycle dates.
 * Dates come from the admin site settings; falls back to the config defaults.
 */
export function DatesBar({
  dates,
}: {
  dates?: { applicationsClose: string; entranceTest: string; sessionBegins: string };
}) {
  const d = dates ?? admissionDates;
  const items = [
    { label: 'Applications close', value: d.applicationsClose },
    { label: 'Entrance test', value: d.entranceTest },
    { label: 'Session begins', value: d.sessionBegins },
  ];

  return (
    <section className="bg-navy px-5 py-[22px] sm:px-6 lg:px-10 dark:bg-navy-deep">
      <div className="mx-auto flex max-w-content flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
          <div className="flex items-center gap-2.5">
            <Icon name="calendar" size={20} className="flex-none text-gold-hi" />
            <span className="font-head text-[15px] font-semibold text-white">Admissions 2026–27 open</span>
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
            {items.map((it) => (
              <div key={it.label} className="text-[13px] text-[#c6d2e4]">
                {it.label} <strong className="text-gold-hi">{it.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <Button href="/admissions" size="md" className="w-full justify-center shadow-none sm:w-auto">
          Apply Now <Icon name="arrow-right" size={15} />
        </Button>
      </div>
    </section>
  );
}
