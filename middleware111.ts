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
  "/sign-in",
  "/sign-up",
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
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  // Skip auth checks for public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  try {
    // Authenticate the user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Get user data
    const dbUser = (await db
      .select()
      .from(userTable)
      .where(eq(userTable.clerkId, userId))
    )[0];

    
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
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/(.*),"
  ],
};
