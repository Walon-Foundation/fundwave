import { NextResponse } from 'next/server'
import { db } from '@/db/drizzle'
import { and, lt, eq } from 'drizzle-orm'
import { commentTable, updateTable, campaignTable } from '@/db/schema'

export async function POST() {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days

    // NOTE: Using updatedAt for cutoff; ensure endpoints update updatedAt on soft-delete.
    await db.delete(commentTable).where(and(eq(commentTable.isDeleted, true), lt(commentTable.updatedAt as any, cutoff as any)))
    await db.delete(updateTable).where(and(eq(updateTable.isDeleted, true), lt(updateTable.updatedAt as any, cutoff as any)))
    await db.delete(campaignTable).where(and(eq(campaignTable.isDeleted, true), lt(campaignTable.updatedAt as any, cutoff as any)))

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}