import { describe, expect, it } from "vitest";
import {
  buildDashboardSummary,
  buildTopicProgress,
  suggestPracticeDifficulty,
} from "@/lib/dashboard";
import type { ScoreRecord, WrongNoteItem } from "@/types/problem";

function score(
  partial: Partial<ScoreRecord> & Pick<ScoreRecord, "topicId" | "correct" | "total">,
): ScoreRecord {
  return {
    id: `s-${Math.random().toString(36).slice(2, 8)}`,
    grade: 2,
    difficulty: "easy",
    percent: Math.round((partial.correct / partial.total) * 100),
    finishedAt: Date.now(),
    ...partial,
  };
}

describe("buildTopicProgress", () => {
  it("marks low accuracy topics as weak", () => {
    const scores = [
      score({ topicId: "addition", correct: 2, total: 10 }),
      score({ topicId: "addition", correct: 3, total: 10 }),
    ];
    const progress = buildTopicProgress(scores, []);
    const addition = progress.find((t) => t.topicId === "addition");
    expect(addition?.level).toBe("weak");
    expect(addition?.percent).toBe(25);
    expect(addition?.sessions).toBe(2);
  });

  it("marks high accuracy topics as strong", () => {
    const scores = [score({ topicId: "subtraction", correct: 9, total: 10 })];
    const progress = buildTopicProgress(scores, []);
    expect(progress.find((t) => t.topicId === "subtraction")?.level).toBe("strong");
  });

  it("treats many wrong notes as weak even with few sessions", () => {
    const notes: WrongNoteItem[] = Array.from({ length: 3 }, (_, i) => ({
      id: `n-${i}`,
      topicId: "geometry",
      prompt: "q",
      correctAnswer: "1",
      displayAnswer: "1",
      explanation: "e",
      userAnswer: "0",
      inputType: "number",
      savedAt: Date.now(),
      resolved: false,
    }));
    const progress = buildTopicProgress([], notes);
    expect(progress.find((t) => t.topicId === "geometry")?.level).toBe("weak");
  });
});

describe("buildDashboardSummary", () => {
  it("aggregates overall stats and weak list", () => {
    const scores = [
      score({ topicId: "addition", correct: 1, total: 10, finishedAt: 1000 }),
      score({ topicId: "multiplication", correct: 10, total: 10, finishedAt: 2000 }),
    ];
    const summary = buildDashboardSummary(scores, []);
    expect(summary.sessionCount).toBe(2);
    expect(summary.problemCount).toBe(20);
    expect(summary.correctCount).toBe(11);
    expect(summary.topicsTried).toBe(2);
    expect(summary.weakTopics.some((t) => t.topicId === "addition")).toBe(true);
    expect(summary.strongTopics.some((t) => t.topicId === "multiplication")).toBe(
      true,
    );
  });

  it("suggests easy difficulty for weak topics", () => {
    const topic = buildTopicProgress(
      [score({ topicId: "division", correct: 2, total: 10 })],
      [],
    ).find((t) => t.topicId === "division")!;
    expect(suggestPracticeDifficulty(topic)).toBe("easy");
  });
});
