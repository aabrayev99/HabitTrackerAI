import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Modern sans-serif
import { Providers } from "@/components/providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Motivation Quoest - Build Your Habits",
  description: "Experience the next level of habit tracking and motivation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cosmic" className={jakarta.variable}>
      <body className="antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
