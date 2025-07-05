import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db/drizzle';
import { logTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyJwt, UserJwtPayload } from '../../../lib/jwt';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authorization token is required' }, { status: 401 });
  }

  try {
    const decoded = (await verifyJwt(token)) as UserJwtPayload | null;
    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 });
    }

    const userId = decoded.id;

    const notifications = await db
      .select()
      .from(logTable)
      .where(eq(logTable.user, userId))
      .orderBy(logTable.timestamp);

    return NextResponse.json({ success: true, data: notifications });

  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch notifications',
      },
      { status: 500 }
    );
  }
}

