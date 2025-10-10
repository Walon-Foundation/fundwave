import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { campaignTable, userTable } from "@/db/schema";
import { eq, desc, ilike, or, count, and, type SQL } from "drizzle-orm";

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
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereCondition: SQL<unknown> | undefined;
    
    if (search && status && status !== "all") {
      whereCondition = and(
        or(
          ilike(campaignTable.title, `%${search}%`),
          ilike(campaignTable.creatorName, `%${search}%`),
          ilike(campaignTable.category, `%${search}%`)
        ),
        eq(campaignTable.status, status as any)
      );
    } else if (search) {
      whereCondition = or(
        ilike(campaignTable.title, `%${search}%`),
        ilike(campaignTable.creatorName, `%${search}%`),
        ilike(campaignTable.category, `%${search}%`)
      );
    } else if (status && status !== "all") {
      whereCondition = eq(campaignTable.status, status as any);
    }

    const campaigns = await db
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
        status: campaignTable.status,
        createdAt: campaignTable.createdAt,
        updatedAt: campaignTable.updatedAt,
      })
      .from(campaignTable)
      .where(whereCondition)
      .orderBy(desc(campaignTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(campaignTable)
      .where(whereCondition);

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
    const { campaignIdToUpdate, status, action } = body as { campaignIdToUpdate?: string; status?: string; action?: string };

    if (!campaignIdToUpdate) {
      return NextResponse.json(
        { error: "Missing campaignIdToUpdate" },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      await db.delete(campaignTable).where(eq(campaignTable.id, campaignIdToUpdate));
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
