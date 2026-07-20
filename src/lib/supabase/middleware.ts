import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';

/** Admin area prefix — everything under here requires an authenticated session. */
const ADMIN_PREFIX = '/admin';
const ADMIN_LOGIN = '/admin/login';

/**
 * Admin routes reachable WITHOUT a full admin session: login, the password-reset
 * screens (reset-password runs on a temporary recovery session established by
 * the /auth/callback exchange, so it must not be bounced to login), and
 * /admin/no-access — where requireAdmin() sends a signed-in user who is not on
 * the admins allow-list. That page must stay reachable with a valid session or
 * the redirect would loop.
 */
const PUBLIC_ADMIN_ROUTES = new Set([
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
  '/admin/no-access',
]);

/**
 * updateSession — keep the Supabase auth cookie fresh and guard admin routes.
 *
 * Runs in Edge middleware on every matched request. It:
 *  1. Rehydrates the session and re-issues refreshed auth cookies onto the
 *     response (so Server Components downstream see a valid session).
 *  2. Redirects unauthenticated users away from /admin/** to the login page,
 *     and bounces authenticated users off the login page into the dashboard.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() (not getSession()) revalidates the token with Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.has(pathname);

  // Guard the protected admin area.
  if (isAdminRoute && !isPublicAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in → skip the login page.
  if (pathname === ADMIN_LOGIN && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}
