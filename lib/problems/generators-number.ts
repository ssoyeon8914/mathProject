import type { Difficulty, Grade, Problem } from "@/types/problem";
import {
  createProblemId,
  formatDecimal,
  formatFraction,
  gcd,
  lcm,
  pickFrom,
  randomInt,
  simplifyFraction,
} from "./utils";

type Generator = (grade: Grade, difficulty: Difficulty) => Problem;

// ── 소수 뺄셈 ─────────────────────────────────────────────────
function generateDecimalSub(_grade: Grade, difficulty: Difficulty): Problem {
  const scale = difficulty === "hard" ? 100 : 10;
  const digits = difficulty === "hard" ? 2 : 1;
  const a = randomInt(scale / 5, scale * (difficulty === "easy" ? 5 : 9));
  const b = randomInt(1, a);
  const answer = (a - b) / scale;
  const fa = (a / scale).toFixed(digits);
  const fb = (b / scale).toFixed(digits);
  return {
    id: createProblemId("dsub"),
    topicId: "decimal-sub",
    prompt: `${Number(fa)} − ${Number(fb)} = ?`,
    answer: formatDecimal(answer, digits),
    displayAnswer: formatDecimal(answer, digits),
    explanation: `소수점끼리 맞추어 빼면 ${Number(fa)} − ${Number(fb)} = ${formatDecimal(answer, digits)}이에요.`,
    inputType: "number",
    allowDecimalInput: true,
  };
}

// ── 소수 곱셈 ─────────────────────────────────────────────────
function generateDecimalMul(_grade: Grade, difficulty: Difficulty): Problem {
  const aTenths = randomInt(2, difficulty === "easy" ? 20 : 99);
  const a = aTenths / 10;
  let prompt: string;
  let answer: number;
  let digits: number;
  if (difficulty === "hard") {
    const bTenths = randomInt(2, 40);
    const b = bTenths / 10;
    answer = (aTenths * bTenths) / 100;
    digits = 2;
    prompt = `${Number(a.toFixed(1))} × ${Number(b.toFixed(1))} = ?`;
  } else {
    const b = randomInt(2, difficulty === "easy" ? 5 : 9);
    answer = (aTenths * b) / 10;
    digits = 1;
    prompt = `${Number(a.toFixed(1))} × ${b} = ?`;
  }
  return {
    id: createProblemId("dmul"),
    topicId: "decimal-mul",
    prompt,
    answer: formatDecimal(answer, digits),
    displayAnswer: formatDecimal(answer, digits),
    explanation: `자연수처럼 곱한 뒤 소수점을 찍으면 ${formatDecimal(answer, digits)}이에요.`,
    inputType: "number",
    allowDecimalInput: true,
  };
}

// ── 소수 나눗셈 ───────────────────────────────────────────────
function generateDecimalDiv(_grade: Grade, difficulty: Difficulty): Problem {
  const divisor = randomInt(2, difficulty === "easy" ? 5 : 9);
  const quotientTenths = randomInt(2, difficulty === "hard" ? 99 : 40);
  const quotient = quotientTenths / 10;
  const dividend = (quotientTenths * divisor) / 10;
  return {
    id: createProblemId("ddiv"),
    topicId: "decimal-div",
    prompt: `${Number(dividend.toFixed(1))} ÷ ${divisor} = ?`,
    answer: formatDecimal(quotient, 1),
    displayAnswer: formatDecimal(quotient, 1),
    explanation: `몫의 소수점은 나누어지는 수의 소수점 위치에 맞추어 찍어요. ${Number(dividend.toFixed(1))} ÷ ${divisor} = ${formatDecimal(quotient, 1)}이에요.`,
    inputType: "number",
    allowDecimalInput: true,
  };
}

// ── 이분모 분수 덧셈/뺄셈 ─────────────────────────────────────
function makeUnlikeDenominators(difficulty: Difficulty): [number, number] {
  const pool = difficulty === "easy" ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8, 9, 10, 12];
  const d1 = pickFrom(pool);
  let d2 = pickFrom(pool);
  let guard = 0;
  while (d1 === d2 && guard < 10) {
    d2 = pickFrom(pool);
    guard += 1;
  }
  if (d1 === d2) d2 = d1 === 2 ? 3 : 2;
  return [d1, d2];
}

function generateFractionAddUnlike(_grade: Grade, difficulty: Difficulty): Problem {
  const [d1, d2] = makeUnlikeDenominators(difficulty);
  const n1 = randomInt(1, d1 - 1);
  const n2 = randomInt(1, d2 - 1);
  const commonDen = lcm(d1, d2);
  const sumNum = n1 * (commonDen / d1) + n2 * (commonDen / d2);
  const simplified = simplifyFraction(sumNum, commonDen);
  // keep result a proper (non-whole) fraction
  if (simplified.den === 1 || sumNum >= commonDen) {
    return generateFractionAddUnlike(_grade, difficulty);
  }
  return {
    id: createProblemId("fau"),
    topicId: "fraction-add-unlike",
    prompt: `${n1}/${d1} + ${n2}/${d2} = ?`,
    answer: formatFraction(simplified.num, simplified.den),
    displayAnswer: formatFraction(simplified.num, simplified.den),
    explanation: `통분하면 ${n1 * (commonDen / d1)}/${commonDen} + ${n2 * (commonDen / d2)}/${commonDen} = ${sumNum}/${commonDen}이고, 약분하면 ${formatFraction(simplified.num, simplified.den)}이에요.`,
    inputType: "fraction",
  };
}

