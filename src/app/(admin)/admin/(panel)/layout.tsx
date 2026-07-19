import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getDashboardMetrics, getAdminProfile } from '@/features/admin/queries';
import { requireAdmin } from '@/features/admin/auth/session';

/**
 * Admin panel layout — sidebar + scrollable content area for every
 * authenticated admin page. (The `(panel)` route group carries no URL segment,
 * and `/admin/login` sits outside it so it renders without this chrome.)
 *
 * This layout wraps ALL protected admin routes, so the server-side gate below is
 * the authoritative access check: any unauthenticated request is redirected to
 * /admin/login *before* a single child page renders. Middleware performs the
 * same redirect earlier (at the edge) for speed — together they are defence in
 * depth, and neither relies on database RLS to keep the UI private.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Authoritative server-side auth gate — redirects to /admin/login with no session.
  await requireAdmin();

  // Sidebar badge (new enquiries) + signed-in profile.
  const [metrics, profile] = await Promise.all([getDashboardMetrics(), getAdminProfile()]);

  return (
    <div className="flex min-h-screen bg-[#f4f6fa] dark:bg-bg">
      <AdminSidebar enquiriesNew={metrics.enquiriesNew} profile={profile} />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
