import { cookies } from 'next/headers';
import { verifyToken, AccessTokenPayload } from '@/lib/jwt';

export async function getUser(): Promise<AccessTokenPayload | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('accessToken')?.value;

  if (!token) return null;

  return await verifyToken<AccessTokenPayload>(token);
}