import { NextResponse } from "next/server";

export async function GET() {
    const url = process.env.PING_URL!
  try {
    // Ping your Supabase storage URL
    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) throw new Error(`Ping failed: ${res.status}`);

    return NextResponse.json({
      ok: true,
      status: res.status,
      message: "Supabase storage pinged successfully",
    });
  } catch (error) {
    console.error("Ping error:", error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
