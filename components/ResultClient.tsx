"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTopicById } from "@/lib/curriculum/topics";
import { loadQuizSession } from "@/lib/quiz-state";
import { saveQuizConfig, saveQuizProblems } from "@/lib/quiz-state";
import type { QuizSession } from "@/types/problem";

export function ResultClient() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);

  useEffect(() => {
    const s = loadQuizSession();
    if (!s) {
      router.replace("/");
      return;
    }
    setSession(s);
  }, [router]);

  const stats = useMemo(() => {
    if (!session) return null;
    const correct = session.attempts.filter((a) => a.isCorrect).length;
    const total = session.attempts.length;
    const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
    const stars = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 40 ? 1 : 0;
    return { correct, total, percent, stars };
  }, [session]);

  if (!session || !stats) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-teal-900/70">
        결과를 불러오는 중…
      </div>
    );
  }

  const topic = getTopicById(session.topicId);

  function retry() {
    saveQuizProblems([]);
    saveQuizConfig({
      topicId: session!.topicId,
      grade: session!.grade,
      difficulty: session!.difficulty,
      problemCount: session!.problemCount,
      timed: Boolean(session!.timed),
      timeLimitSeconds: session!.timeLimitSeconds,
      mode: "practice",
    });
    router.push("/quiz");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <section className="card-panel animate-pop text-center">
        <p className="text-sm font-semibold text-teal-700">오늘의 탐험 결과</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-teal-950">
          {topic?.name ?? "연습"} 완료!
        </h1>
        <p className="mt-4 text-5xl font-extrabold tabular-nums text-teal-600">
          {stats.percent}%
        </p>
        <p className="mt-2 text-base font-semibold text-teal-900/80">
          {stats.correct} / {stats.total} 문제 정답
        </p>
        <div className="mt-4 flex justify-center gap-2 text-3xl" aria-label={`별 ${stats.stars}개`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={i < stats.stars ? "text-amber-400" : "text-teal-100"}
            >
              ★
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-teal-800/70">
          {stats.percent >= 90
            ? "멋져요! 거의 다 맞혔어요."
            : stats.percent >= 70
              ? "잘했어요! 조금만 더 연습해 볼까요?"
              : "괜찮아요. 오답 노트에서 다시 도전해 봐요."}
        </p>
      </section>

      <section className="card-panel">
        <h2 className="section-title">문제별 결과</h2>
        <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto">
          {session.attempts.map((a, idx) => (
            <li
              key={`${a.problemId}-${idx}`}
              className={`rounded-xl px-3 py-2 text-sm ${
                a.isCorrect ? "bg-emerald-50" : "bg-amber-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-teal-950">
                  {idx + 1}. {a.prompt}
                </span>
                <span
                  className={`shrink-0 font-bold ${
                    a.isCorrect ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {a.isCorrect ? "O" : "X"}
                </span>
              </div>
              {!a.isCorrect && (
                <p className="mt-1 text-teal-800/70">
                  내 답 {a.userAnswer} → 정답 {a.displayAnswer}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={retry} className="btn-primary">
          같은 유형 다시 풀기
        </button>
        <Link href="/notes" className="btn-secondary text-center">
          오답 노트 보기
        </Link>
        <Link href="/" className="btn-secondary text-center sm:col-span-2">
          홈으로
        </Link>
      </div>
    </div>
  );
}
