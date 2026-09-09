import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_KR, IBM_Plex_Mono, Fredoka } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

// IBM Plex Sans KR은 한글 글리프를 포함해 파일이 크므로 preload를 끄고
// latin 서브셋만 preload 대상에서 제외한 채 자체 호스팅한다.
const ibmPlexSansKr = IBM_Plex_Sans_KR({
  variable: "--font-ibm-plex-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="ko"
      className={`${ibmPlexSansKr.variable} ${ibmPlexMono.variable} ${fredoka.variable} h-full`}
    >
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
