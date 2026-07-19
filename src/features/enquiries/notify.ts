import 'server-only';
import { sendMail } from '@/lib/email/mailer';
import { siteConfig } from '@/config/site';
import type { EnquiryInput } from './schema';

/**
 * notifyNewEnquiry — email the admin when a new lead comes in, so they don't
 * have to watch the dashboard. Sends to ADMIN_NOTIFY_EMAIL (falls back to the
 * SMTP user). Best-effort: any failure is swallowed so it never affects the
 * enquiry that was just saved. `replyTo` is set to the enquirer so the admin can
 * reply straight from their inbox.
 */
export async function notifyNewEnquiry(e: EnquiryInput): Promise<void> {
  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER;
  if (!to) return;

  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 12px;color:#64748b;font-weight:600;">${label}</td><td style="padding:6px 12px;color:#0f172a;">${escapeHtml(value)}</td></tr>`
      : '';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#12294D;">New enquiry — ${siteConfig.name}</h2>
      <table style="border-collapse:collapse;width:100%;background:#f8fafc;border-radius:8px;">
        ${row('Name', e.name)}
        ${row('Email', e.email)}
        ${row('Phone', e.phone ?? '')}
        ${row('Interested in', e.subject ?? '')}
        ${row('Message', e.message)}
      </table>
      <p style="color:#94a3b8;font-size:13px;margin-top:16px;">
        Sent automatically from the ${siteConfig.name} website. Reply to this email to respond directly.
      </p>
    </div>`;

  await sendMail({
    to,
    subject: `New enquiry from ${e.name}`,
    html,
    replyTo: e.email,
  });
}

/** Minimal HTML-escaping so enquiry text can't inject markup into the email. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
