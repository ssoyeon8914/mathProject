"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { gradeLabel } from "@/lib/curriculum/topics";
import {
  buildDashboardSummary,
  suggestPracticeDifficulty,
  suggestPracticeGrade,
  type TopicProgress,
} from "@/lib/dashboard";
import { DEFAULT_PROBLEM_COUNT } from "@/lib/session";
import { saveQuizConfig, saveQuizProblems } from "@/lib/quiz-state";
import { getScoreHistory, getWrongNotes } from "@/lib/storage";

const LEVEL_LABEL: Record<TopicProgress["level"], string> = {
  weak: "약한 유형",
  ok: "연습 중",
  strong: "잘해요",
  untried: "아직 안 함",
};

const LEVEL_STYLE: Record<TopicProgress["level"], string> = {
  weak: "bg-amber-100 text-amber-900",
  ok: "bg-sky-100 text-sky-900",
  strong: "bg-emerald-100 text-emerald-900",
  untried: "bg-teal-50 text-teal-800/70",
};

export function DashboardClient() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick((n) => n + 1);
  }, [user?.id]);

  const summary = useMemo(() => {
    void tick;
    return buildDashboardSummary(getScoreHistory(), getWrongNotes());
  }, [tick, user?.id]);

  function startTopic(topic: TopicProgress) {
    saveQuizProblems([]);
    saveQuizConfig({
      topicId: topic.topicId,
      grade: suggestPracticeGrade(topic),
      difficulty: suggestPracticeDifficulty(topic),
      problemCount: DEFAULT_PROBLEM_COUNT,
      timed: false,
      mode: "practice",
    });
    router.push("/quiz");
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-teal-900/70">
        대시보드를 준비하고 있어요…
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-emerald-500 to-sky-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
        <p className="text-sm font-semibold text-white/85">
          {user?.displayName ?? "게스트"}의 학습 현황
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
          진도 대시보드
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">
          연습한 유형과 약한 부분을 한눈에 보고, 바로 다시 풀어볼 수 있어요.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="전체 정답률" value={`${summary.overallPercent}%`} />
        <StatCard label="푼 문제" value={`${summary.problemCount}`} />
        <StatCard
          label="유형 진도"
          value={`${summary.topicsTried}/${summary.topicsTotal}`}
          hint={`${summary.coveragePercent}%`}
        />
        <StatCard label="연습한 날" value={`${summary.practiceDays}일`} />
      </section>

      <section className="card-panel">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="section-title">약한 유형</h2>
            <p className="mt-1 text-sm text-teal-800/70">
              정답률이 낮거나 오답이 많은 유형이에요. 쉬운 난이도로 다시 연습해
              봐요.
            </p>
          </div>
          <Link href="/notes" className="text-sm font-bold text-teal-700 hover:underline">
            오답 노트 →
          </Link>
        </div>

        {summary.weakTopics.length === 0 ? (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            {summary.sessionCount === 0
              ? "아직 연습 기록이 없어요. 한 세트 풀어보면 여기에 나타나요."
              : "지금은 특별히 약한 유형이 없어요. 잘하고 있어요!"}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {summary.weakTopics.map((topic) => (
              <TopicRow key={topic.topicId} topic={topic} onPractice={startTopic} />
            ))}
          </ul>
        )}
      </section>

      {summary.strongTopics.length > 0 && (
        <section className="card-panel">
          <h2 className="section-title">잘하는 유형</h2>
          <p className="mt-1 text-sm text-teal-800/70">정답률이 높은 유형이에요.</p>
          <ul className="mt-4 space-y-3">
            {summary.strongTopics.map((topic) => (
              <TopicRow key={topic.topicId} topic={topic} onPractice={startTopic} />
            ))}
          </ul>
        </section>
      )}

      <section className="card-panel">
        <h2 className="section-title">유형별 진도</h2>
        <p className="mt-1 text-sm text-teal-800/70">모든 유형의 연습 현황이에요.</p>
        <ul className="mt-4 space-y-3">
          {summary.allTopics.map((topic) => (
            <TopicRow key={topic.topicId} topic={topic} onPractice={startTopic} />
          ))}
        </ul>
      </section>

      <section className="card-panel">
        <div className="flex items-center justify-between gap-2">
          <h2 className="section-title">최근 연습</h2>
          <Link href="/history" className="text-sm font-bold text-teal-700 hover:underline">
            전체 성적 →
          </Link>
        </div>
        {summary.recentScores.length === 0 ? (
          <p className="mt-4 text-sm text-teal-800/70">최근 기록이 없어요.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {summary.recentScores.map((score) => {
              const topic = summary.allTopics.find((t) => t.topicId === score.topicId);
              return (
                <li
                  key={score.id}
                  className="flex items-center justify-between rounded-xl bg-sky-50/80 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-teal-950">
                    {topic?.topicName ?? score.topicId} · {gradeLabel(score.grade)}
                  </span>
                  <span className="font-extrabold tabular-nums text-teal-700">
                    {score.percent}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Link href="/" className="btn-primary text-center text-lg">
        새 연습 시작하기
      </Link>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card-panel !p-4">
      <p className="text-xs font-semibold text-teal-800/65">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums text-teal-950">
        {value}
      </p>
      {hint && <p className="text-xs font-semibold text-teal-700/70">{hint}</p>}
    </div>
  );
}

function TopicRow({
  topic,
  onPractice,
}: {
  topic: TopicProgress;
  onPractice: (topic: TopicProgress) => void;
}) {
  const barWidth = topic.total === 0 ? 0 : topic.percent;

  return (
    <li className="rounded-2xl border border-teal-900/5 bg-white/70 p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-[family-name:var(--font-display)] text-lg font-bold text-teal-950">
              {topic.topicName}
            </p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${LEVEL_STYLE[topic.level]}`}
            >
              {LEVEL_LABEL[topic.level]}
            </span>
          </div>
          <p className="mt-1 text-sm text-teal-800/70">
            {topic.total === 0
              ? "아직 연습 전"
              : `${topic.correct}/${topic.total} 정답 · ${topic.sessions}회 연습`}
            {topic.wrongNotes > 0 ? ` · 오답 ${topic.wrongNotes}개` : ""}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-teal-100">
            <div
              className={`h-full rounded-full transition-all ${
                topic.level === "weak"
                  ? "bg-amber-400"
                  : topic.level === "strong"
                    ? "bg-emerald-500"
                    : "bg-teal-500"
              }`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-right text-xl font-extrabold tabular-nums text-teal-700">
            {topic.total === 0 ? "—" : `${topic.percent}%`}
          </p>
          <button
            type="button"
            onClick={() => onPractice(topic)}
            className="btn-primary px-3 py-2 text-sm"
          >
            연습
          </button>
        </div>
      </div>
    </li>
  );
}
