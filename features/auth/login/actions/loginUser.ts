"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginDTO, loginSchema } from "../validation/login.schema";
import { setSession } from "@/lib/auth/session";

export async function loginUser(data: LoginDTO) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: "Некорректные данные" };

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Неверный email или пароль" };

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: "Неверный email или пароль" };

    await setSession({ userId: user.id, role: user.role });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Внутренняя ошибка сервера" };
  }
}
