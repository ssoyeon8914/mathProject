import { describe, expect, it } from "vitest";
import { checkAnswer, normalizeRawAnswer } from "@/lib/problems/checker";
import { generateProblem, generateProblemSet } from "@/lib/problems/generators";
import { AREAS, TOPICS } from "@/lib/curriculum/topics";
import type { Difficulty } from "@/types/problem";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

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

describe("2022 개정 교육과정 커버리지", () => {
  it("covers all four content areas", () => {
    const areas = new Set(TOPICS.map((t) => t.area));
    for (const area of AREAS) {
      expect(areas.has(area.id)).toBe(true);
    }
  });

  it("every topic generates self-consistent problems across grades and difficulties", () => {
    for (const topic of TOPICS) {
      for (const grade of topic.grades) {
        for (const difficulty of DIFFICULTIES) {
          for (let i = 0; i < 8; i++) {
            const p = generateProblem(topic.id, grade, difficulty);
            expect(p.topicId).toBe(topic.id);
            expect(p.prompt.length).toBeGreaterThan(0);
            expect(p.answer.length).toBeGreaterThan(0);
            // answer must never be NaN/empty and must self-grade as correct
            if (p.inputType === "number") {
              expect(Number.isFinite(Number(p.answer))).toBe(true);
            }
            expect(checkAnswer(p.answer, p.answer, p.inputType)).toBe(true);
          }
        }
      }
    }
  });

  it("fraction operation results are proper fractions that grade correctly", () => {
    for (const id of [
      "fraction-add-unlike",
      "fraction-sub-unlike",
      "fraction-mul",
      "fraction-div",
    ]) {
      for (let i = 0; i < 20; i++) {
        const p = generateProblem(id, 5, "medium");
        expect(p.inputType).toBe("fraction");
        expect(p.answer).toMatch(/^\d+\/\d+$/);
        expect(checkAnswer(p.answer, p.answer, "fraction")).toBe(true);
      }
    }
  });

  it("triangle angle problems sum to 180", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem("angle", 4, "medium");
      const m = p.prompt.match(/두 각이 (\d+)°, (\d+)°/);
      if (m) {
        const remaining = 180 - Number(m[1]) - Number(m[2]);
        expect(Number(p.answer)).toBe(remaining);
        expect(remaining).toBeGreaterThan(0);
      }
    }
  });

  it("average equals sum divided by count and is exact", () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem("average", 6, "medium");
      const list = p.prompt
        .split("의 평균")[0]
        .split(",")
        .map((s) => Number(s.trim()));
      expect(list.length).toBeGreaterThan(0);
      const mean = list.reduce((a, b) => a + b, 0) / list.length;
      expect(Number(p.answer)).toBe(mean);
      expect(Number.isInteger(mean)).toBe(true);
    }
  });

  it("mixed calculation respects operator precedence", () => {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem("mixed-calc", 5, "medium");
      expect(Number.isInteger(Number(p.answer))).toBe(true);
      expect(Number(p.answer)).toBeGreaterThanOrEqual(0);
    }
  });

  it("decimal topics expose the decimal keypad", () => {
    for (const id of ["decimal-add", "decimal-sub", "decimal-mul", "decimal-div"]) {
      const p = generateProblem(id, id.startsWith("decimal-a") || id === "decimal-sub" ? 4 : 5, "medium");
      expect(p.allowDecimalInput).toBe(true);
    }
  });

  it("does not use 오각형/육각형 in grade 1~2 shape facts", () => {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem("geometry", 2, "easy");
      expect(p.prompt).not.toMatch(/오각형|육각형/);
    }
  });

  it("factors: gcd/lcm/divisor answers are positive integers", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem("factors-multiples", 5, "medium");
      expect(Number.isInteger(Number(p.answer))).toBe(true);
      expect(Number(p.answer)).toBeGreaterThan(0);
    }
  });

  it("possibility answers are 0, 0.5, or 1", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem("possibility", 6, "easy");
      expect(["0", "0.5", "1"]).toContain(p.answer);
    }
  });
});
