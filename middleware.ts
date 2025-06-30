import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;
  const response = NextResponse.next();

  // Define route categories
  const authRoutes = ['/login', '/signup'];
  const adminRoutes = ["/admin"];
  const userRoutes = ["/dashboard", "/create-campaign"];
  const profileRoute = "/profile";
  const kycRoute = "/kyc";
  const publicRoutes = ['/', '/about', '/contact'];

  // 1. Handle public routes - allow immediate access
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  // 2. Handle auth routes for authenticated users
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // 3. Handle unauthenticated access to protected routes
  if (!token && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. If we have a token, verify it
  if (token) {
    try {
      const decoded = jwtDecode(token) as { id: string, roles: string, isKyc: boolean };
      const { roles, isKyc } = decoded;

      // KYC handling for create-campaign route
      if (pathname === "/create-campaign" && !isKyc) {
        return NextResponse.redirect(new URL("/kyc", req.url));
      }

      // KYC page access
      if (pathname === kycRoute) {
        return isKyc 
          ? NextResponse.redirect(new URL("/dashboard", req.url))
          : response;
      }

      // Profile route (accessible by both roles)
      if (pathname === profileRoute) {
        return response;
      }

      // Admin routes
      if (pathname.startsWith('/admin')) {
        return roles === "admin"
          ? response
          : NextResponse.redirect(new URL("/login", req.url));
      }

      // User routes
      if (userRoutes.some(route => pathname.startsWith(route))) {
        return roles === "user"
          ? response
          : NextResponse.redirect(new URL("/login", req.url));
      }

    } catch (error) {
      console.error("JWT Error:", error);
      const redirect = NextResponse.redirect(new URL("/login", req.url));
      redirect.cookies.delete("accessToken");
      return redirect;
    }
  }

  // Default allow if authenticated but no specific rules apply
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile',
    '/create-campaign',
    '/dashboard',
    '/dashboard/:path*',
    '/kyc',
    '/login',
    '/signup'
  ],
};