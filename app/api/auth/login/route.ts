import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/validations/user";
import { userTable } from "@/db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logEvent } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    const body = await req.json();

    const { success, error, data } = loginSchema.safeParse(body);

    if (!success) {
      await logEvent({
        level: "warning",
        category: "Authentication",
        user: body.email || "unknown user",
        details: "Login attempt with invalid input data.",
        ipAddress,
        userAgent,
        metaData: { body },
      });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, data.email))
      .limit(1);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      await logEvent({
        level: "warning",
        category: "Authentication",
        user: data.email,
        details: "Failed login attempt: Invalid credentials.",
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isKyc: user.isKyc,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    await logEvent({
      level: "info",
      category: "Authentication",
      user: user.id,
      details: "User logged in successfully.",
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      {
        message: "User logged in successfully",
        data: {
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    await logEvent({
      level: "error",
      category: "Authentication",
      user: "system",
      details: `An unexpected error occurred during login: ${error instanceof Error ? error.message : String(error)}`,
      ipAddress,
      userAgent,
      metaData: { error: error instanceof Error ? error.stack : String(error) },
    });
    process.env.NODE_ENV === "development" ? console.log(error) : "";
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}