import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./db/drizzle";
import { userTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { logEvent } from "./lib/logging";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/refund-policy",
  "/community-guidelines",
  "/contact",
  "/help",
  "/about",
  "/campaigns",       // campaigns list
  "/campaigns/:id",
  "/api/(.*)",         // All API routes
  "/api/campaigns",
  "/careers",
  "/success-stories",
  '/blog',
  "/pricing"
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';
  const adminHost = process.env.ADMIN_HOST || 'admin.fundwavesl.org';
  const devAdminHost = process.env.DEV_ADMIN_HOST || 'admin.localhost:3000';
  const isProd = process.env.NODE_ENV === 'production';
  const isAdminHost = host === adminHost || (!isProd && host === devAdminHost);

  // Lightweight API request logging (pre-auth)
  try {
    if (url.pathname.startsWith('/api')) {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
      const ua = req.headers.get('user-agent') || '';
      await logEvent({
        level: 'info',
        category: 'api:request',
        user: 'anonymous',
        details: `${req.method} ${url.pathname}`,
        ipAddress: ip,
        userAgent: ua,
        metaData: { host, search: url.search || '', isAdminHost }
      });
    }
  } catch {}

  // Debug logging (only in development)
  const isAdminPath = url.pathname.startsWith('/admin');
  const isSignInPath = url.pathname.startsWith('/sign-in');

  // If accessing the admin host root, redirect to the admin overview page
  if (isAdminHost && url.pathname === '/') {
    url.pathname = '/admin/overview'
    return NextResponse.redirect(url)
  }

  // On non-admin hosts, skip auth for public and API routes
  if (!isAdminHost && (isPublicRoute(req) || url.pathname.startsWith('/api'))) {
    return NextResponse.next();
  }

  // Prevent accessing /admin routes on non-admin hosts
  if (!isAdminHost && isAdminPath) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    // Authenticate when required:
    // - On admin host only for /admin paths
    // - Otherwise only for protected routes
    const { userId } = await auth();

    // Platform settings enforcement (non-admin host only)
    if (!isAdminHost) {
      try {
        const [settings] = await db
          .select()
          .from(require('./db/schema').platformSettingsTable)
          .limit(1);
        const config: any = settings?.config || {};

        // Maintenance mode: redirect everything (except /maintenance and API) to /maintenance
        if (config.maintenanceMode && !url.pathname.startsWith('/maintenance') && !url.pathname.startsWith('/api')) {
          url.pathname = '/maintenance';
          return NextResponse.redirect(url);
        }

        // Disable new registrations
        if (config.newRegistrations === false && url.pathname.startsWith('/sign-up')) {
          url.pathname = '/sign-in';
          return NextResponse.redirect(url);
        }

        // Disable campaign creation
        if (config.campaignCreation === false && url.pathname.startsWith('/create-campaign')) {
          url.pathname = '/';
          return NextResponse.redirect(url);
        }
      } catch (e) {
        // fail open
      }
    }

    // If on admin host, enforce auth and super-admin allowlist for ALL paths (except sign-in)
    if (isAdminHost && !isSignInPath) {
      if (!userId) {
        const signInUrl = new URL("/sign-in", req.url);
        const compactRedirect = url.pathname + (url.search || "");
        signInUrl.searchParams.set("redirect_url", compactRedirect);
        return NextResponse.redirect(signInUrl);
      }

      const adminClerkId = process.env.ADMIN_CLERK_ID;
      if (adminClerkId && userId !== adminClerkId) {
        // Not the super admin: redirect to main site
        const mainSiteUrl = new URL("/", req.url);
        mainSiteUrl.host = mainSiteUrl.host.replace('admin.', '');
        return NextResponse.redirect(mainSiteUrl);
      }
    } else {
      // Non-admin host: if route is protected and user not logged in, redirect to sign-in
      if (!userId && !isPublicRoute(req) && !url.pathname.startsWith('/api')) {
        const signInUrl = new URL("/sign-in", req.url);
        const compactRedirect = url.pathname + (url.search || "");
        signInUrl.searchParams.set("redirect_url", compactRedirect);
        return NextResponse.redirect(signInUrl);
      }
    }

    // Get user data (only for protected routes on non-admin host)
    let dbUser: any = null;
    if (!isAdminHost && userId) {
      dbUser = (await db
        .select()
        .from(userTable)
        .where(eq(userTable.clerkId, userId))
      )[0];
    }

    // KYC checks (skip on admin host or when not logged in)
    if (!isAdminHost && userId) {
      if (url.pathname.startsWith("/kyc") && dbUser?.isKyc) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      if (url.pathname.startsWith("/create-campaign") && !dbUser?.isKyc) {
        url.pathname = "/kyc";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", url.toString());
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // '/(api|trpc)(.*)',
  ],
}