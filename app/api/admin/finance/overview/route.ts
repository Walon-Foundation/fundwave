import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { paymentTable, withdrawalTable } from "@/db/schema";
import { count, sum, eq, gte } from "drizzle-orm";

export async function GET() {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Overview
    const [totalRevenueRes] = await db
      .select({ value: sum(paymentTable.amount) })
      .from(paymentTable);
    const [monthlyRevenueRes] = await db
      .select({ value: sum(paymentTable.amount) })
      .from(paymentTable)
      .where(gte(paymentTable.createdAt, oneMonthAgo));
    const [pendingWithdrawalsRes] = await db
      .select({ value: sum(withdrawalTable.amount) })
      .from(withdrawalTable)
      .where(eq(withdrawalTable.status, "pending"));
    const [completedWithdrawalsRes] = await db
      .select({ value: sum(withdrawalTable.amount) })
      .from(withdrawalTable)
      .where(eq(withdrawalTable.status, "completed"));

    const totalRevenue = Number(totalRevenueRes.value) || 0;
    const platformFees = totalRevenue * 0.05; // Assuming 5% platform fee
    const processingFees = totalRevenue * 0.02; // Assuming 2% processing fee
    const netRevenue = totalRevenue - platformFees - processingFees;

    const overview = {
      totalRevenue: totalRevenue,
      monthlyRevenue: Number(monthlyRevenueRes.value) || 0,
      platformFees: platformFees,
      processingFees: processingFees,
      netRevenue: netRevenue,
      pendingWithdrawals: Number(pendingWithdrawalsRes.value) || 0,
      completedWithdrawals: Number(completedWithdrawalsRes.value) || 0,
    };

    // For trends and breakdown, we'll use dummy data for now
    const trends = {
      revenueGrowth: 15.2,
      feeGrowth: 12.8,
      withdrawalGrowth: 8.5,
    };

    const breakdown = {
      orangeMoney: { volume: 15000000, fees: 375000 },
      africellMoney: { volume: 12000000, fees: 300000 },
      creditCard: { volume: 8000000, fees: 280000 },
      bankTransfer: { volume: 10000000, fees: 150000 },
    };

    return NextResponse.json({
      overview,
      trends,
      breakdown,
    });
  } catch (error) {
    console.error("Error fetching finance overview:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

