import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import type { Viewer } from "@/types/viewer";

export async function getViewer(): Promise<Viewer | null> {
  const coockieSession = await cookies()
  const token = coockieSession.get("session")?.value;
  if (!token) return null;

  // payload должен содержать userId + role
  return await verifyToken<Viewer>(token);
}