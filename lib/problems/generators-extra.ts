import type { Difficulty, Grade, Problem } from "@/types/problem";
import { createProblemId, randomInt } from "./utils";

type Generator = (grade: Grade, difficulty: Difficulty) => Problem;

function pick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

const SHAPES = [
  { name: "삼각형", sides: 3, vertices: 3 },
  { name: "사각형", sides: 4, vertices: 4 },
  { name: "정사각형", sides: 4, vertices: 4 },
  { name: "직사각형", sides: 4, vertices: 4 },
  { name: "오각형", sides: 5, vertices: 5 },
  { name: "육각형", sides: 6, vertices: 6 },
] as const;

function sideRange(difficulty: Difficulty, grade: Grade): { min: number; max: number } {
  if (difficulty === "easy") return { min: 2, max: grade <= 3 ? 10 : 15 };
  if (difficulty === "medium") return { min: 3, max: grade <= 4 ? 20 : 30 };
  return { min: 5, max: grade <= 4 ? 40 : 50 };
}

function generateShapeFacts(): Problem {
  const shape = pick(SHAPES);
  const askSides = Math.random() < 0.5;
  const answer = askSides ? shape.sides : shape.vertices;
  const label = askSides ? "변" : "꼭짓점";

  return {
    id: createProblemId("geo"),
    topicId: "geometry",
    prompt: `${shape.name}의 ${label}은(는) 몇 개일까요?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `${shape.name}은(는) ${label}이(가) ${answer}개예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

function generatePerimeter(grade: Grade, difficulty: Difficulty): Problem {
  const range = sideRange(difficulty, grade);
  if (Math.random() < 0.45) {
    const side = randomInt(range.min, range.max);
    const answer = side * 4;
    return {
      id: createProblemId("geo"),
      topicId: "geometry",
      prompt: `한 변의 길이가 ${side}cm인 정사각형의 둘레는 몇 cm일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm`,
      explanation: `정사각형 둘레 = 한 변 × 4 이므로 ${side} × 4 = ${answer}cm예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }

  const width = randomInt(range.min, range.max);
  const height = randomInt(range.min, range.max);
  const answer = 2 * (width + height);
  return {
    id: createProblemId("geo"),
    topicId: "geometry",
    prompt: `가로 ${width}cm, 세로 ${height}cm인 직사각형의 둘레는 몇 cm일까요?`,
    answer: String(answer),
    displayAnswer: `${answer}cm`,
    explanation: `직사각형 둘레 = (가로 + 세로) × 2 이므로 (${width} + ${height}) × 2 = ${answer}cm예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

function generateArea(grade: Grade, difficulty: Difficulty): Problem {
  const range = sideRange(difficulty, grade);
  const maxSide = Math.min(range.max, 20);
  if (Math.random() < 0.4) {
    const side = randomInt(range.min, maxSide);
    const answer = side * side;
    return {
      id: createProblemId("geo"),
      topicId: "geometry",
      prompt: `한 변의 길이가 ${side}cm인 정사각형의 넓이는 몇 cm²일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm²`,
      explanation: `정사각형 넓이 = 한 변 × 한 변 이므로 ${side} × ${side} = ${answer}cm²예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }

  const width = randomInt(range.min, maxSide);
  const height = randomInt(range.min, Math.min(range.max, 15));
  const answer = width * height;
  return {
    id: createProblemId("geo"),
    topicId: "geometry",
    prompt: `가로 ${width}cm, 세로 ${height}cm인 직사각형의 넓이는 몇 cm²일까요?`,
    answer: String(answer),
    displayAnswer: `${answer}cm²`,
    explanation: `직사각형 넓이 = 가로 × 세로 이므로 ${width} × ${height} = ${answer}cm²예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

export function generateGeometry(grade: Grade, difficulty: Difficulty): Problem {
  if (grade <= 2) return generateShapeFacts();
  if (grade <= 4) {
    return Math.random() < 0.35 ? generateShapeFacts() : generatePerimeter(grade, difficulty);
  }
  return Math.random() < 0.4
    ? generatePerimeter(grade, difficulty)
    : generateArea(grade, difficulty);
}

type ConversionTemplate = {
  grades: Grade[];
  build: (n: number) => {
    prompt: string;
    answer: number;
    unit: string;
    explanation: string;
  };
};

const CONVERSIONS: ConversionTemplate[] = [
  {
    grades: [2, 3, 4, 5, 6],
    build: (n) => ({
      prompt: `${n}m는 몇 cm일까요?`,
      answer: n * 100,
      unit: "cm",
      explanation: `1m = 100cm이므로 ${n} × 100 = ${n * 100}cm예요.`,
    }),
  },
  {
    grades: [2, 3, 4, 5, 6],
    build: (n) => ({
      prompt: `${n * 100}cm는 몇 m일까요?`,
      answer: n,
      unit: "m",
      explanation: `100cm = 1m이므로 ${n * 100} ÷ 100 = ${n}m예요.`,
    }),
  },
  {
    grades: [2, 3, 4, 5, 6],
    build: (n) => ({
      prompt: `${n}cm는 몇 mm일까요?`,
      answer: n * 10,
      unit: "mm",
      explanation: `1cm = 10mm이므로 ${n} × 10 = ${n * 10}mm예요.`,
    }),
  },
  {
    grades: [3, 4, 5, 6],
    build: (n) => ({
      prompt: `${n}kg는 몇 g일까요?`,
      answer: n * 1000,
      unit: "g",
      explanation: `1kg = 1000g이므로 ${n} × 1000 = ${n * 1000}g예요.`,
    }),
  },
  {
    grades: [3, 4, 5, 6],
    build: (n) => ({
      prompt: `${n * 1000}g는 몇 kg일까요?`,
      answer: n,
      unit: "kg",
      explanation: `1000g = 1kg이므로 ${n * 1000} ÷ 1000 = ${n}kg예요.`,
    }),
  },
  {
    grades: [4, 5, 6],
    build: (n) => ({
      prompt: `${n}L는 몇 mL일까요?`,
      answer: n * 1000,
      unit: "mL",
      explanation: `1L = 1000mL이므로 ${n} × 1000 = ${n * 1000}mL예요.`,
    }),
  },
  {
    grades: [4, 5, 6],
    build: (n) => ({
      prompt: `${n * 1000}mL는 몇 L일까요?`,
      answer: n,
      unit: "L",
      explanation: `1000mL = 1L이므로 ${n * 1000} ÷ 1000 = ${n}L예요.`,
    }),
  },
];

function conversionAmount(difficulty: Difficulty): number {
  if (difficulty === "easy") return randomInt(1, 5);
  if (difficulty === "medium") return randomInt(2, 12);
  return randomInt(3, 15);
}

export function generateUnitConversion(grade: Grade, difficulty: Difficulty): Problem {
  const templates = CONVERSIONS.filter((t) => t.grades.includes(grade));
  const template = pick(templates.length > 0 ? templates : CONVERSIONS);
  const n = conversionAmount(difficulty);
  const built = template.build(n);

  return {
    id: createProblemId("unit"),
    topicId: "unit-conversion",
    prompt: built.prompt,
    answer: String(built.answer),
    displayAnswer: `${built.answer}${built.unit}`,
    explanation: built.explanation,
    inputType: "number",
    promptLayout: "story",
  };
}

type WordBuilder = (grade: Grade, difficulty: Difficulty) => Problem;

function wordAdd(grade: Grade, difficulty: Difficulty): Problem {
  const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 40 : grade <= 2 ? 50 : 100;
  const a = randomInt(2, max);
  const b = randomInt(2, max);
  return {
    id: createProblemId("word"),
    topicId: "word-problem",
    prompt: `연필이 ${a}자루, 지우개가 ${b}개 있어요. 모두 몇 개일까요?`,
    answer: String(a + b),
    displayAnswer: String(a + b),
    explanation: `${a} + ${b} = ${a + b}이므로 모두 ${a + b}개예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

function wordSub(grade: Grade, difficulty: Difficulty): Problem {
  const max = difficulty === "easy" ? 12 : difficulty === "medium" ? 40 : grade <= 2 ? 50 : 100;
  const have = randomInt(grade === 1 ? 5 : 10, max);
  const eat = randomInt(1, Math.max(1, Math.floor(have / 2)));
  const left = have - eat;
  return {
    id: createProblemId("word"),
    topicId: "word-problem",
    prompt: `사과가 ${have}개 있어요. ${eat}개를 먹었어요. 남은 사과는 몇 개일까요?`,
    answer: String(left),
    displayAnswer: String(left),
    explanation: `${have} − ${eat} = ${left}이므로 남은 사과는 ${left}개예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

function wordMul(difficulty: Difficulty): Problem {
  const packs = randomInt(2, difficulty === "hard" ? 9 : 6);
  const each = randomInt(2, difficulty === "hard" ? 12 : 9);
  return {
    id: createProblemId("word"),
    topicId: "word-problem",
    prompt: `한 상자에 사탕이 ${each}개씩 들어 있어요. 상자가 ${packs}개이면 사탕은 모두 몇 개일까요?`,
    answer: String(packs * each),
    displayAnswer: String(packs * each),
    explanation: `${each} × ${packs} = ${packs * each}이므로 모두 ${packs * each}개예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

function wordDiv(difficulty: Difficulty): Problem {
  const each = randomInt(2, difficulty === "hard" ? 12 : 9);
  const groups = randomInt(2, difficulty === "hard" ? 12 : 9);
  const total = each * groups;
  return {
    id: createProblemId("word"),
    topicId: "word-problem",
    prompt: `색종이가 ${total}장 있어요. ${groups}명에게 똑같이 나누어 주려면 한 명에게 몇 장씩 줄까요?`,
    answer: String(each),
    displayAnswer: String(each),
    explanation: `${total} ÷ ${groups} = ${each}이므로 한 명에게 ${each}장씩이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

function wordMoney(difficulty: Difficulty): Problem {
  const unit = randomInt(1, difficulty === "hard" ? 9 : 5) * 100;
  const buy = randomInt(2, difficulty === "hard" ? 8 : 5);
  return {
    id: createProblemId("word"),
    topicId: "word-problem",
    prompt: `공책이 한 권에 ${unit}원이에요. ${buy}권을 사면 얼마일까요?`,
    answer: String(unit * buy),
    displayAnswer: `${unit * buy}원`,
    explanation: `${unit} × ${buy} = ${unit * buy}이므로 ${unit * buy}원이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

function wordReading(difficulty: Difficulty): Problem {
  const pages = randomInt(2, difficulty === "hard" ? 15 : 10);
  const days = randomInt(3, difficulty === "hard" ? 12 : 8);
  return {
    id: createProblemId("word"),
    topicId: "word-problem",
    prompt: `하루 ${pages}쪽씩 ${days}일 동안 책을 읽었어요. 모두 몇 쪽을 읽었을까요?`,
    answer: String(pages * days),
    displayAnswer: String(pages * days),
    explanation: `${pages} × ${days} = ${pages * days}이므로 ${pages * days}쪽이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

export function generateWordProblem(grade: Grade, difficulty: Difficulty): Problem {
  const builders: WordBuilder[] = [wordAdd, wordSub];
  if (grade >= 2) builders.push((_g, d) => wordMul(d), (_g, d) => wordMoney(d));
  if (grade >= 3) builders.push((_g, d) => wordDiv(d));
  if (grade >= 4) builders.push((_g, d) => wordReading(d));
  return pick(builders)(grade, difficulty);
}

export const EXTRA_GENERATORS: Record<string, Generator> = {
  geometry: generateGeometry,
  "unit-conversion": generateUnitConversion,
  "word-problem": generateWordProblem,
};
