import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and authentication
 *
 * This middleware provides server-side protection for authenticated routes
 * by checking for Privy authentication tokens in cookies/headers.
 *
 * Protected Routes:
 * - /dashboard/* - Requires authentication (merchant routes)
 * - /merchant/* - Requires authentication (merchant routes)
 * - /coupons - Requires authentication (user's coupon page)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Privy authentication token in cookies
  const privyToken = request.cookies.get('privy-token')?.value ||
                     request.cookies.get('privy-id-token')?.value ||
                     request.cookies.get('privy-refresh-token')?.value;

  // Check for authentication header (Bearer token)
  const authHeader = request.headers.get('authorization');
  const hasAuthToken = authHeader?.startsWith('Bearer ');

  // Check if user has any authentication credentials
  const isAuthenticated = !!privyToken || hasAuthToken;

  // Protect merchant routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/merchant')) {
    if (!isAuthenticated) {
      // Redirect to home page with error message
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'auth_required');
      url.searchParams.set('redirect', pathname);

      console.warn(`[Middleware] Unauthorized access attempt to ${pathname}`);
      return NextResponse.redirect(url);
    }
  }

  // Protect user coupon routes
  if (pathname.startsWith('/coupons')) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/marketplace';
      url.searchParams.set('error', 'auth_required');
      url.searchParams.set('message', 'Please sign in to view your coupons');

      console.warn(`[Middleware] Unauthorized access attempt to ${pathname}`);
      return NextResponse.redirect(url);
    }
  }

  // Log successful authentication for protected routes
  if (isAuthenticated && (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/merchant') ||
    pathname.startsWith('/coupons')
  )) {
    console.log(`[Middleware] Authenticated access to ${pathname}`);
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/merchant/:path*',
    '/coupons/:path*',
  ],
};
