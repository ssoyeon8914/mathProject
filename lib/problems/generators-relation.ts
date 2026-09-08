import type { Difficulty, Grade, Problem } from "@/types/problem";
import { createProblemId, formatDecimal, pickFrom, randomInt } from "./utils";

type Generator = (grade: Grade, difficulty: Difficulty) => Problem;

// ── 규칙 찾기 ─────────────────────────────────────────────────
function generatePattern(_grade: Grade, difficulty: Difficulty): Problem {
  const useMultiply = difficulty !== "easy" && Math.random() < 0.4;
  if (useMultiply) {
    const ratio = randomInt(2, 3);
    const start = randomInt(1, 3);
    const seq = [start];
    for (let i = 1; i < 4; i++) seq.push(seq[i - 1] * ratio);
    const answer = seq[3] * ratio;
    return {
      id: createProblemId("pat"),
      topicId: "pattern",
      prompt: `${seq.join(", ")}, ? — 다음에 올 수는?`,
      answer: String(answer),
      displayAnswer: String(answer),
      explanation: `앞의 수에 ${ratio}씩 곱하는 규칙이에요. ${seq[3]} × ${ratio} = ${answer}이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const step = randomInt(2, difficulty === "easy" ? 5 : 9);
  const start = randomInt(1, 9);
  const seq = [start];
  for (let i = 1; i < 4; i++) seq.push(seq[i - 1] + step);
  const answer = seq[3] + step;
  return {
    id: createProblemId("pat"),
    topicId: "pattern",
    prompt: `${seq.join(", ")}, ? — 다음에 올 수는?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `앞의 수에 ${step}씩 더하는 규칙이에요. ${seq[3]} + ${step} = ${answer}이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 등호와 동치 관계 ──────────────────────────────────────────
function generateEquality(_grade: Grade, difficulty: Difficulty): Problem {
  const hi = difficulty === "easy" ? 15 : difficulty === "medium" ? 30 : 50;
  const a = randomInt(2, hi);
  const b = randomInt(2, hi);
  const total = a + b;
  const c = randomInt(1, total - 1);
  const answer = total - c;
  const kind = pickFrom(["add", "mixed"] as const);
  const prompt =
    kind === "add"
      ? `${a} + ${b} = ${c} + □ — □에 알맞은 수는?`
      : `${a} + ${b} = □ + ${c} — □에 알맞은 수는?`;
  return {
    id: createProblemId("eq"),
    topicId: "equality",
    prompt,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `등호 양쪽의 값은 같아요. 왼쪽은 ${total}이므로 □ = ${total} − ${c} = ${answer}이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 대응 관계 ─────────────────────────────────────────────────
function generateCorrespondence(_grade: Grade, difficulty: Difficulty): Problem {
  const per = randomInt(2, difficulty === "easy" ? 6 : 12);
  const count = randomInt(3, difficulty === "hard" ? 15 : 9);
  const answer = per * count;
  const scenes = [
    { unit: "삼각형", part: "변", each: 3 },
    { unit: "자동차", part: "바퀴", each: 4 },
    { unit: "자전거", part: "바퀴", each: 2 },
    { unit: "거미", part: "다리", each: 8 },
  ] as const;
  if (Math.random() < 0.5) {
    const scene = pickFrom(scenes);
    return {
      id: createProblemId("cor"),
      topicId: "correspondence",
      prompt: `${scene.unit} 한 개에 ${scene.part}이(가) ${scene.each}개 있어요. ${scene.unit}이(가) ${count}개이면 ${scene.part}은(는) 모두 몇 개일까요?`,
      answer: String(scene.each * count),
      displayAnswer: String(scene.each * count),
      explanation: `(${scene.part} 수) = (${scene.unit} 수) × ${scene.each} 이므로 ${count} × ${scene.each} = ${scene.each * count}이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  return {
    id: createProblemId("cor"),
    topicId: "correspondence",
    prompt: `상자 1개에 사탕이 ${per}개씩 들어 있어요. 상자 수(□)와 사탕 수(△)의 대응 관계에서 상자가 ${count}개이면 사탕은 몇 개일까요?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `△ = □ × ${per} 이므로 ${count} × ${per} = ${answer}이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 비와 비율 ─────────────────────────────────────────────────
function generateRatio(): Problem {
  const base = pickFrom([2, 4, 5, 10, 20, 25, 50]);
  const compare = randomInt(1, base);
  if (Math.random() < 0.5) {
    // 백분율
    const percent = (compare / base) * 100;
    return {
      id: createProblemId("rat"),
      topicId: "ratio",
      prompt: `전체 ${base} 중에서 ${compare}은(는) 몇 %일까요?`,
      answer: String(percent),
      displayAnswer: `${percent}%`,
      explanation: `비율 = 비교하는 양 ÷ 기준량 = ${compare} ÷ ${base} = ${compare / base}, 백분율로 나타내면 ${percent}%예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  // 비율(소수)
  const value = compare / base;
  return {
    id: createProblemId("rat"),
    topicId: "ratio",
    prompt: `기준량이 ${base}, 비교하는 양이 ${compare}일 때 비율을 소수로 나타내면 얼마일까요?`,
    answer: formatDecimal(value, 3),
    displayAnswer: formatDecimal(value, 3),
    explanation: `비율 = ${compare} ÷ ${base} = ${formatDecimal(value, 3)}이에요.`,
    inputType: "number",
    allowDecimalInput: true,
    promptLayout: "story",
  };
}

// ── 비례식과 비례배분 ─────────────────────────────────────────
function generateProportion(_grade: Grade, difficulty: Difficulty): Problem {
  if (Math.random() < 0.5) {
    // 비례식: a:b = c:x
    const p = randomInt(1, 5);
    const q = randomInt(1, 6);
    const k1 = randomInt(2, difficulty === "hard" ? 8 : 5);
    const k2 = randomInt(2, difficulty === "hard" ? 8 : 5);
    const a = p * k1;
    const b = q * k1;
    const c = p * k2;
    const x = q * k2;
    return {
      id: createProblemId("prop"),
      topicId: "proportion",
      prompt: `${a} : ${b} = ${c} : □ — □에 알맞은 수는?`,
      answer: String(x),
      displayAnswer: String(x),
      explanation: `비의 값이 같아요. ${a} : ${b}를 간단히 하면 ${p} : ${q}이고, ${c} : □ = ${p} : ${q}이므로 □ = ${x}이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  // 비례배분
  const m = randomInt(1, 5);
  const n = randomInt(1, 5);
  const k = randomInt(3, difficulty === "hard" ? 12 : 8);
  const total = (m + n) * k;
  const askFirst = Math.random() < 0.5;
  const answer = askFirst ? m * k : n * k;
  return {
    id: createProblemId("prop"),
    topicId: "proportion",
    prompt: `${total}을(를) ${m} : ${n}으로 나눌 때 ${askFirst ? "앞" : "뒤"} 사람이 갖는 양은 얼마일까요?`,
    answer: String(answer),
    displayAnswer: String(answer),
    explanation: `전체를 ${m + n}묶음으로 보면 한 묶음은 ${total} ÷ ${m + n} = ${k}이고, ${askFirst ? m : n}묶음은 ${answer}이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

export const RELATION_GENERATORS: Record<string, Generator> = {
  pattern: generatePattern,
  equality: generateEquality,
  correspondence: generateCorrespondence,
  ratio: generateRatio,
  proportion: generateProportion,
};
