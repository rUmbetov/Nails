"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signSessionToken } from "@/lib/jwt";
import {
  LoginDTO,
  loginSchema,
  RegisterDTO,
  registerSchema,
} from "@/types/types";

export async function registerUser(data: RegisterDTO) {
  // 1. Серверная валидация Zod (обязательно, нельзя доверять клиенту)
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Некорректные данные" };
  }

  const { email, password } = parsed.data;

  try {
    // 2. Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Пользователь с таким email уже существует" };
    }

    // 3. Хэширование и создание пользователя
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: "USER" },
    });

    // 5. Генерация JWT
    const sessionToken = await signSessionToken({
      userId: user.id,
      role: user.role,
    });

    // 6. Установка HTTP-only кук прямо из Server Action
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 дней (или сделай 24*60*60 если хочешь 1 день)
      path: "/",
    });
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Внутренняя ошибка сервера при регистрации" };
  }
}

export async function loginUser(data: LoginDTO) {
  // 1. Валидация Zod
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: "Некорректные данные" };

  const { email, password } = parsed.data;

  try {
    // 2. Проверка юзера
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Неверный email или пароль" };

    // 3. Проверка пароля
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: "Неверный email или пароль" }; // Текст ошибки лучше делать одинаковым ради безопасности

    // 5. Генерируем токены
    const sessionToken = await signSessionToken({
      userId: user.id,
      role: user.role,
    });

    // 6. Устанавливаем куки (Next.js 15+)
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 дней (или сделай 24*60*60 если хочешь 1 день)
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Внутренняя ошибка сервера" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}
