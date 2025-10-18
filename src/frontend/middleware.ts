import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and role-based access control
 *
 * DISABLED FOR NOW: Using client-side wallet authentication instead of server-side cookies
 *
 * Each protected page (dashboard, etc.) handles its own authentication check
 * by verifying wallet connection status using Solana Wallet Adapter.
 *
 * TODO: Re-enable when implementing proper server-side auth with Privy/Dynamic
 *
 * Protected Routes:
 * - /dashboard/* - Requires merchant role (checked in component)
 * - /merchant/* - Requires merchant role (checked in component)
 * - /my-coupons - Requires user authentication (checked in component)
 */
export async function middleware(  _request: NextRequest) {
  // Middleware disabled - authentication handled client-side
  // All routes pass through without server-side checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/merchant/:path*',
    '/my-coupons/:path*',
  ],
};
