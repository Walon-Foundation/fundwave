import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { campaignTable, campaignStatusEnum } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const queryBuilder = db.select().from(campaignTable);

    if (status && campaignStatusEnum.enumValues.includes(status as any)) {
      queryBuilder.where(eq(campaignTable.status, status as any));
    }

    const campaigns = await queryBuilder;

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

