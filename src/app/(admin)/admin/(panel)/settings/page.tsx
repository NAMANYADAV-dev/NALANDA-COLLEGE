import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Icon } from '@/components/ui/Icon';
import { getAdminProfile } from '@/features/admin/queries';
import { signOut } from '@/features/admin/auth/actions';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getSettingsMap } from '@/features/settings/queries';
import { SettingsForm } from '@/features/settings/components/SettingsForm';

export const metadata: Metadata = { title: 'Settings · Admin' };

/**
 * Admin settings — the signed-in account + Supabase connection status, plus the
 * editable site-wide settings form (admission dates, contact, social links and
 * student-portal URLs). Saving updates the database and revalidates the whole
 * public site, so these values change everywhere they're shown.
 */
export default async function AdminSettingsPage() {
  const [profile, settings] = await Promise.all([getAdminProfile(), getSettingsMap()]);
  const connected = isSupabaseConfigured();

  return (
    <>
      <AdminHeader title="Settings" subtitle="Account, connection and site-wide content" />

      <div className="p-7">
        <div className="mb-6 grid max-w-3xl gap-6 sm:grid-cols-2">
          {/* Account */}
          <Card title="Your account" icon="users">
            <Row label="Email" value={profile.email} />
            <Row label="Role" value="Administrator" />
            <form action={signOut} className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-[#b91c1c] hover:bg-[rgba(214,69,69,.06)]"
              >
                <Icon name="log-out" size={15} /> Sign out
              </button>
            </form>
          </Card>

          {/* Connection status */}
          <Card title="Supabase connection" icon="layers">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-[#1b6e3d]' : 'bg-[#D6A545]'}`} />
              <span className="text-sm font-semibold text-text">
                {connected ? 'Connected' : 'Not configured'}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {connected
                ? 'Environment keys are set. The public site reads live data from your database.'
                : 'Add your Supabase keys to .env.local and restart. Until then the public site shows sample content.'}
            </p>
          </Card>
        </div>

        {/* Editable site-wide settings */}
        <h2 className="mb-1 font-head text-lg font-semibold text-text">Site content</h2>
        <p className="mb-5 max-w-3xl text-sm text-muted">
          These values appear across the public site — the home page dates bar, footer, contact page
          and student-portal shortcuts. Changes go live everywhere as soon as you save.
        </p>
        <SettingsForm values={settings} />
      </div>
    </>
  );
}

/** A titled settings panel. */
function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: 'users' | 'layers';
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-section-alt text-navy dark:text-gold-hi">
          <Icon name={icon} size={18} />
        </span>
        <h2 className="font-head text-[15px] font-semibold text-text">{title}</h2>
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

/** A label / value line inside a settings card. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="text-right font-medium text-text">{value}</span>
    </div>
  );
}
