import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/ai";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  try {
    const recommendations = await getAnalyticsData(
      `Generate a JSON object of campaign recommendations for user ${userId}. The structure should be: { recommendations: [ { id: string, title: string, campaigns: [ { id: string, title: string, reason: string } ] } ] }`
    );

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error(`Error generating recommendations for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

