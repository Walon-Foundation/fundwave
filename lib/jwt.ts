import { jwtVerify } from "jose";

export interface UserJwtPayload {
  jti: string;
  id: string;
  iat: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isKyc: boolean;
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function verifyJwt(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify<UserJwtPayload>(
      token,
      getJwtSecretKey()
    );
    return payload;
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return null;
  }
}
