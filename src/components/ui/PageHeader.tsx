/**
 * PageHeader — the dark navy hero band shown at the top of every inner page
 * (About, Courses, Admissions, Faculty, Notices, Gallery, Contact).
 * Server Component: eyebrow + title + optional subtitle, nothing interactive.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy-deep">
      <div className="container-page py-14">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-hi">{eyebrow}</p>
        <h1 className="mt-3 font-head text-[32px] font-bold text-white sm:text-[40px]">{title}</h1>
        {subtitle && (
          <p className="mt-3.5 max-w-[60ch] text-base leading-relaxed text-[#c6d2e4] sm:text-[17px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
