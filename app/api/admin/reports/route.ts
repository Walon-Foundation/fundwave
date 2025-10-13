import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { reportTable, campaignTable, userTable } from "@/db/schema";
import { eq, desc, count, and, inArray, type SQL } from "drizzle-orm";

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

    // Enrich with campaign and reporter details
    const campaignIds = reports.filter((r:any)=>r.type==='campaign').map((r:any)=>r.targetId)
    const reporterIds = reports.map((r:any)=>r.reporterId).filter(Boolean)

    const [campaigns, reporters] = await Promise.all([
      campaignIds.length ? db.select({ id: campaignTable.id, title: campaignTable.title, creatorId: campaignTable.creatorId, creatorName: campaignTable.creatorName }).from(campaignTable).where(inArray(campaignTable.id, campaignIds)) : Promise.resolve([]),
      reporterIds.length ? db.select({ id: userTable.id, name: userTable.name, email: userTable.email }).from(userTable).where(inArray(userTable.id, reporterIds as string[])) : Promise.resolve([]),
    ])

    const campMap = new Map(campaigns.map((c:any)=>[c.id, c]))
    const repMap = new Map(reporters.map((u:any)=>[u.id, u]))

    const enriched = reports.map((r:any)=> ({
      ...r,
      campaign: r.type==='campaign' ? campMap.get(r.targetId) || null : null,
      reporter: r.reporterId ? (repMap.get(r.reporterId) || { id: r.reporterId, name: r.reporterName }) : { name: r.reporterName },
    }))

    // Get total count for pagination
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(reportTable)
      .where(whereCondition);

    return NextResponse.json({
      ok: true,
      data: {
        reports: enriched,
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