function generateFractionSubUnlike(_grade: Grade, difficulty: Difficulty): Problem {
  const [d1, d2] = makeUnlikeDenominators(difficulty);
  const commonDen = lcm(d1, d2);
  const n1 = randomInt(1, d1 - 1);
  const n2 = randomInt(1, d2 - 1);
  const num1 = n1 * (commonDen / d1);
  const num2 = n2 * (commonDen / d2);
  if (num1 <= num2) {
    return generateFractionSubUnlike(_grade, difficulty);
  }
  const diff = num1 - num2;
  const simplified = simplifyFraction(diff, commonDen);
  if (simplified.den === 1) {
    return generateFractionSubUnlike(_grade, difficulty);
  }
  return {
    id: createProblemId("fsu"),
    topicId: "fraction-sub-unlike",
    prompt: `${n1}/${d1} − ${n2}/${d2} = ?`,
    answer: formatFraction(simplified.num, simplified.den),
    displayAnswer: formatFraction(simplified.num, simplified.den),
    explanation: `통분하면 ${num1}/${commonDen} − ${num2}/${commonDen} = ${diff}/${commonDen}이고, 약분하면 ${formatFraction(simplified.num, simplified.den)}이에요.`,
    inputType: "fraction",
  };
}

// ── 분수 곱셈 ─────────────────────────────────────────────────
function generateFractionMul(_grade: Grade, difficulty: Difficulty): Problem {
  const max = difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 12;
  const d1 = randomInt(2, max);
  const d2 = randomInt(2, max);
  const n1 = randomInt(1, d1 - 1);
  const n2 = randomInt(1, d2 - 1);
  const simplified = simplifyFraction(n1 * n2, d1 * d2);
  if (simplified.den === 1) {
    return generateFractionMul(_grade, difficulty);
  }
  return {
    id: createProblemId("fmul"),
    topicId: "fraction-mul",
    prompt: `${n1}/${d1} × ${n2}/${d2} = ?`,
    answer: formatFraction(simplified.num, simplified.den),
    displayAnswer: formatFraction(simplified.num, simplified.den),
    explanation: `분자는 분자끼리, 분모는 분모끼리 곱하면 ${n1 * n2}/${d1 * d2}이고, 약분하면 ${formatFraction(simplified.num, simplified.den)}이에요.`,
    inputType: "fraction",
  };
}

// ── 분수 나눗셈 ───────────────────────────────────────────────
function generateFractionDiv(_grade: Grade, difficulty: Difficulty): Problem {
  const max = difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 12;
  const d1 = randomInt(2, max);
  const d2 = randomInt(2, max);
  const n1 = randomInt(1, d1 - 1);
  const n2 = randomInt(1, d2 - 1);
  // (n1/d1) ÷ (n2/d2) = (n1*d2)/(d1*n2)
  const simplified = simplifyFraction(n1 * d2, d1 * n2);
  if (simplified.den === 1) {
    return generateFractionDiv(_grade, difficulty);
  }
  return {
    id: createProblemId("fdiv"),
    topicId: "fraction-div",
    prompt: `${n1}/${d1} ÷ ${n2}/${d2} = ?`,
    answer: formatFraction(simplified.num, simplified.den),
    displayAnswer: formatFraction(simplified.num, simplified.den),
    explanation: `나눗셈은 뒤 분수를 뒤집어 곱해요. ${n1}/${d1} × ${d2}/${n2} = ${n1 * d2}/${d1 * n2}이고, 약분하면 ${formatFraction(simplified.num, simplified.den)}이에요.`,
    inputType: "fraction",
  };
}

