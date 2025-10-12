import { db } from "@/db/drizzle";
import { logTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export type LogLevel = "success" | "error" | "warning" | "info";

export async function logEvent(params: {
  level: LogLevel;
  category: string;
  user: string;
  details: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metaData?: Record<string, any>;
}) {
  const { level, category, user, details, ipAddress, userAgent, metaData } = params;
  try {
    await db.insert(logTable).values({
      id: crypto.randomUUID(),
      level: level as any,
      timestamp: new Date(),
      category,
      user,
      details,
      ipAddress: ipAddress || "",
      userAgent: userAgent || "",
      metaData: (metaData as any) || {},
    });
  } catch (e) {
    // Avoid throwing in logging path
    console.warn("logEvent failed", e);
  }
}
