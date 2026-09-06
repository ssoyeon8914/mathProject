"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getTopicById, gradeLabel } from "@/lib/curriculum/topics";
import { getScoreHistory } from "@/lib/storage";
import type { ScoreRecord } from "@/types/problem";

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export function HistoryClient() {
  const { user } = useAuth();
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    setScores(getScoreHistory());
  }, [user?.id]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <section className="card-panel">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-teal-950">
              최근 성적
            </h1>
            <p className="mt-2 text-sm text-teal-800/70">
              이 프로필에 저장된 최근 연습 기록이에요. (최대 50개)
            </p>
          </div>
          <Link href="/dashboard" className="btn-secondary px-4 py-2 text-sm">
            진도 대시보드
          </Link>
        </div>
      </section>

      {scores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200 bg-white/60 px-6 py-12 text-center text-teal-800/70">
          아직 기록이 없어요. 한 세트 풀어보면 여기에 쌓여요.
        </div>
      ) : (
        <ul className="space-y-3">
          {scores.map((score) => {
            const topic = getTopicById(score.topicId);
            const date = new Date(score.finishedAt);
            return (
              <li
                key={score.id}
                className="card-panel flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-[family-name:var(--font-display)] text-lg font-bold text-teal-950">
                    {topic?.name ?? score.topicId}
                  </p>
                  <p className="mt-1 text-sm text-teal-800/70">
                    {gradeLabel(score.grade)} · {DIFFICULTY_LABEL[score.difficulty]} ·{" "}
                    {date.toLocaleString("ko-KR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold tabular-nums text-teal-600">
                    {score.percent}%
                  </p>
                  <p className="text-xs font-semibold text-teal-800/60">
                    {score.correct}/{score.total}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
