import type { Metadata } from 'next';
import { AuthShell } from '@/components/admin/AuthShell';
import { ForgotPasswordForm } from '@/features/admin/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password · Admin',
  robots: { index: false, follow: false },
};

/** Request a password-reset link. Public (reachable without a session). */
export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
