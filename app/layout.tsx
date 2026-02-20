import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/sections/Header';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { getViewer } from '@/lib/auth/auth';

const fontSans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

const fontSerif = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Мастер маникюра',
  description: 'Онлайн запись на процедуры',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  return (
    <html lang="ru">
      <body className={`${fontSans.variable} ${fontSerif.variable} antialiased`}>
        <AuthProvider viewer={viewer}>
          <Header />
          <main
            style={{
              display: 'flex',
              minHeight: '100vh',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
