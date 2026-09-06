"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { shortUserId } from "@/lib/auth";
import { DISPLAY_NAME_MAX } from "@/types/user";

export function ProfileClient() {
  const { user, ready, recentNamed, signInWithName, switchToGuest, selectNamedUser } =
    useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const result = signInWithName(name);
    if (!result.ok) {
      setError(result.error ?? "이름을 확인해 주세요.");
      return;
    }
    setMessage(`${name.trim()}(으)로 시작했어요!`);
    setName("");
  }

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-teal-900/70">
        프로필을 준비하고 있어요…
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <section className="card-panel">
        <p className="text-sm font-semibold text-teal-700">내 프로필</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-teal-950">
          {user.displayName}
        </h1>
        <dl className="mt-4 space-y-2 text-sm text-teal-900/80">
          <div className="flex justify-between gap-4">
            <dt className="font-semibold">모드</dt>
            <dd>{user.mode === "guest" ? "게스트" : "이름 로그인"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-semibold">게스트 ID</dt>
            <dd className="font-mono tabular-nums">{shortUserId(user.id)}</dd>
          </div>
        </dl>
        <p className="mt-4 rounded-xl bg-sky-50 px-3 py-2 text-xs leading-relaxed text-teal-800/80">
          비밀번호 없이 이 기기에만 저장돼요. 같은 이름으로 다시 들어오면 이전
          성적·오답 노트를 이어서 볼 수 있어요.
        </p>
      </section>

      <section className="card-panel">
        <h2 className="section-title">이름으로 시작하기</h2>
        <p className="mt-1 text-sm text-teal-800/70">
          초등학생용 간단 로그인이에요. 이름만 입력하면 됩니다.
        </p>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-semibold text-teal-900">
            이름
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={DISPLAY_NAME_MAX}
              placeholder="예: 민수"
              className="mt-1 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-base font-semibold text-teal-950 outline-none ring-teal-300 focus:ring-2"
              autoComplete="nickname"
            />
          </label>
          {error && (
            <p className="text-sm font-semibold text-amber-700" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm font-semibold text-emerald-700" role="status">
              {message}
            </p>
          )}
          <button type="submit" className="btn-primary">
            이 이름으로 시작
          </button>
        </form>
      </section>

      {recentNamed.length > 0 && (
        <section className="card-panel">
          <h2 className="section-title">최근에 쓴 이름</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {recentNamed.map((profile) => (
              <li key={profile.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectNamedUser(profile);
                    setMessage(`${profile.displayName}(으)로 바꿨어요.`);
                    setError(null);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    profile.id === user.id
                      ? "bg-teal-600 text-white"
                      : "bg-teal-50 text-teal-900 hover:bg-teal-100"
                  }`}
                >
                  {profile.displayName}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card-panel flex flex-col gap-3">
        <h2 className="section-title">게스트로 연습</h2>
        <p className="text-sm text-teal-800/70">
          이름 없이 바로 풀고 싶다면 게스트 ID로 이어갈 수 있어요. 새 게스트는
          기록이 따로 쌓입니다.
        </p>
        <button type="button" onClick={switchToGuest} className="btn-secondary">
          {user.mode === "guest" ? "새 게스트 ID 만들기" : "게스트로 전환"}
        </button>
        <Link href="/" className="btn-primary text-center">
          연습하러 가기
        </Link>
      </section>
    </div>
  );
}
