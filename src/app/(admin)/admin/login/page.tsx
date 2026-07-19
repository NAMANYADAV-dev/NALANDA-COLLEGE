import type { Metadata } from 'next';
import { AuthShell } from '@/components/admin/AuthShell';
import { LoginForm } from '@/features/admin/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Sign in',
  robots: { index: false, follow: false },
};

/**
 * Admin login — the brand panel + sign-in form. Sits outside the (panel) group
 * so it renders without the sidebar chrome. Middleware bounces already-signed-in
 * admins to the dashboard before this page shows.
 */
export default function AdminLoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
