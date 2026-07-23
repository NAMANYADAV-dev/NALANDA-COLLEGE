import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * SMTP mailer — provider-agnostic (Gmail today, Resend/any SMTP later; only the
 * env vars change, not this code).
 *
 * Everything is optional: if SMTP isn't configured the send is skipped and
 * logged, never thrown — so email is a best-effort side-effect that can't break
 * the flow that triggered it (e.g. saving an enquiry).
 *
 * Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (optional).
 */

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

// Reuse one transport across requests, with a real connection pool underneath.
let transporter: Transporter | null = null;
function getTransport(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // Pool persistent SMTP connections instead of opening one per email. Under
      // a burst (e.g. an admission-day rush of enquiries) this reuses a few open
      // sockets rather than doing a TLS handshake every time.
      pool: true,
      maxConnections: 3, // keep well under a typical provider's per-account cap
      maxMessages: 100, // recycle a connection after N sends (avoids staleness)
      // Cap outgoing rate so a burst doesn't trip provider throttling: at most
      // 5 messages per 1s window. Nodemailer queues the rest and drains steadily.
      rateDelta: 1000,
      rateLimit: 5,
    });
  }
  return transporter;
}

/** Send an email. Returns true on success, false if skipped/failed (never throws). */
export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — skipping:', opts.subject);
    return false;
  }
  try {
    await getTransport().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return true;
  } catch (err) {
    console.error('[email] send failed:', (err as Error).message);
    return false;
  }
}
