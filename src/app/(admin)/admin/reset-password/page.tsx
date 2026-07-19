import type { Metadata } from 'next';
import { AuthShell } from '@/components/admin/AuthShell';
import { ResetPasswordForm } from '@/features/admin/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Set new password · Admin',
  robots: { index: false, follow: false },
};

/**
 * Set a new password. Reached from the emailed recovery link after
 * /auth/callback establishes the recovery session. `?error=link` signals the
 * callback found the code invalid/expired.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell>
      <ResetPasswordForm linkError={error === 'link'} />
    </AuthShell>
  );
}
