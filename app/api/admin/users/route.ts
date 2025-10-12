import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { eq, desc, ilike, or, count, and, type SQL } from "drizzle-orm";
import { logEvent } from "@/lib/logging";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const kyc = url.searchParams.get("kyc") || ""; // pending|verified|all
    const offset = (page - 1) * limit;

    // Build base query conditions
    let whereCondition: SQL<unknown> | undefined = eq(userTable.isDeleted, false);
    
    const kycFilter = (kyc && kyc !== 'all')
      ? (kyc === 'verified' ? eq(userTable.isKyc, true) : eq(userTable.isKyc, false))
      : undefined;

    if (search && status && status !== "all") {
      whereCondition = and(
        eq(userTable.isDeleted, false),
        or(
          ilike(userTable.name, `%${search}%`),
          ilike(userTable.email, `%${search}%`)
        ),
        eq(userTable.status, status as any),
        kycFilter as any
      );
    } else if (search) {
      whereCondition = and(
        eq(userTable.isDeleted, false),
        or(
          ilike(userTable.name, `%${search}%`),
          ilike(userTable.email, `%${search}%`)
        ),
        kycFilter as any
      );
    } else if (status && status !== "all") {
      whereCondition = and(
        eq(userTable.isDeleted, false),
        eq(userTable.status, status as any),
        kycFilter as any
      );
    } else if (kycFilter) {
      whereCondition = and(
        eq(userTable.isDeleted, false),
        kycFilter as any
      );
    }

    const users = await db
      .select()
      .from(userTable)
      .where(whereCondition)
      .orderBy(desc(userTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(userTable)
      .where(whereCondition);

    return NextResponse.json({
      ok: true,
      data: {
        users: users.map(user => ({
          ...user,
          // Remove sensitive information
          clerkId: undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ua = request.headers.get('user-agent') || '';
    const { userIdToUpdate, status, action, approve } = body as { userIdToUpdate?: string; status?: string; action?: string; approve?: boolean };

    if (!userIdToUpdate) {
      return NextResponse.json(
        { error: "Missing userIdToUpdate" },
        { status: 400 }
      );
    }

    if (action === "kyc") {
      if (typeof approve !== "boolean") {
        return NextResponse.json({ error: "Invalid approve flag" }, { status: 400 });
      }
      const updated = await db
        .update(userTable)
        .set({ isKyc: approve, updatedAt: new Date() })
        .where(eq(userTable.id, userIdToUpdate))
        .returning();
      // Log KYC change
      await logEvent({
        level: "info",
        category: "admin:user:kyc",
        user: userId,
        details: `${approve ? "Approved" : "Revoked"} KYC for user ${userIdToUpdate}`,
        metaData: { targetUserId: userIdToUpdate, approve },
        ipAddress: ip,
        userAgent: ua,
      });
      return NextResponse.json({ ok: true, data: { message: approve ? "KYC approved" : "KYC revoked", user: { ...updated[0], clerkId: undefined } } });
    }

    if (action === "delete") {
      // fetch clerkId first
      const [u] = await db.select({ id: userTable.id, clerkId: userTable.clerkId }).from(userTable).where(eq(userTable.id, userIdToUpdate)).limit(1);
      if (!u) return NextResponse.json({ error: "User not found" }, { status: 404 });

      try {
        if (u.clerkId) {
          const client = await clerkClient();
          await client.users.deleteUser(u.clerkId);
        }
      } catch (err) {
        console.warn("Clerk deleteUser failed, proceeding with soft delete.", err);
      }

      const updated = await db
        .update(userTable)
        .set({ isDeleted: true, status: 'banned' as any, updatedAt: new Date() })
        .where(eq(userTable.id, userIdToUpdate))
        .returning();
      await logEvent({
        level: "warning",
        category: "admin:user:delete",
        user: userId,
        details: `Soft-deleted user ${userIdToUpdate}`,
        metaData: { targetUserId: userIdToUpdate },
        ipAddress: ip,
        userAgent: ua,
      });

      return NextResponse.json({ ok: true, data: { message: "User deleted", user: { ...updated[0], clerkId: undefined } } });
    }

    // default: status update
    if (!status || !["active", "suspended", "banned"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedUser = await db
      .update(userTable)
      .set({ 
        status: status as any,
        updatedAt: new Date()
      })
      .where(eq(userTable.id, userIdToUpdate))
      .returning();

    if (!updatedUser.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Optional: Try to signal suspend/ban in Clerk as well
    try {
      const [u] = await db.select({ clerkId: userTable.clerkId }).from(userTable).where(eq(userTable.id, userIdToUpdate)).limit(1);
      if (u?.clerkId) {
        // Note: Depending on Clerk SDK version, you might have specific methods to block/suspend a user.
        // This is a placeholder no-op to avoid breaking if not available.
        // await clerkClient.users.updateUser(u.clerkId, { banned: status === 'banned' });
      }
    } catch (e) {
      console.warn("Clerk update (suspend/ban) not applied:", e);
    }

    await logEvent({
      level: "info",
      category: "admin:user:status",
      user: userId,
      details: `Changed user ${userIdToUpdate} status to ${status}`,
      metaData: { targetUserId: userIdToUpdate, status },
      ipAddress: ip,
      userAgent: ua,
    });
    return NextResponse.json({
      ok: true,
      data: {
        message: `User status updated to ${status}`,
        user: {
          ...updatedUser[0],
          clerkId: undefined, // Remove sensitive info
        },
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
