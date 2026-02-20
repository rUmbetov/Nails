'use server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterDTO, registerSchema } from '../validation/register.schema';
import { setSession } from '@/lib/auth/session';

export async function registerUser(data: RegisterDTO) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Некорректные данные' };
  }

  const { email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    await setSession({ userId: user.id, role: user.role });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Внутренняя ошибка сервера при регистрации' };
  }
}
