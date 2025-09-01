import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./db/drizzle";
import { userTable } from "./db/schema";
import { eq } from "drizzle-orm";

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
  "success-stories",
  '/blog',
  '/press'
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  // Skip auth checks for public routes and API routes
  if (isPublicRoute(req) || url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  try {
    // Authenticate the user
    const { userId } = await auth();
    
    if (!userId) {
      // Redirect to sign-in with return URL
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", url.toString());
      return NextResponse.redirect(signInUrl);
    }

    // Get user data (only for protected routes)
    const dbUser = (await db
      .select()
      .from(userTable)
      .where(eq(userTable.clerkId, userId))
    )[0];

    // KYC checks
    if (url.pathname.startsWith("/kyc") && dbUser?.isKyc) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/create-campaign") && !dbUser?.isKyc) {
      url.pathname = "/kyc";
      return NextResponse.redirect(url);
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