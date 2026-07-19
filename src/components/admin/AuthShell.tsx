import type { ReactNode } from 'react';

/**
 * AuthShell — shared split layout for the admin auth screens (login, forgot
 * password, reset password): a navy brand panel on the left (hidden on small
 * screens) and the given form on the right. Keeps the three screens visually
 * consistent without duplicating the brand markup.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-section-alt lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-deep p-14 text-white lg:flex">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(184,134,43,.28),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(184,134,43,.16),transparent_70%)]" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-gold font-head text-[22px] font-bold text-navy-deep">
            N
          </span>
          <span className="font-head text-[19px] font-bold leading-tight">
            Nalanda College
            <span className="block font-body text-xs font-normal text-[#9fb0c9]">Admin Console</span>
          </span>
        </div>

        <div className="relative">
          <span className="inline-block rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-hi">
            Staff Access Only
          </span>
          <h1 className="mt-5 font-head text-[40px] font-bold leading-[1.15]">
            Manage your college,
            <br />
            all in one place.
          </h1>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-[#c6d2e4]">
            Enquiries, notices, courses, faculty and downloads — everything that powers the public
            website, controlled from here.
          </p>
        </div>

        <div className="relative text-[13px] text-[#8fa0bd]">
          © {new Date().getFullYear()} Nalanda College · Secured by Supabase Auth
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-8">{children}</div>
    </div>
  );
}
