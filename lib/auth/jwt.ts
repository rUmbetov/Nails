import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export interface SessionPayload {
  userId: string;
  role: string;
}

export const signSessionToken = async (payload: SessionPayload) => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
};

export const verifyToken = async <T>(token: string): Promise<T | null> => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as T;
  } catch {
    return null;
  }
};