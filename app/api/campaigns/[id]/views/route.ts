import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db/drizzle"
import { campaignViewTable, userTable } from "@/db/schema"
import { nanoid } from "nanoid"
import { eq, and, gte, or } from "drizzle-orm"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const campaignId = (await params).id
    const { userId: clerkId } = await auth()
    let userId: string | null = null
    if (clerkId) {
      const [u] = await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1)
      if (u) userId = u.id
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const ua = request.headers.get('user-agent') || ''

    // dedupe: only one view per 12h per (userId or ip) per campaign
    const since = new Date(Date.now() - 12 * 60 * 60 * 1000)
    const [existing] = await db
      .select({ id: campaignViewTable.id })
      .from(campaignViewTable)
      .where(
        and(
          eq(campaignViewTable.campaignId, campaignId),
          gte(campaignViewTable.createdAt as any, since as any),
          userId
            ? eq(campaignViewTable.userId, userId as any)
            : and(eq(campaignViewTable.userId, null as any), eq(campaignViewTable.ip, ip))
        )
      )
      .limit(1)

    if (!existing) {
      await db.insert(campaignViewTable).values({ id: nanoid(16), campaignId, userId: userId as any, ip, userAgent: ua })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: true }) // fail-open to avoid harming UX
  }
}