"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NumberKeypad } from "@/components/NumberKeypad";
import { ProgressBar } from "@/components/ProgressBar";
import { FeedbackBanner } from "@/components/FeedbackBanner";
import { FractionDisplay } from "@/components/FractionDisplay";
import { checkAnswer } from "@/lib/problems";
import { generateProblemSet } from "@/lib/problems/generators";
import {
  loadQuizConfig,
  loadQuizProblems,
  saveQuizProblems,
  saveQuizSession,
  type QuizConfig,
} from "@/lib/quiz-state";
import {
  addWrongNotesFromAttempts,
  buildScoreFromSession,
  getAllWrongNotes,
  markWrongNoteResolved,
  saveLastSession,
  saveScoreRecord,
} from "@/lib/storage";
import type { Attempt, Problem, QuizSession } from "@/types/problem";

export function QuizClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [index, setIndex] = useState(0);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [fracNum, setFracNum] = useState("");
  const [fracDen, setFracDen] = useState("");
  const [fracPart, setFracPart] = useState<"num" | "den">("num");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
    displayAnswer: string;
  } | null>(null);
  const [streak, setStreak] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const cfg = loadQuizConfig();
    if (!cfg) {
      router.replace("/");
      return;
    }

    let loaded = loadQuizProblems();
    if (!loaded || loaded.length === 0) {
      if (cfg.mode === "wrong-notes" && cfg.wrongNoteIds?.length) {
        const notes = getAllWrongNotes().filter((n) =>
          cfg.wrongNoteIds!.includes(n.id),
        );
        loaded = notes.map((n) => ({
          id: n.id,
          topicId: n.topicId,
          prompt: n.prompt,
          answer: n.correctAnswer,
          displayAnswer: n.displayAnswer,
          explanation: n.explanation,
          inputType: n.inputType,
          promptLayout: n.promptLayout ?? "story",
        }));
      } else {
        loaded = generateProblemSet(
          cfg.topicId,
          cfg.grade,
          cfg.difficulty,
          cfg.problemCount,
        );
      }
      if (!loaded.length) {
        router.replace(cfg.mode === "wrong-notes" ? "/notes" : "/");
        return;
      }
      saveQuizProblems(loaded);
    }

    const newSession: QuizSession = {
      id: `session-${Date.now().toString(36)}`,
      topicId: cfg.topicId,
      grade: cfg.grade,
      difficulty: cfg.difficulty,
      problemCount: loaded.length,
      attempts: [],
      startedAt: Date.now(),
      timed: cfg.timed,
      timeLimitSeconds: cfg.timeLimitSeconds,
    };

    setConfig(cfg);
    setProblems(loaded);
    setSession(newSession);
    if (cfg.timed && cfg.timeLimitSeconds) {
      setSecondsLeft(cfg.timeLimitSeconds);
    }
    setReady(true);
  }, [router]);

  const current = problems[index];
  const isFraction = current?.inputType === "fraction";
  const showDecimal = current?.topicId === "decimal-add";

  const finishQuiz = useCallback(
    (finalSession: QuizSession) => {
      const finished: QuizSession = {
        ...finalSession,
        finishedAt: Date.now(),
      };
      saveQuizSession(finished);
      saveLastSession(finished);
      saveScoreRecord(buildScoreFromSession(finished));
      addWrongNotesFromAttempts(finished.attempts);

      if (config?.mode === "wrong-notes") {
        finished.attempts
          .filter((a) => a.isCorrect)
          .forEach((a) => markWrongNoteResolved(a.problemId));
      }

      router.push("/result");
    },
    [config?.mode, router],
  );

  useEffect(() => {
    if (!ready || secondsLeft === null || feedback) return;
    if (secondsLeft <= 0 && session) {
      finishQuiz(session);
      return;
    }
    const timer = window.setTimeout(() => {
      setSecondsLeft((s) => (s === null ? s : s - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [ready, secondsLeft, feedback, session, finishQuiz]);

  useEffect(() => {
    if (!ready || feedback) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key >= "0" && event.key <= "9") {
        event.preventDefault();
        appendDigit(event.key);
        return;
      }
      if (event.key === "." && showDecimal) {
        event.preventDefault();
        addDecimal();
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
        return;
      }
      if (event.key === "/" && isFraction) {
        event.preventDefault();
        setFracPart("den");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keypad helpers close over latest input state
  }, [ready, feedback, isFraction, showDecimal, answer, fracNum, fracDen, fracPart]);

  const displayValue = useMemo(() => {
    if (!current) return "";
    if (isFraction) return "";
    return answer;
  }, [answer, current, isFraction]);

  function resetInputs() {
    setAnswer("");
    setFracNum("");
    setFracDen("");
    setFracPart("num");
    setFeedback(null);
  }

  function appendDigit(digit: string) {
    if (feedback) return;
    if (isFraction) {
      if (fracPart === "num") setFracNum((v) => (v + digit).slice(0, 4));
      else setFracDen((v) => (v + digit).slice(0, 4));
      return;
    }
    setAnswer((v) => (v + digit).slice(0, 8));
  }

  function backspace() {
    if (feedback) return;
    if (isFraction) {
      if (fracPart === "num") setFracNum((v) => v.slice(0, -1));
      else setFracDen((v) => v.slice(0, -1));
      return;
    }
    setAnswer((v) => v.slice(0, -1));
  }

  function clearAll() {
    if (feedback) return;
    if (isFraction) {
      setFracNum("");
      setFracDen("");
      return;
    }
    setAnswer("");
  }

  function addDecimal() {
    if (feedback || isFraction) return;
    setAnswer((v) => (v.includes(".") ? v : `${v || "0"}.`));
  }

  function submit() {
    if (!current || !session || feedback) return;

    const userAnswer = isFraction
      ? fracNum && fracDen
        ? `${fracNum}/${fracDen}`
        : ""
      : answer;

    if (!userAnswer || (isFraction && (!fracNum || !fracDen))) return;

    const isCorrect = checkAnswer(userAnswer, current.answer, current.inputType);
    const attempt: Attempt = {
      problemId: current.id,
      topicId: current.topicId,
      prompt: current.prompt,
      userAnswer,
      correctAnswer: current.answer,
      displayAnswer: current.displayAnswer,
      isCorrect,
      explanation: current.explanation,
      answeredAt: Date.now(),
      inputType: current.inputType,
      promptLayout: current.promptLayout,
    };

    const nextSession: QuizSession = {
      ...session,
      attempts: [...session.attempts, attempt],
    };
    setSession(nextSession);
    setStreak(isCorrect ? streak + 1 : 0);
    setFeedback({
      isCorrect,
      explanation: current.explanation,
      displayAnswer: current.displayAnswer,
    });
  }

  function goNext() {
    if (!session) return;
    const nextIndex = index + 1;
    if (nextIndex >= problems.length) {
      finishQuiz(session);
      return;
    }
    setIndex(nextIndex);
    resetInputs();
  }

  if (!ready || !current || !session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-teal-900/70">
        문제를 준비하고 있어요…
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-6">
      <ProgressBar
        completed={session.attempts.length}
        total={problems.length}
        currentLabel={index + 1}
      />

      <div className="flex items-center justify-between text-sm font-semibold text-teal-900/60">
        <span>
          {streak > 1 ? `연속 정답 ${streak}개!` : "차근차근 풀어봐요"}
        </span>
        {secondsLeft !== null && (
          <span
            className={`rounded-full px-3 py-1 ${
              secondsLeft <= 10
                ? "bg-amber-100 text-amber-800"
                : "bg-teal-50 text-teal-800"
            }`}
            aria-live="polite"
          >
            {Math.floor(secondsLeft / 60)}:
            {String(secondsLeft % 60).padStart(2, "0")}
          </span>
        )}
      </div>

      <section className="card-panel animate-fade-in">
        <p className="mb-2 text-sm font-semibold text-teal-700">문제 {index + 1}</p>
        <p
          className={`font-[family-name:var(--font-display)] text-center font-bold tracking-tight text-teal-950 ${
            current.promptLayout === "story"
              ? "text-xl leading-relaxed sm:text-2xl"
              : "text-4xl sm:text-5xl"
          }`}
        >
          {current.prompt}
        </p>

        <div className="mt-8 flex min-h-[6rem] items-center justify-center">
          {isFraction ? (
            <FractionDisplay
              numerator={fracNum}
              denominator={fracDen}
              activePart={fracPart}
              onSelectPart={setFracPart}
            />
          ) : (
            <div
              className="min-w-[8rem] rounded-2xl bg-sky-50 px-6 py-4 text-center text-4xl font-bold tabular-nums text-teal-950 ring-2 ring-teal-100"
              aria-live="polite"
            >
              {displayValue || "?"}
            </div>
          )}
        </div>
      </section>

      {feedback ? (
        <FeedbackBanner
          isCorrect={feedback.isCorrect}
          explanation={feedback.explanation}
          displayAnswer={feedback.displayAnswer}
          onNext={goNext}
          isLast={index >= problems.length - 1}
        />
      ) : (
        <>
          <NumberKeypad
            onDigit={appendDigit}
            onBackspace={backspace}
            onClear={clearAll}
            onDecimal={addDecimal}
            showDecimal={showDecimal}
          />
          <button
            type="button"
            onClick={submit}
            className="btn-primary w-full text-lg"
            disabled={
              isFraction ? !fracNum || !fracDen : answer.length === 0
            }
          >
            정답 확인
          </button>
        </>
      )}
    </div>
  );
}
