'use server';
import { deleteSession } from '@/lib/auth/session';

export async function logoutUser() {
  await deleteSession();
  return { success: true };
}
