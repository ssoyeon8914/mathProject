import type { Metadata, Viewport } from "next";
import { Nunito, Fredoka } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "수학탐험 | 초등 수학 문제 풀이",
  description: "초등학생이 학년·유형별로 수학 문제를 풀고 바로 채점받는 연습 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${nunito.variable} ${fredoka.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <AuthProvider>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-teal-900/5 py-4 text-center text-xs text-teal-900/45">
            수학탐험 · 초등 수학을 재미있게
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
