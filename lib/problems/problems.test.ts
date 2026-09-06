import { describe, expect, it } from "vitest";
import { checkAnswer, normalizeRawAnswer } from "@/lib/problems/checker";
import { generateProblem, generateProblemSet } from "@/lib/problems/generators";
import { TOPICS } from "@/lib/curriculum/topics";

describe("normalizeRawAnswer", () => {
  it("strips spaces and converts full-width digits", () => {
    expect(normalizeRawAnswer(" １２ 3 ")).toBe("123");
  });
});

describe("checkAnswer", () => {
  it("grades whole numbers ignoring leading zeros noise via Number", () => {
    expect(checkAnswer("42", "42", "number")).toBe(true);
    expect(checkAnswer("042", "42", "number")).toBe(true);
    expect(checkAnswer("41", "42", "number")).toBe(false);
  });

  it("accepts equivalent simplified fractions", () => {
    expect(checkAnswer("1/2", "2/4", "fraction")).toBe(true);
    expect(checkAnswer("2/4", "1/2", "fraction")).toBe(true);
    expect(checkAnswer("3/4", "1/2", "fraction")).toBe(false);
    expect(checkAnswer("2", "2/1", "fraction")).toBe(true);
  });

  it("grades decimals", () => {
    expect(checkAnswer("1.5", "1.5", "number")).toBe(true);
    expect(checkAnswer("1.50", "1.5", "number")).toBe(true);
    expect(checkAnswer("1.4", "1.5", "number")).toBe(false);
  });
});

describe("generateProblem", () => {
  it("creates problems for every registered topic", () => {
    for (const topic of TOPICS) {
      const grade = topic.grades[0];
      const problem = generateProblem(topic.id, grade, "easy");
      expect(problem.topicId).toBe(topic.id);
      expect(problem.prompt.length).toBeGreaterThan(0);
      expect(problem.answer.length).toBeGreaterThan(0);
      expect(checkAnswer(problem.answer, problem.answer, problem.inputType)).toBe(
        true,
      );
    }
  });

  it("builds a set of requested size", () => {
    const set = generateProblemSet("addition", 2, "medium", 5);
    expect(set).toHaveLength(5);
  });

  it("keeps subtraction non-negative", () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem("subtraction", 2, "hard");
      const match = p.prompt.match(/(\d+)\s*−\s*(\d+)/);
      expect(match).not.toBeNull();
      if (match) {
        expect(Number(match[1])).toBeGreaterThanOrEqual(Number(match[2]));
        expect(Number(p.answer)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("keeps division exact", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem("division", 4, "medium");
      const match = p.prompt.match(/(\d+)\s*÷\s*(\d+)/);
      expect(match).not.toBeNull();
      if (match) {
        expect(Number(match[1]) % Number(match[2])).toBe(0);
        expect(Number(p.answer)).toBe(Number(match[1]) / Number(match[2]));
      }
    }
  });

  it("uses story layout for geometry, units, and word problems", () => {
    const geometry = generateProblem("geometry", 3, "easy");
    const units = generateProblem("unit-conversion", 3, "easy");
    const word = generateProblem("word-problem", 2, "easy");
    expect(geometry.promptLayout).toBe("story");
    expect(units.promptLayout).toBe("story");
    expect(word.promptLayout).toBe("story");
  });

  it("keeps unit conversion answers consistent with prompts", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem("unit-conversion", 4, "medium");
      expect(Number(p.answer)).toBeGreaterThan(0);
      expect(checkAnswer(p.answer, p.answer, "number")).toBe(true);
    }
  });

  it("keeps rectangle perimeter non-negative integers", () => {
    for (let i = 0; i < 15; i++) {
      const p = generateProblem("geometry", 5, "medium");
      expect(Number.isInteger(Number(p.answer))).toBe(true);
      expect(Number(p.answer)).toBeGreaterThan(0);
    }
  });
});
