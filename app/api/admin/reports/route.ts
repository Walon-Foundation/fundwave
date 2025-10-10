import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { reportTable } from "@/db/schema";
import { eq, desc, count, and, type SQL } from "drizzle-orm";

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
    const status = url.searchParams.get("status") || "";
    const type = url.searchParams.get("type") || "";
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereCondition: SQL<unknown> | undefined;
    
    if (status && status !== "all" && type && type !== "all") {
      whereCondition = and(
        eq(reportTable.status, status as any),
        eq(reportTable.type, type as any)
      );
    } else if (status && status !== "all") {
      whereCondition = eq(reportTable.status, status as any);
    } else if (type && type !== "all") {
      whereCondition = eq(reportTable.type, type as any);
    }

    const reports = await db
      .select()
      .from(reportTable)
      .where(whereCondition)
      .orderBy(desc(reportTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(reportTable)
      .where(whereCondition);

    return NextResponse.json({
      ok: true,
      data: {
        reports,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin reports:", error);
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
    const { reportId, status, priority } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["pending", "investigating", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updateData: any = { 
      status,
      updatedAt: new Date()
    };

    if (priority && ["low", "medium", "high"].includes(priority)) {
      updateData.priority = priority;
    }

    const updatedReport = await db
      .update(reportTable)
      .set(updateData)
      .where(eq(reportTable.id, reportId))
      .returning();

    if (!updatedReport.length) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        message: `Report status updated to ${status}`,
        report: updatedReport[0],
      },
    });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}