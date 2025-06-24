import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    methods: [
      {
        id: "orange_money",
        name: "Orange Money",
        type: "mobile_money",
        enabled: true,
        fees: 0.025,
      },
      {
        id: "africell_money",
        name: "Africell Money",
        type: "mobile_money",
        enabled: true,
        fees: 0.025,
      },
      {
        id: "credit_card",
        name: "Credit/Debit Card",
        type: "card",
        enabled: true,
        fees: 0.035,
      },
      {
        id: "bank_transfer",
        name: "Bank Transfer",
        type: "bank",
        enabled: true,
        fees: 0.015,
      },
    ],
  })
}
