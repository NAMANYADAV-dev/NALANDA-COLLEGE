import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getDashboardMetrics, getAdminProfile } from '@/features/admin/queries';
import { getRecentEnquiries } from '@/features/enquiries/queries';
import { StatusActions } from '@/features/enquiries/components/StatusActions';

export const metadata: Metadata = { title: 'Dashboard · Admin' };

/** Avatar colour pool for enquiry initials. */
const AVATAR_COLORS = ['#1B3A6B', '#1b6e3d', '#8f6519', '#7A4F9E', '#a8431f'];
const initialsOf = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/** Admin dashboard — headline counts + the latest leads to action. */
export default async function DashboardPage() {
  const [metrics, profile, recent] = await Promise.all([
    getDashboardMetrics(),
    getAdminProfile(),
    getRecentEnquiries(5),
  ]);

  const cards: { label: string; value: number; icon: IconName; accent?: string }[] = [
    { label: 'New enquiries', value: metrics.enquiriesNew, icon: 'mail', accent: 'Today' },
    { label: 'Active courses', value: metrics.courses, icon: 'cap' },
    { label: 'Faculty members', value: metrics.faculty, icon: 'users' },
    { label: 'Notices published', value: metrics.notices, icon: 'calendar' },
  ];

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle={`Welcome back, ${profile.email} · ${today}`}
        actions={
          <Link
            href="/admin/notices"
            className="flex h-10 items-center gap-1.5 rounded-[9px] bg-gold px-4 font-head text-sm font-semibold text-white hover:bg-gold-hover"
          >
            <Icon name="plus" size={16} /> New notice
          </Link>
        }
      />

      <div className="flex flex-col gap-5 p-7">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-section-alt text-navy dark:text-gold-hi">
                  <Icon name={c.icon} size={21} />
                </span>
                {c.accent && (
                  <span className="rounded-full bg-faint-gold px-2 py-0.5 text-xs font-semibold text-gold">
                    {c.accent}
                  </span>
                )}
              </div>
              <div className="mt-4 font-head text-3xl font-bold text-navy dark:text-gold-hi">{c.value}</div>
              <div className="text-[13.5px] text-muted">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Recent enquiries */}
        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="font-head text-base font-semibold text-text">Recent enquiries</h2>
              <p className="mt-0.5 text-[12.5px] text-muted">New leads awaiting a call back</p>
            </div>
            <Link href="/admin/enquiries" className="text-[13.5px] font-semibold text-gold">
              View all →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <Icon name="mail" size={34} className="mx-auto mb-3 text-muted" />
              <p className="font-head font-semibold text-text">No enquiries yet</p>
              <p className="mt-1 text-sm text-muted">
                Leads from the Contact &amp; Admissions forms will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recent.map((e, i) => (
                <div key={e.id} className="flex items-center gap-4 px-6 py-3.5">
                  <span
                    className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full font-head text-[12.5px] font-bold text-white"
                    style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {initialsOf(e.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-text">{e.name}</div>
                    <div className="truncate text-[12.5px] text-muted">
                      {e.subject ?? e.email}
                    </div>
                  </div>
                  <div className="hidden text-[13px] text-muted sm:block">
                    {new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </div>
                  <StatusActions id={e.id} status={e.status} compact />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
