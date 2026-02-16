import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { GlobalCursor } from "@/components/global-cursor";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Q-Habit — Трекер привычек нового поколения",
  description: "Формируй привычки с помощью AI, аналитики и геймификации. Q-Habit — твой путь к совершенству.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-theme="cosmic" className={jakarta.variable}>
      <body className="antialiased min-h-screen">
        <GlobalCursor />
        <Providers>
          <div className="page-transition-wrapper">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
