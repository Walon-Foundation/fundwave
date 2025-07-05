// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './lib/jwt';

const PUBLIC_ROUTES = ['/login', '/signup'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Extract and verify the token for protected routes
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.log('Middleware: No token found, redirecting to login.');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const decoded = await verifyJwt(token);

  if (!decoded) {
    console.log('Middleware: Invalid token, redirecting to login.');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { role, isKyc } = decoded;

  // Role-based authorization
  if (pathname.startsWith('/admin') && role !== 'admin') {
    console.log(`Middleware: Unauthorized access to /admin by role: ${role}. Redirecting.`);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // KYC-based authorization
  if (pathname.startsWith('/create-campaign') && !isKyc) {
    console.log('Middleware: User without KYC attempting to create campaign. Redirecting.');
    return NextResponse.redirect(new URL('/kyc', req.url));
  }

  if (pathname === '/kyc' && isKyc) {
    console.log('Middleware: KYC-verified user attempting to access /kyc. Redirecting.');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', decoded.id);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/create-campaign',
    '/login',
    '/signup',
    '/kyc',
  ],
}
