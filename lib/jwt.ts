import { SignJWT, jwtVerify } from 'jose';

const getJwtSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload {
  sessionId: string;
  userId: string;  // Добавили
  role: string;    // Добавили
}

export const signAccessToken = async (payload: AccessTokenPayload) => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getJwtSecretKey());
};

export const signRefreshToken = async (payload: RefreshTokenPayload) => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey());
};

export const verifyToken = async <T>(token: string): Promise<T | null> => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as T;
  } catch (error) {
    return null;
  }
};