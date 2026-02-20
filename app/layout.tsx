import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/Header";
import { getUser } from "@/lib/auth";
import { UserStoreProvider } from "@/store/UserStoreProvider";

const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const fontSerif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Мастер маникюра",
  description: "Онлайн запись на процедуры",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <html lang="ru">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} antialiased`}
      >
        <UserStoreProvider user={user}>
          <Header />
          {children}
        </UserStoreProvider>
      </body>
    </html>
  );
}
