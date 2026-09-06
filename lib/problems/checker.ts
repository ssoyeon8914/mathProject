import type { InputType } from "@/types/problem";
import { gcd, simplifyFraction } from "./utils";

/** Strip spaces and full-width digits; normalize commas */
export function normalizeRawAnswer(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, "")
    .replace(/，/g, ",")
    .replace(/．/g, ".")
    .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 0x30));
}

function parseFraction(value: string): { num: number; den: number } | null {
  const normalized = normalizeRawAnswer(value);
  if (!normalized) return null;

  if (normalized.includes("/")) {
    const [n, d] = normalized.split("/");
    const num = Number(n);
    const den = Number(d);
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
    return simplifyFraction(num, den);
  }

  const asNumber = Number(normalized);
  if (!Number.isFinite(asNumber)) return null;
  // whole number as fraction
  return { num: asNumber, den: 1 };
}

function parseNumber(value: string): number | null {
  const normalized = normalizeRawAnswer(value);
  if (!normalized) return null;
  // allow trailing .0
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  inputType: InputType,
): boolean {
  if (inputType === "fraction") {
    const user = parseFraction(userAnswer);
    const correct = parseFraction(correctAnswer);
    if (!user || !correct) return false;
    return user.num === correct.num && user.den === correct.den;
  }

  const user = parseNumber(userAnswer);
  const correct = parseNumber(correctAnswer);
  if (user === null || correct === null) return false;

  // Compare with small epsilon for decimals
  return Math.abs(user - correct) < 1e-9;
}

export function normalizeAnswerForDisplay(
  userAnswer: string,
  inputType: InputType,
): string {
  const normalized = normalizeRawAnswer(userAnswer);
  if (inputType === "fraction") {
    const frac = parseFraction(normalized);
    if (!frac) return normalized;
    if (frac.den === 1) return String(frac.num);
    return `${frac.num}/${frac.den}`;
  }
  const n = parseNumber(normalized);
  return n === null ? normalized : String(n);
}

/** Exported for tests */
export function areEquivalentFractions(a: string, b: string): boolean {
  const left = parseFraction(a);
  const right = parseFraction(b);
  if (!left || !right) return false;
  return left.num * right.den === right.num * left.den && gcd(left.den, right.den) >= 1;
}
