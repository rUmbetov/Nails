import { cookies } from "next/headers";
import { signSessionToken, verifyToken } from "@/lib/auth/jwt";
import type { Viewer } from "@/types/viewer";

const COOKIE_NAME = "session";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7d

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  };
}

export async function setSession(viewer: Viewer) {
  const token = await signSessionToken({
    userId: viewer.userId,
    role: viewer.role,
  });

  const store = await cookies();
  store.set(COOKIE_NAME, token, cookieOptions());
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function getViewerFromSession(): Promise<Viewer | null> {
  const token = await getSessionToken();
  if (!token) return null;

  return await verifyToken<Viewer>(token);
}
