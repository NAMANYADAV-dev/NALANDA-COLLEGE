import type { Metadata } from 'next';
import { AuthShell } from '@/components/admin/AuthShell';
import { getAuthenticatedUser } from '@/features/admin/auth/session';
import { signOut } from '@/features/admin/auth/actions';

export const metadata: Metadata = {
  title: 'No admin access',
  robots: { index: false, follow: false },
};

/**
 * /admin/no-access — shown when someone is signed in but is NOT on the admins
 * allow-list (see supabase/migrations/0002_admin_roles.sql).
 *
 * It deliberately sits outside the (panel) group and is listed in the
 * middleware's PUBLIC_ADMIN_ROUTES: requireAdmin() redirects here, and
 * middleware sends any signed-in visitor away from /admin/login, so routing a
 * non-admin to the login page instead would loop forever.
 *
 * The same screen covers the honest setup mistake — migration 0002 run but
 * nobody seeded into `admins` yet — which is why the fix is spelled out.
 */
export default async function NoAccessPage() {
  const user = await getAuthenticatedUser();

  return (
    <AuthShell>
      <div className="w-full max-w-[420px]">
        <span className="inline-block rounded-full border border-border bg-chip-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Access denied
        </span>

        <h1 className="mt-4 font-head text-[28px] font-bold leading-tight text-heading">
          This account isn&apos;t an admin
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          You&apos;re signed in
          {user?.email ? (
            <>
              {' '}
              as <span className="font-semibold text-text">{user.email}</span>
            </>
          ) : null}
          , but this account isn&apos;t on the admin allow-list, so the portal stays locked.
        </p>

        <div className="mt-6 rounded-[10px] border border-border bg-section-alt p-4 text-[13px] leading-relaxed text-muted">
          <p className="font-semibold text-text">Setting the site up?</p>
          <p className="mt-1">
            Run <code className="font-mono text-[12px]">supabase/migrations/0002_admin_roles.sql</code>{' '}
            in the Supabase SQL Editor, then add this account to the{' '}
            <code className="font-mono text-[12px]">admins</code> table using the seed snippet at the
            bottom of that file.
          </p>
          <p className="mt-2">Otherwise, ask an existing admin to grant you access.</p>
        </div>

        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-[9px] bg-navy px-5 font-head text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
          >
            Sign out
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
