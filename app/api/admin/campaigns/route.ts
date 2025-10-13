import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { campaignTable, userTable } from "@/db/schema";
import { eq, desc, asc, ilike, or, count, and, gte, lte, lt, type SQL, sql } from "drizzle-orm";
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
    const type = url.searchParams.get("type") || ""; // business|project|personal|community
    const category = url.searchParams.get("category") || ""; // substring
    const createdFrom = url.searchParams.get("createdFrom") || "";
    const createdTo = url.searchParams.get("createdTo") || "";
    const endingSoon = url.searchParams.get("endingSoon") || ""; // "1" truthy
    const minProgress = parseFloat(url.searchParams.get("minProgress") || "0");
    const sort = url.searchParams.get("sort") || "createdAt"; // createdAt|endDate|raised|progress
    const order = url.searchParams.get("order") || "desc"; // asc|desc
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions: SQL<unknown>[] = [];
    if (search) {
      const q = `%${search}%`;
      conditions.push(
        sql`${campaignTable.title} ILIKE ${q} OR ${campaignTable.creatorName} ILIKE ${q} OR ${campaignTable.category} ILIKE ${q}`
      );
    }
    if (status && status !== "all") conditions.push(eq(campaignTable.status, status as any));
    if (type && type !== "all") conditions.push(eq(campaignTable.campaignType, type as any));
    if (category) conditions.push(ilike(campaignTable.category, `%${category}%`));
    if (createdFrom) conditions.push(gte(campaignTable.createdAt, new Date(createdFrom)));
    if (createdTo) conditions.push(lte(campaignTable.createdAt, new Date(createdTo)));
    if (endingSoon === "1") {
      const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      conditions.push(lte(campaignTable.campaignEndDate, soon));
    }
    if (!Number.isNaN(minProgress) && minProgress > 0) {
      conditions.push(sql`(${campaignTable.amountReceived} / NULLIF(${campaignTable.fundingGoal}, 0)) >= ${minProgress / 100}`);
    }
    const whereCondition = conditions.length ? and(...conditions) : undefined;

    const baseSelect = db
      .select({
        id: campaignTable.id,
        title: campaignTable.title,
        fundingGoal: campaignTable.fundingGoal,
        amountReceived: campaignTable.amountReceived,
        location: campaignTable.location,
        campaignEndDate: campaignTable.campaignEndDate,
        creatorId: campaignTable.creatorId,
        creatorName: campaignTable.creatorName,
        category: campaignTable.category,
        image: campaignTable.image,
        shortDescription: campaignTable.shortDescription,
        moderationNotes: campaignTable.moderationNotes,
        status: campaignTable.status,
        createdAt: campaignTable.createdAt,
        updatedAt: campaignTable.updatedAt,
      })
      .from(campaignTable)
    const selectQB = whereCondition ? baseSelect.where(whereCondition) : baseSelect
    const campaigns = await selectQB
      .orderBy(
        (() => {
          if (sort === 'endDate') return order === 'asc' ? asc(campaignTable.campaignEndDate) : desc(campaignTable.campaignEndDate)
          if (sort === 'raised') return order === 'asc' ? asc(campaignTable.amountReceived) : desc(campaignTable.amountReceived)
          if (sort === 'progress') {
            const progressExpr = sql`(${campaignTable.amountReceived} / NULLIF(${campaignTable.fundingGoal}, 0))`;
            return order === 'asc' ? asc(progressExpr) : desc(progressExpr)
          }
          return order === 'asc' ? asc(campaignTable.createdAt) : desc(campaignTable.createdAt)
        })()
      )
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const baseCount = db.select({ count: count() }).from(campaignTable)
    const countQB = whereCondition ? baseCount.where(whereCondition) : baseCount
    const [{ count: total }] = await countQB;

    return NextResponse.json({
      ok: true,
      data: {
        campaigns,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin campaigns:", error);
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
    const { campaignIdToUpdate, status, action, moderationNotes } = body as { campaignIdToUpdate?: string; status?: string; action?: string; moderationNotes?: string };

    if (!campaignIdToUpdate) {
      return NextResponse.json(
        { error: "Missing campaignIdToUpdate" },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      await db.delete(campaignTable).where(eq(campaignTable.id, campaignIdToUpdate));
      await logEvent({
        level: "warning",
        category: "admin:campaign:delete",
        user: userId,
        details: `Deleted campaign ${campaignIdToUpdate}`,
        metaData: { campaignId: campaignIdToUpdate },
        ipAddress: ip,
        userAgent: ua,
      });
      return NextResponse.json({ ok: true, data: { message: 'Campaign deleted' } });
    }

    if (!status || !["pending","active", "rejected", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedCampaign = await db
      .update(campaignTable)
      .set({ 
        status: status as any,
        updatedAt: new Date()
      })
      .where(eq(campaignTable.id, campaignIdToUpdate))
      .returning();

    if (!updatedCampaign.length) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    await logEvent({
      level: "info",
      category: "admin:campaign:status",
      user: userId,
      details: `Changed campaign ${campaignIdToUpdate} status to ${status}`,
      metaData: { campaignId: campaignIdToUpdate, status },
      ipAddress: ip,
      userAgent: ua,
    });
    return NextResponse.json({
      ok: true,
      data: {
        message: `Campaign status updated to ${status}`,
        campaign: updatedCampaign[0],
      },
    });
  } catch (error) {
    console.error("Error updating campaign status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