// ── 자연수의 혼합 계산 ────────────────────────────────────────
function generateMixedCalc(_grade: Grade, difficulty: Difficulty): Problem {
  const hi = difficulty === "easy" ? 9 : difficulty === "medium" ? 12 : 20;
  const a = randomInt(2, hi);
  const b = randomInt(2, hi);
  const c = randomInt(2, 9);
  type Tmpl = { prompt: string; answer: number };
  const templates: Tmpl[] = [
    { prompt: `${a} + ${b} × ${c} = ?`, answer: a + b * c },
    { prompt: `${a} × ${b} − ${c} = ?`, answer: a * b - c },
    { prompt: `(${a} + ${b}) × ${c} = ?`, answer: (a + b) * c },
    { prompt: `${a * c} ÷ ${c} + ${b} = ?`, answer: a + b },
    { prompt: `${a} + ${b * c} ÷ ${c} = ?`, answer: a + b },
  ];
  const t = pickFrom(templates);
  if (t.answer < 0) return generateMixedCalc(_grade, difficulty);
  return {
    id: createProblemId("mix"),
    topicId: "mixed-calc",
    prompt: t.prompt,
    answer: String(t.answer),
    displayAnswer: String(t.answer),
    explanation: `곱셈·나눗셈을 먼저, 덧셈·뺄셈을 나중에 계산해요. ( )가 있으면 ( )부터 계산해요. 답은 ${t.answer}이에요.`,
    inputType: "number",
  };
}

// ── 약수와 배수 ───────────────────────────────────────────────
function divisorCount(n: number): number {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) count += 1;
  }
  return count;
}

function generateFactorsMultiples(_grade: Grade, difficulty: Difficulty): Problem {
  const hi = difficulty === "easy" ? 12 : difficulty === "medium" ? 20 : 40;
  const a = randomInt(4, hi);
  const b = randomInt(4, hi);
  const kind = pickFrom(["gcd", "lcm", "divisors"] as const);
  if (kind === "gcd") {
    const answer = gcd(a, b);
    return {
      id: createProblemId("fac"),
      topicId: "factors-multiples",
      prompt: `${a}와(과) ${b}의 최대공약수는 얼마일까요?`,
      answer: String(answer),
      displayAnswer: String(answer),
      explanation: `${a}와 ${b}의 공약수 중 가장 큰 수는 ${answer}이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "lcm") {
    const answer = lcm(a, b);
    return {
      id: createProblemId("fac"),
      topicId: "factors-multiples",
      prompt: `${a}와(과) ${b}의 최소공배수는 얼마일까요?`,
      answer: String(answer),
      displayAnswer: String(answer),
      explanation: `${a}와 ${b}의 공배수 중 가장 작은 수는 ${answer}이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const answer = divisorCount(a);
  return {
    id: createProblemId("fac"),
    topicId: "factors-multiples",
    prompt: `${a}의 약수는 모두 몇 개일까요?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `${a}을(를) 나누어떨어지게 하는 수의 개수는 ${answer}개예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 어림하기(올림·버림·반올림) ────────────────────────────────
function generateRounding(_grade: Grade, difficulty: Difficulty): Problem {
  const place = difficulty === "easy" ? 10 : pickFrom([10, 100]);
  const placeLabel = place === 10 ? "십의 자리" : "백의 자리";
  const value = randomInt(place === 10 ? 12 : 120, place === 10 ? 989 : 9899);
  const kind = pickFrom(["round", "ceil", "floor"] as const);
  let answer: number;
  let name: string;
  if (kind === "round") {
    answer = Math.round(value / place) * place;
    name = "반올림";
  } else if (kind === "ceil") {
    answer = Math.ceil(value / place) * place;
    name = "올림";
  } else {
    answer = Math.floor(value / place) * place;
    name = "버림";
  }
  return {
    id: createProblemId("round"),
    topicId: "rounding",
    prompt: `${value}을(를) ${name}하여 ${placeLabel}까지 나타내면 얼마일까요?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `${value}을(를) ${placeLabel}까지 ${name}하면 ${answer}이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 분수와 소수의 관계 ────────────────────────────────────────
function generateFractionDecimal(_grade: Grade, difficulty: Difficulty): Problem {
  const dens = difficulty === "easy" ? [2, 4, 5, 10] : [2, 4, 5, 8, 20, 25];
  const den = pickFrom(dens);
  const num = randomInt(1, den - 1);
  const value = num / den;
  const simplified = simplifyFraction(num, den);
  return {
    id: createProblemId("fd"),
    topicId: "fraction-decimal",
    prompt: `${simplified.num}/${simplified.den}을(를) 소수로 나타내면 얼마일까요?`,
    answer: formatDecimal(value, 3),
    displayAnswer: formatDecimal(value, 3),
    explanation: `${simplified.num} ÷ ${simplified.den} = ${formatDecimal(value, 3)}이에요.`,
    inputType: "number",
    allowDecimalInput: true,
    promptLayout: "story",
  };
}

export const NUMBER_GENERATORS: Record<string, Generator> = {
  "decimal-sub": generateDecimalSub,
  "decimal-mul": generateDecimalMul,
  "decimal-div": generateDecimalDiv,
  "fraction-add-unlike": generateFractionAddUnlike,
  "fraction-sub-unlike": generateFractionSubUnlike,
  "fraction-mul": generateFractionMul,
  "fraction-div": generateFractionDiv,
  "mixed-calc": generateMixedCalc,
  "factors-multiples": generateFactorsMultiples,
  rounding: generateRounding,
  "fraction-decimal": generateFractionDecimal,
};
