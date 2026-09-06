import type { Difficulty, Grade, QuizSession } from "@/types/problem";
import { generateProblemSet } from "@/lib/problems";

export const DEFAULT_PROBLEM_COUNT = 10;

export function createQuizSession(params: {
  topicId: string;
  grade: Grade;
  difficulty: Difficulty;
  problemCount?: number;
  timed?: boolean;
  timeLimitSeconds?: number;
}): { session: QuizSession; problemIds: string[] } {
  const problemCount = params.problemCount ?? DEFAULT_PROBLEM_COUNT;
  const problems = generateProblemSet(
    params.topicId,
    params.grade,
    params.difficulty,
    problemCount,
  );

  const session: QuizSession = {
    id: `session-${Date.now().toString(36)}`,
    topicId: params.topicId,
    grade: params.grade,
    difficulty: params.difficulty,
    problemCount,
    attempts: [],
    startedAt: Date.now(),
    timed: params.timed,
    timeLimitSeconds: params.timeLimitSeconds,
  };

  return { session, problemIds: problems.map((p) => p.id) };
}
