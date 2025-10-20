import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for CORS headers and API route handling
 *
 * Note: Route protection is handled client-side via Solana Wallet Adapter
 * Protected pages check wallet connection status using useWallet() hook
 *
 * This middleware only handles:
 * - CORS headers for API routes
 * - Security headers
 * - Preflight requests
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log API requests for debugging
  if (pathname.startsWith('/api')) {
    console.log(`[Middleware] API request: ${request.method} ${pathname}`);
  }

  // Create response with CORS and security headers
  const response = NextResponse.next();

  // CORS Headers - restrict to allowed origins in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
  const origin = request.headers.get('origin');

  if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (allowedOrigins.includes('*')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*', // Apply CORS headers to all API routes
  ],
};
