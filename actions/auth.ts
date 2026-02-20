"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession, deleteSession } from "@/lib/session";
import {
  LoginDTO,
  loginSchema,
  RegisterDTO,
  registerSchema,
} from "@/types/types";

export async function registerUser(data: RegisterDTO) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Некорректные данные" };
  }

  const { email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Пользователь с таким email уже существует" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    await setSession({ userId: user.id, role: user.role });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Внутренняя ошибка сервера при регистрации" };
  }
}

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

export async function logoutUser() {
  await deleteSession();
  return { success: true };
}
