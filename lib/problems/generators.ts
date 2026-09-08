import type { Difficulty, Grade, Problem } from "@/types/problem";
import {
  createProblemId,
  formatFraction,
  randomInt,
  simplifyFraction,
  wholeNumberRange,
} from "./utils";
import { EXTRA_GENERATORS } from "./generators-extra";
import { NUMBER_GENERATORS } from "./generators-number";
import { RELATION_GENERATORS } from "./generators-relation";
import { MEASURE_GENERATORS } from "./generators-measure";
import { DATA_GENERATORS } from "./generators-data";

type Generator = (grade: Grade, difficulty: Difficulty) => Problem;

function generateAddition(grade: Grade, difficulty: Difficulty): Problem {
  const range = wholeNumberRange(difficulty, grade);
  let a = randomInt(range.min, range.max);
  let b = randomInt(range.min, range.max);

  // Easy grade 1: keep sums smaller
  if (grade === 1 && difficulty === "easy") {
    a = randomInt(1, 9);
    b = randomInt(1, 10 - a);
  }

  const answer = a + b;
  return {
    id: createProblemId("add"),
    topicId: "addition",
    prompt: `${a} + ${b} = ?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `${a} 더하기 ${b}는 ${answer}이에요.`,
    inputType: "number",
  };
}

function generateSubtraction(grade: Grade, difficulty: Difficulty): Problem {
  const range = wholeNumberRange(difficulty, grade);
  let a = randomInt(range.min, range.max);
  let b = randomInt(range.min, a);

  if (grade === 1 && difficulty === "easy") {
    a = randomInt(2, 10);
    b = randomInt(1, a);
  }

  const answer = a - b;
  return {
    id: createProblemId("sub"),
    topicId: "subtraction",
    prompt: `${a} − ${b} = ?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `${a}에서 ${b}를 빼면 ${answer}이에요.`,
    inputType: "number",
  };
}

function generateMultiplication(grade: Grade, difficulty: Difficulty): Problem {
  let a: number;
  let b: number;

  if (difficulty === "easy") {
    a = randomInt(2, 9);
    b = randomInt(2, grade <= 2 ? 5 : 9);
  } else if (difficulty === "medium") {
    a = randomInt(2, 12);
    b = randomInt(2, 12);
  } else {
    a = randomInt(10, 25);
    b = randomInt(2, 12);
  }

  const answer = a * b;
  return {
    id: createProblemId("mul"),
    topicId: "multiplication",
    prompt: `${a} × ${b} = ?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `${a} 곱하기 ${b}는 ${answer}이에요.`,
    inputType: "number",
  };
}

function generateDivision(grade: Grade, difficulty: Difficulty): Problem {
  let divisor: number;
  let quotient: number;

  if (difficulty === "easy") {
    divisor = randomInt(2, 9);
    quotient = randomInt(2, grade <= 3 ? 5 : 9);
  } else if (difficulty === "medium") {
    divisor = randomInt(2, 12);
    quotient = randomInt(2, 12);
  } else {
    divisor = randomInt(3, 15);
    quotient = randomInt(5, 20);
  }

  const dividend = divisor * quotient;
  return {
    id: createProblemId("div"),
    topicId: "division",
    prompt: `${dividend} ÷ ${divisor} = ?`,
    answer: String(quotient),
    displayAnswer: String(quotient),
    explanation: `${dividend}을(를) ${divisor}(으)로 나누면 ${quotient}이에요.`,
    inputType: "number",
  };
}

function generateFractionAdd(_grade: Grade, difficulty: Difficulty): Problem {
  const denMax = difficulty === "easy" ? 6 : difficulty === "medium" ? 10 : 12;
  const den = randomInt(2, denMax);
  const a = randomInt(1, den - 1);
  const b = randomInt(1, den - a);
  const sum = a + b;
  const simplified = simplifyFraction(sum, den);

  return {
    id: createProblemId("fadd"),
    topicId: "fraction-add",
    prompt: `${a}/${den} + ${b}/${den} = ?`,
    answer: formatFraction(simplified.num, simplified.den),
    displayAnswer: formatFraction(simplified.num, simplified.den),
    explanation:
      simplified.den === den
        ? `분모가 같으면 분자만 더해요. ${a} + ${b} = ${sum}이므로 ${sum}/${den}이에요.`
        : `분자끼리 더하면 ${sum}/${den}이고, 약분하면 ${formatFraction(simplified.num, simplified.den)}이에요.`,
    inputType: "fraction",
  };
}

function generateFractionSub(_grade: Grade, difficulty: Difficulty): Problem {
  const denMax = difficulty === "easy" ? 6 : difficulty === "medium" ? 10 : 12;
  const den = randomInt(2, denMax);
  const a = randomInt(2, den);
  const b = randomInt(1, a - 1);
  const diff = a - b;
  const simplified = simplifyFraction(diff, den);

  return {
    id: createProblemId("fsub"),
    topicId: "fraction-sub",
    prompt: `${a}/${den} − ${b}/${den} = ?`,
    answer: formatFraction(simplified.num, simplified.den),
    displayAnswer: formatFraction(simplified.num, simplified.den),
    explanation:
      simplified.den === den
        ? `분모가 같으면 분자만 빼요. ${a} − ${b} = ${diff}이므로 ${diff}/${den}이에요.`
        : `분자끼리 빼면 ${diff}/${den}이고, 약분하면 ${formatFraction(simplified.num, simplified.den)}이에요.`,
    inputType: "fraction",
  };
}

function generateDecimalAdd(_grade: Grade, difficulty: Difficulty): Problem {
  const tenthsA = randomInt(1, difficulty === "hard" ? 99 : 49);
  const tenthsB = randomInt(1, difficulty === "hard" ? 99 : 49);
  const sumTenths = tenthsA + tenthsB;
  const answer = (sumTenths / 10).toFixed(sumTenths % 10 === 0 ? 0 : 1);

  const formatOne = (t: number) => (t % 10 === 0 ? String(t / 10) : (t / 10).toFixed(1));

  return {
    id: createProblemId("dadd"),
    topicId: "decimal-add",
    prompt: `${formatOne(tenthsA)} + ${formatOne(tenthsB)} = ?`,
    answer: String(Number(answer)),
    displayAnswer: String(Number(answer)),
    explanation: `${formatOne(tenthsA)} 더하기 ${formatOne(tenthsB)}는 ${Number(answer)}이에요.`,
    inputType: "number",
    allowDecimalInput: true,
  };
}

const GENERATORS: Record<string, Generator> = {
  addition: generateAddition,
  subtraction: generateSubtraction,
  multiplication: generateMultiplication,
  division: generateDivision,
  "fraction-add": generateFractionAdd,
  "fraction-sub": generateFractionSub,
  "decimal-add": generateDecimalAdd,
  ...EXTRA_GENERATORS,
  ...NUMBER_GENERATORS,
  ...RELATION_GENERATORS,
  ...MEASURE_GENERATORS,
  ...DATA_GENERATORS,
};

export function generateProblem(
  topicId: string,
  grade: Grade,
  difficulty: Difficulty,
): Problem {
  const generator = GENERATORS[topicId];
  if (!generator) {
    throw new Error(`Unknown topic: ${topicId}`);
  }
  return generator(grade, difficulty);
}

export function generateProblemSet(
  topicId: string,
  grade: Grade,
  difficulty: Difficulty,
  count: number,
): Problem[] {
  return Array.from({ length: count }, () => generateProblem(topicId, grade, difficulty));
}

export { GENERATORS };
