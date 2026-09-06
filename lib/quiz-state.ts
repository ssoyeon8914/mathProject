import type { Difficulty, Grade, Problem, QuizSession } from "@/types/problem";

const QUIZ_CONFIG_KEY = "math-kids:quiz-config";
const QUIZ_PROBLEMS_KEY = "math-kids:quiz-problems";
const QUIZ_SESSION_KEY = "math-kids:quiz-session";

export type QuizConfig = {
  topicId: string;
  grade: Grade;
  difficulty: Difficulty;
  problemCount: number;
  timed: boolean;
  timeLimitSeconds?: number;
  /** When replaying wrong notes */
  mode?: "practice" | "wrong-notes";
  wrongNoteIds?: string[];
};

function canUse(): boolean {
  return typeof window !== "undefined";
}

export function saveQuizConfig(config: QuizConfig): void {
  if (!canUse()) return;
  sessionStorage.setItem(QUIZ_CONFIG_KEY, JSON.stringify(config));
}

export function loadQuizConfig(): QuizConfig | null {
  if (!canUse()) return null;
  const raw = sessionStorage.getItem(QUIZ_CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizConfig;
  } catch {
    return null;
  }
}

export function saveQuizProblems(problems: Problem[]): void {
  if (!canUse()) return;
  sessionStorage.setItem(QUIZ_PROBLEMS_KEY, JSON.stringify(problems));
}

export function loadQuizProblems(): Problem[] | null {
  if (!canUse()) return null;
  const raw = sessionStorage.getItem(QUIZ_PROBLEMS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Problem[];
  } catch {
    return null;
  }
}

export function saveQuizSession(session: QuizSession): void {
  if (!canUse()) return;
  sessionStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session));
}

export function loadQuizSession(): QuizSession | null {
  if (!canUse()) return null;
  const raw = sessionStorage.getItem(QUIZ_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizSession;
  } catch {
    return null;
  }
}
