import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db/drizzle"
import { campaignTable, reportTable, userTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { logEvent } from "@/lib/logging"
import { sendNotification } from "@/lib/notification"
import { rateLimit } from "@/lib/rateLimit"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { reason, description } = await request.json()

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 })
    }

    // basic rate limit: 5 reports per 10 minutes per IP per campaign
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const limitKey = `report:${(await params).id}:${ip}`
    const lim = rateLimit({ key: limitKey, windowMs: 10 * 60_000, max: 5 })
    if (!lim.ok) {
      return NextResponse.json({ error: 'Too many reports, please try later' }, { status: 429 })
    }

    const campaignId = (await params).id

    // fetch campaign title
    const [campaign] = await db.select({ id: campaignTable.id, title: campaignTable.title }).from(campaignTable).where(eq(campaignTable.id, campaignId)).limit(1)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // reporter info (optional if not logged in)
    const { userId: clerkId } = await auth()
    let reporterId: string | null = null
    let reporterName = 'Anonymous'
    if (clerkId) {
      const [u] = await db.select({ id: userTable.id, name: userTable.name }).from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1)
      if (u) { reporterId = u.id; reporterName = u.name }
    }

    const [inserted] = await db.insert(reportTable).values({
      id: nanoid(16),
      type: 'campaign' as any,
      targetId: campaign.id,
      targetTitle: campaign.title,
      reason: reason.trim(),
      description: (description || '').toString(),
      reporterId: reporterId as any,
      reporterName,
      status: 'pending' as any,
      // priority default handled by schema
    }).returning()

    // log event
    try {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
      const ua = request.headers.get('user-agent') || ''
      await logEvent({ level: 'warning', category: 'report:create', user: clerkId || 'anonymous', details: `Report created on campaign ${campaign.id}`, ipAddress: ip, userAgent: ua, metaData: { reportId: inserted.id, campaignId: campaign.id, reason } })
    } catch {}

    // notify admin (best-effort)
    try {
      const adminClerkId = process.env.ADMIN_CLERK_ID
      if (adminClerkId) {
        const [admin] = await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.clerkId, adminClerkId)).limit(1)
        if (admin?.id) {
          await sendNotification('New campaign report', 'campaignStuff' as any, admin.id, campaign.id)
        }
      }
    } catch {}

    return NextResponse.json({ ok: true, data: { report: inserted } }, { status: 201 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.log(error)
    return NextResponse.json({ error: "internal server error" }, { status: 500 })
  }
}
