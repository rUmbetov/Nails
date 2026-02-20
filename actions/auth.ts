'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { RefreshTokenPayload, signAccessToken, signRefreshToken, verifyToken } from '@/lib/jwt';
import { LoginDTO, loginSchema, RegisterDTO, registerSchema } from '@/types/types';

export async function registerUser(data: RegisterDTO) {
  // 1. Серверная валидация Zod (обязательно, нельзя доверять клиенту)
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Некорректные данные' };
  }

  const { email, password } = parsed.data;

  try {
    // 2. Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует' };
    }

    // 3. Хэширование и создание пользователя
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'USER' },
    });

    // 4. Создание сессии для авто-логина
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await prisma.session.create({
      data: { userId: user.id, expiresAt, userAgent: 'Server-Action-Register' },
    });

    // 5. Генерация JWT
    const accessToken = await signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await signRefreshToken({ 
      sessionId: session.id, 
      userId: user.id, 
      role: user.role 
    });

    // 6. Установка HTTP-only кук прямо из Server Action
const cookieStore = await cookies();    const isProd = process.env.NODE_ENV === 'production';

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 15 * 60, path: '/'
    });
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/'
    });

    return { success: true, user: { userId: user.id, role: user.role } };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Внутренняя ошибка сервера при регистрации' };
  }
}

export async function loginUser(data: LoginDTO) {
  // 1. Валидация Zod
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: 'Некорректные данные' };

  const { email, password } = parsed.data;

  try {
    // 2. Проверка юзера
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: 'Неверный email или пароль' };

    // 3. Проверка пароля
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: 'Неверный email или пароль' }; // Текст ошибки лучше делать одинаковым ради безопасности

    // 4. Создаем сессию
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await prisma.session.create({
      data: { userId: user.id, expiresAt, userAgent: 'Server-Action-Login' },
    });

    // 5. Генерируем токены
    const accessToken = await signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await signRefreshToken({ 
      sessionId: session.id, userId: user.id, role: user.role 
    });

    // 6. Устанавливаем куки (Next.js 15+)
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === 'production';

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 15 * 60, path: '/'
    });
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/'
    });

    return { success: true, user: { userId: user.id, role: user.role } };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Внутренняя ошибка сервера' };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies(); // Next 15+ 
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    const payload = await verifyToken<RefreshTokenPayload>(refreshToken);
    if (payload?.sessionId) {
      // Удаляем сессию из БД по ID
      await prisma.session.delete({ where: { id: payload.sessionId } }).catch(() => {});
    }
  }

  // Очищаем куки
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return { success: true };
}