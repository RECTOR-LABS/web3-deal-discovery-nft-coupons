import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and role-based access control
 *
 * Protected Routes:
 * - /dashboard/* - Requires merchant role
 * - /merchant/* - Requires merchant role
 * - /my-coupons - Requires user authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing merchant-protected routes
  const isMerchantRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/merchant');

  if (isMerchantRoute) {
    // Get wallet address from cookie/session (will implement with auth)
    // For now, let wallet connection handle access
    // TODO: Add proper session/auth check when Privy/Dynamic is integrated

    // Placeholder: Check if user has merchant role
    // This will be replaced with proper authentication
    const walletAddress = request.cookies.get('wallet_address')?.value;

    if (!walletAddress) {
      // Redirect to home if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('auth_required', 'merchant');
      return NextResponse.redirect(url);
    }

    // TODO: Query database to check if user has merchant role
    // For MVP, we'll check this in the components directly
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/merchant/:path*',
    '/my-coupons/:path*',
  ],
};
