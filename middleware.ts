import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, signAccessToken, AccessTokenPayload, RefreshTokenPayload } from '@/lib/jwt';

const protectedRoutes = ['/dashboard', '/profile'];
const authRoutes = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r));

  // 1. Быстрая проверка Access-токена
  if (accessToken) {
    const accessPayload = await verifyToken<AccessTokenPayload>(accessToken);
    if (accessPayload) {
      if (isAuthRoute) return NextResponse.redirect(new URL('/', req.url));
      return NextResponse.next();
    }
  }

  // 2. Access протух, но есть Refresh
  if (!accessToken && refreshToken) {
    const refreshPayload = await verifyToken<RefreshTokenPayload>(refreshToken);

    if (refreshPayload) {
      // Генерируем новый Access-токен, используя данные из Refresh-токена
      const newAccessToken = await signAccessToken({ 
        userId: refreshPayload.userId, 
        role: refreshPayload.role 
      });

      // Мутируем заголовки запроса, чтобы Server Components (page.tsx/layout.tsx)
      // сразу получили свежий токен в cookies, не дожидаясь ререндера клиента
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('cookie', `accessToken=${newAccessToken}; ${requestHeaders.get('cookie') || ''}`);

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // Устанавливаем обновленную куку для браузера
      response.cookies.set({
        name: 'accessToken',
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 минут
        path: '/',
      });

      return response;
    }
  }

  // 3. Нет токенов или Refresh тоже протух/невалиден
  if (isProtectedRoute) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};