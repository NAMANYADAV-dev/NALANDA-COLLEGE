'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { adminNav } from '@/config/admin';
import { SvgGlyph, Icon } from '@/components/ui/Icon';
import { signOut } from '@/features/admin/auth/actions';
import type { AdminProfile } from '@/features/admin/queries';

/**
 * AdminSidebar — fixed dark navigation rail for the admin console.
 *
 * Client Component so it can highlight the active route (usePathname). The new
 * enquiries count and the signed-in profile are computed on the server and
 * passed in as props; sign-out posts to the `signOut` Server Action.
 */
export function AdminSidebar({
  enquiriesNew,
  profile,
}: {
  enquiriesNew: number;
  profile: AdminProfile;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[248px] flex-none flex-col gap-1.5 bg-navy-deep p-4 text-[#c6d2e4]">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2.5 pb-5 pt-1.5">
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-gold font-head text-lg font-bold text-navy-deep">
          N
        </span>
        <span className="font-head text-base font-bold leading-tight text-white">
          Nalanda
          <span className="block font-body text-[11px] font-normal text-[#8fa0bd]">Admin Console</span>
        </span>
      </div>

      <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5f728e]">
        Main
      </div>

      <nav className="flex flex-col gap-1">
        {adminNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const badge = item.badgeKey === 'enquiriesNew' ? enquiriesNew : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-[9px] px-3 py-[11px] text-sm transition-colors',
                active
                  ? 'bg-gold/[0.16] font-semibold text-white'
                  : 'font-medium text-[#c6d2e4] hover:bg-white/[0.06] hover:text-white',
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                <SvgGlyph d={item.icon} size={18} />
              </span>
              {item.label}
              {badge > 0 && (
                <span className="ml-auto rounded-full bg-gold px-[7px] py-px text-[11px] font-bold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile + sign out */}
      <div className="mt-auto flex items-center gap-2.5 border-t border-white/[0.08] px-3 pb-1 pt-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-navy font-head text-sm font-bold text-white">
          {profile.initials}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[13.5px] font-semibold text-white">{profile.email}</span>
          <span className="block text-[11.5px] text-[#8fa0bd]">Administrator</span>
        </span>
        <form action={signOut} className="ml-auto flex">
          <button type="submit" title="Log out" className="text-[#8fa0bd] transition-colors hover:text-gold">
            <Icon name="log-out" size={18} />
          </button>
        </form>
      </div>
    </aside>
  );
}
