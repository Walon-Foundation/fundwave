import { NextResponse, NextRequest } from "next/server";
import { getAnalyticsData } from "@/lib/ai";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new NextResponse("Campaign ID is required", { status: 400 });
  }

  try {
    const analyticsData = await getAnalyticsData(
      `Generate detailed analytics for campaign ${id}.`
    );

    return NextResponse.json({
      campaignId: id,
      analytics: analyticsData,
    });
  } catch (error) {
    console.error(`Error generating analytics for campaign ${id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

