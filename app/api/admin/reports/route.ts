import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { reportTable, reportStatusEnum, reportTypeEnum } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  try {
    // Build the query for fetching reports
    const queryBuilder = db.select().from(reportTable);
    const conditions = [];
    if (status && reportStatusEnum.enumValues.includes(status as any)) {
      conditions.push(eq(reportTable.status, status as any));
    }
    if (type && reportTypeEnum.enumValues.includes(type as any)) {
      conditions.push(eq(reportTable.type, type as any));
    }
    if (conditions.length > 0) {
      queryBuilder.where(and(...conditions));
    }

    const reports = await queryBuilder;

    // Build the summary
    const [totalRes] = await db.select({ value: count() }).from(reportTable);
    const [pendingRes] = await db
      .select({ value: count() })
      .from(reportTable)
      .where(eq(reportTable.status, "pending"));
    const [investigatingRes] = await db
      .select({ value: count() })
      .from(reportTable)
      .where(eq(reportTable.status, "investigating"));
    const [resolvedRes] = await db
      .select({ value: count() })
      .from(reportTable)
      .where(eq(reportTable.status, "resolved"));

    const summary = {
      total: totalRes.value,
      pending: pendingRes.value,
      investigating: investigatingRes.value,
      resolved: resolvedRes.value,
    };

    return NextResponse.json({
      reports,
      summary,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

