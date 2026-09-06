"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const LINKS = [
  { href: "/", label: "연습하기" },
  { href: "/dashboard", label: "진도" },
  { href: "/notes", label: "오답 노트" },
  { href: "/history", label: "성적" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, ready } = useAuth();

  return (
    <header className="border-b border-teal-900/10 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white shadow-sm transition group-hover:scale-105">
            수
          </span>
          <div className="min-w-0 leading-tight">
            <p className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-teal-950">
              수학탐험
            </p>
            <p className="truncate text-xs text-teal-800/60">초등 수학 연습</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden gap-1 sm:flex" aria-label="주요 메뉴">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-teal-600 text-white"
                      : "text-teal-900/70 hover:bg-teal-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/profile"
            className={`flex max-w-[8.5rem] items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-bold transition ${
              pathname === "/profile"
                ? "bg-teal-600 text-white"
                : "bg-teal-50 text-teal-900 hover:bg-teal-100"
            }`}
            aria-label="내 프로필"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                pathname === "/profile"
                  ? "bg-white/20 text-white"
                  : "bg-teal-600 text-white"
              }`}
            >
              {ready && user ? user.displayName.slice(0, 1) : "?"}
            </span>
            <span className="truncate">
              {ready && user ? user.displayName : "…"}
            </span>
          </Link>
        </div>
      </div>

      <nav
        className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-3 sm:hidden"
        aria-label="모바일 메뉴"
      >
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-teal-600 text-white"
                  : "bg-white/70 text-teal-900/70"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
