import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    overview: {
      totalRevenue: 1125000,
      monthlyRevenue: 285000,
      platformFees: 1125000,
      processingFees: 450000,
      netRevenue: 675000,
      pendingWithdrawals: 125000,
      completedWithdrawals: 2500000,
    },
    trends: {
      revenueGrowth: 15.2,
      feeGrowth: 12.8,
      withdrawalGrowth: 8.5,
    },
    breakdown: {
      orangeMoney: { volume: 15000000, fees: 375000 },
      africellMoney: { volume: 12000000, fees: 300000 },
      creditCard: { volume: 8000000, fees: 280000 },
      bankTransfer: { volume: 10000000, fees: 150000 },
    },
  })
}
