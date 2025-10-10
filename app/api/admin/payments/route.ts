import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { paymentTable, withdrawalTable } from "@/db/schema";
import { and, desc, eq, ilike, or, count, type SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const type = (url.searchParams.get("type") || "donations") as "donations" | "cashouts";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "all";
    const offset = (page - 1) * limit;

    if (type === "donations") {
      let whereCondition: SQL<unknown> | undefined;

      if (search && status !== "all") {
        whereCondition = and(
          or(
            ilike(paymentTable.username, `%${search}%`),
            ilike(paymentTable.email as any, `%${search}%`),
            ilike(paymentTable.campaignId as any, `%${search}%`)
          ),
          status === "completed"
            ? eq(paymentTable.isCompleted, true)
            : status === "incomplete"
            ? eq(paymentTable.isCompleted, false)
            : status === "blocked"
            ? eq(paymentTable.isBlocked, true)
            : undefined as any
        );
      } else if (search) {
        whereCondition = or(
          ilike(paymentTable.username, `%${search}%`),
          ilike(paymentTable.email as any, `%${search}%`),
          ilike(paymentTable.campaignId as any, `%${search}%`)
        );
      } else if (status !== "all") {
        whereCondition =
          status === "completed"
            ? eq(paymentTable.isCompleted, true)
            : status === "incomplete"
            ? eq(paymentTable.isCompleted, false)
            : status === "blocked"
            ? eq(paymentTable.isBlocked, true)
            : undefined;
      }

      const items = await db
        .select()
        .from(paymentTable)
        .where(whereCondition)
        .orderBy(desc(paymentTable.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count: total }] = await db
        .select({ count: count() })
        .from(paymentTable)
        .where(whereCondition);

      return NextResponse.json({
        ok: true,
        data: {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil((total as number) / limit),
          },
        },
      });
    } else {
      // cashouts (withdrawals)
      let whereCondition: SQL<unknown> | undefined;
      if (search && status !== "all") {
        whereCondition = and(
          or(
            ilike(withdrawalTable.userId as any, `%${search}%`),
            ilike(withdrawalTable.campaignId as any, `%${search}%`)
          ),
          eq(withdrawalTable.status, status as any)
        );
      } else if (search) {
        whereCondition = or(
          ilike(withdrawalTable.userId as any, `%${search}%`),
          ilike(withdrawalTable.campaignId as any, `%${search}%`)
        );
      } else if (status !== "all") {
        whereCondition = eq(withdrawalTable.status, status as any);
      }

      const items = await db
        .select()
        .from(withdrawalTable)
        .where(whereCondition)
        .orderBy(desc(withdrawalTable.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count: total }] = await db
        .select({ count: count() })
        .from(withdrawalTable)
        .where(whereCondition);

      return NextResponse.json({
        ok: true,
        data: {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil((total as number) / limit),
          },
        },
      });
    }
  } catch (error) {
    console.error("Error fetching admin payments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { type, id, action, status } = await request.json();
    if (!type || !id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type === "donation") {
      if (action === "block") {
        const updated = await db
          .update(paymentTable)
          .set({ isBlocked: true, updatedAt: new Date() })
          .where(eq(paymentTable.id, id))
          .returning();
        return NextResponse.json({ ok: true, data: updated[0] });
      }
      if (action === "unblock") {
        const updated = await db
          .update(paymentTable)
          .set({ isBlocked: false, updatedAt: new Date() })
          .where(eq(paymentTable.id, id))
          .returning();
        return NextResponse.json({ ok: true, data: updated[0] });
      }
      if (action === "mark") {
        // mark complete/incomplete
        if (typeof status !== "boolean") {
          return NextResponse.json({ error: "Invalid mark status" }, { status: 400 });
        }
        const updated = await db
          .update(paymentTable)
          .set({ isCompleted: status, updatedAt: new Date() })
          .where(eq(paymentTable.id, id))
          .returning();
        return NextResponse.json({ ok: true, data: updated[0] });
      }
    } else if (type === "cashout") {
      if (!status || !["pending", "completed", "failed"].includes(status)) {
        return NextResponse.json({ error: "Invalid cashout status" }, { status: 400 });
      }
      const updated = await db
        .update(withdrawalTable)
        .set({ status: status as any, updatedAt: new Date() })
        .where(eq(withdrawalTable.id, id))
        .returning();
      return NextResponse.json({ ok: true, data: updated[0] });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error updating admin payments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
