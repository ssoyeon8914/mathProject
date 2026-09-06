"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GRADES, getTopicsForGrade, gradeLabel } from "@/lib/curriculum/topics";
import { DEFAULT_PROBLEM_COUNT } from "@/lib/session";
import { saveQuizConfig, saveQuizProblems } from "@/lib/quiz-state";
import type { Difficulty, Grade } from "@/types/problem";

const DIFFICULTIES: { id: Difficulty; label: string; hint: string }[] = [
  { id: "easy", label: "쉬움", hint: "기초부터" },
  { id: "medium", label: "보통", hint: "알맞은 연습" },
  { id: "hard", label: "어려움", hint: "도전!" },
];

export function HomeClient() {
  const router = useRouter();
  const [grade, setGrade] = useState<Grade>(2);
  const [topicId, setTopicId] = useState("addition");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [problemCount, setProblemCount] = useState(DEFAULT_PROBLEM_COUNT);
  const [timed, setTimed] = useState(false);

  const topics = useMemo(() => getTopicsForGrade(grade), [grade]);

  const activeTopic = topics.find((t) => t.id === topicId) ?? topics[0];

  function onGradeChange(next: Grade) {
    setGrade(next);
    const nextTopics = getTopicsForGrade(next);
    setTopicId(nextTopics[0]?.id ?? "addition");
  }

  function startQuiz() {
    if (!activeTopic) return;
    saveQuizProblems([]);
    saveQuizConfig({
      topicId: activeTopic.id,
      grade,
      difficulty,
      problemCount,
      timed,
      timeLimitSeconds: timed ? problemCount * 30 : undefined,
      mode: "practice",
    });
    router.push("/quiz");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-teal-400 to-emerald-500 p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl" />
        <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
          Math Adventure
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
          수학탐험
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-white/90">
          학년과 유형을 고르고, 바로 풀어보세요. 틀려도 괜찮아요 — 짧은 해설과
          함께 다시 도전할 수 있어요.
        </p>
      </section>

      <section className="card-panel">
        <h2 className="section-title">학년 선택</h2>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGradeChange(g)}
              className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                grade === g
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-teal-50 text-teal-900 hover:bg-teal-100"
              }`}
            >
              {gradeLabel(g)}
            </button>
          ))}
        </div>
      </section>

      <section className="card-panel">
        <h2 className="section-title">무엇을 연습할까요?</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setTopicId(topic.id)}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                activeTopic?.id === topic.id
                  ? "border-teal-500 bg-teal-50 shadow-sm"
                  : "border-transparent bg-sky-50/80 hover:border-teal-200"
              }`}
            >
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-teal-950">
                {topic.name}
              </p>
              <p className="mt-1 text-sm text-teal-800/70">{topic.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="card-panel">
        <h2 className="section-title">난이도</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDifficulty(d.id)}
              className={`rounded-xl px-3 py-3 transition ${
                difficulty === d.id
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-950 hover:bg-emerald-100"
              }`}
            >
              <span className="block text-sm font-bold">{d.label}</span>
              <span className="block text-xs opacity-80">{d.hint}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-teal-900">
            문제 수
            <select
              value={problemCount}
              onChange={(e) => setProblemCount(Number(e.target.value))}
              className="rounded-lg border border-teal-200 bg-white px-3 py-2"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n}문제
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold text-teal-900">
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
            제한 시간 모드
          </label>
        </div>
      </section>

      <button type="button" onClick={startQuiz} className="btn-primary w-full py-4 text-xl">
        {activeTopic?.name ?? "연습"} 시작하기
      </button>
    </div>
  );
}
