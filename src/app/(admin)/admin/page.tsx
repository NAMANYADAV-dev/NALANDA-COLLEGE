import { redirect } from 'next/navigation';

/** /admin → send straight to the dashboard (auth is enforced by middleware). */
export default function AdminIndexPage() {
  redirect('/admin/dashboard');
}
