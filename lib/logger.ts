import { db } from "@/db/drizzle";
import { logTable, levelEnum } from "@/db/schema";
import cuid from "cuid";

interface LogDetails {
  level: typeof levelEnum.enumValues[number];
  category: string;
  user: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  metaData?: Record<string, any>;
}

export async function logEvent(logDetails: LogDetails) {
  try {
    await db.insert(logTable).values({
      id: cuid(),
      timestamp: new Date(),
      ...logDetails,
      metaData: logDetails.metaData || {},
    });
  } catch (error) {
    console.error("Failed to write to log table:", error);
  }
}
