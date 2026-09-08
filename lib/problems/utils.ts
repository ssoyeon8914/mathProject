import type { Difficulty } from "@/types/problem";

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createProblemId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Digits / magnitude ranges by difficulty for whole-number ops */
export function wholeNumberRange(
  difficulty: Difficulty,
  grade: number,
): { min: number; max: number } {
  const gradeBoost = Math.max(0, grade - 1);

  switch (difficulty) {
    case "easy":
      return { min: 1, max: Math.min(20 + gradeBoost * 5, 50) };
    case "medium":
      return { min: 5, max: Math.min(50 + gradeBoost * 20, 200) };
    case "hard":
      return { min: 10, max: Math.min(100 + gradeBoost * 50, 999) };
  }
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

export function formatFraction(num: number, den: number): string {
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

/** 부동소수점 오차 없이 소수를 자릿수에 맞춰 반올림해 숫자로 반환 */
export function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** 불필요한 0을 제거한 소수 문자열 (채점용 정규 문자열) */
export function formatDecimal(value: number, digits = 2): string {
  return String(roundTo(value, digits));
}

export function pickFrom<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}
