import type { Difficulty, Grade, Problem } from "@/types/problem";
import { createProblemId, pickFrom, randomInt } from "./utils";

type Generator = (grade: Grade, difficulty: Difficulty) => Problem;

const DATASETS = [
  { title: "요일별 읽은 책 수", unit: "권", labels: ["월", "화", "수", "목"] },
  { title: "반별 모은 캔 수", unit: "개", labels: ["1반", "2반", "3반", "4반"] },
  { title: "월별 비 온 날 수", unit: "일", labels: ["3월", "4월", "5월", "6월"] },
  { title: "종류별 좋아하는 과일 수", unit: "명", labels: ["사과", "포도", "딸기", "귤"] },
] as const;

// ── 자료와 그래프 해석 ────────────────────────────────────────
function generateGraphReading(_grade: Grade, difficulty: Difficulty): Problem {
  const set = pickFrom(DATASETS);
  const hi = difficulty === "easy" ? 9 : difficulty === "medium" ? 15 : 25;
  const values = set.labels.map(() => randomInt(1, hi));
  const listing = set.labels
    .map((label, i) => `${label} ${values[i]}${set.unit}`)
    .join(", ");
  const kind = pickFrom(["max", "total", "diff"] as const);

  if (kind === "max") {
    const maxVal = Math.max(...values);
    return {
      id: createProblemId("graph"),
      topicId: "graph-reading",
      prompt: `${set.title} — ${listing}. 가장 큰 값은 얼마일까요?`,
      answer: String(maxVal),
      displayAnswer: `${maxVal}${set.unit}`,
      explanation: `자료 중 가장 큰 값은 ${maxVal}${set.unit}이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "total") {
    const total = values.reduce((a, b) => a + b, 0);
    return {
      id: createProblemId("graph"),
      topicId: "graph-reading",
      prompt: `${set.title} — ${listing}. 모두 합하면 얼마일까요?`,
      answer: String(total),
      displayAnswer: `${total}${set.unit}`,
      explanation: `${values.join(" + ")} = ${total}${set.unit}이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  return {
    id: createProblemId("graph"),
    topicId: "graph-reading",
    prompt: `${set.title} — ${listing}. 가장 큰 값과 가장 작은 값의 차는 얼마일까요?`,
    answer: String(maxVal - minVal),
    displayAnswer: `${maxVal - minVal}${set.unit}`,
    explanation: `${maxVal} − ${minVal} = ${maxVal - minVal}${set.unit}이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 평균 ──────────────────────────────────────────────────────
function generateAverage(_grade: Grade, difficulty: Difficulty): Problem {
  const count = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
  const mean = randomInt(3, difficulty === "hard" ? 30 : 15);
  // 평균이 정수가 되도록 합을 count의 배수로 구성
  const values: number[] = [];
  let remaining = mean * count;
  for (let i = 0; i < count - 1; i++) {
    const maxPick = Math.min(remaining - (count - 1 - i), mean * 2);
    const v = randomInt(1, Math.max(1, maxPick));
    values.push(v);
    remaining -= v;
  }
  values.push(remaining);
  if (values.some((v) => v <= 0)) return generateAverage(_grade, difficulty);
  const total = values.reduce((a, b) => a + b, 0);
  return {
    id: createProblemId("avg"),
    topicId: "average",
    prompt: `${values.join(", ")}의 평균은 얼마일까요?`,
    answer: String(total / count),
    displayAnswer: String(total / count),
    explanation: `평균 = 자료의 합 ÷ 자료의 수 = ${total} ÷ ${count} = ${total / count}이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 가능성 ────────────────────────────────────────────────────
function generatePossibility(): Problem {
  const scenarios = [
    {
      prompt: "주사위 한 개를 던질 때 7이 나올 가능성을 수로 나타내면? (0, 0.5, 1 중에서)",
      answer: "0",
      explanation: "주사위에는 7이 없으므로 절대 일어나지 않아요. 가능성은 0이에요.",
    },
    {
      prompt: "동전 한 개를 던질 때 그림 면이 나올 가능성을 수로 나타내면? (0, 0.5, 1 중에서)",
      answer: "0.5",
      explanation: "그림 면과 숫자 면의 가능성이 반반이므로 0.5(=1/2)예요.",
    },
    {
      prompt: "주사위 한 개를 던질 때 1 이상 6 이하의 수가 나올 가능성을 수로 나타내면? (0, 0.5, 1 중에서)",
      answer: "1",
      explanation: "주사위 눈은 항상 1~6이므로 반드시 일어나요. 가능성은 1이에요.",
    },
    {
      prompt: "빨간 공만 든 주머니에서 공 한 개를 꺼낼 때 빨간 공이 나올 가능성을 수로 나타내면? (0, 0.5, 1 중에서)",
      answer: "1",
      explanation: "빨간 공만 있으므로 반드시 빨간 공이 나와요. 가능성은 1이에요.",
    },
    {
      prompt: "숫자 카드 1, 2 중에서 한 장을 뽑을 때 1이 나올 가능성을 수로 나타내면? (0, 0.5, 1 중에서)",
      answer: "0.5",
      explanation: "1과 2가 나올 가능성이 반반이므로 0.5(=1/2)예요.",
    },
  ];
  const s = pickFrom(scenarios);
  return {
    id: createProblemId("poss"),
    topicId: "possibility",
    prompt: s.prompt,
    answer: s.answer,
    displayAnswer: s.answer,
    explanation: s.explanation,
    inputType: "number",
    allowDecimalInput: true,
    promptLayout: "story",
  };
}

export const DATA_GENERATORS: Record<string, Generator> = {
  "graph-reading": generateGraphReading,
  average: generateAverage,
  possibility: generatePossibility,
};
