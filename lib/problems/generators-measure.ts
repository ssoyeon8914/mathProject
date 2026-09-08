import type { Difficulty, Grade, Problem } from "@/types/problem";
import { createProblemId, formatDecimal, pickFrom, randomInt } from "./utils";

type Generator = (grade: Grade, difficulty: Difficulty) => Problem;

// ── 각도 ──────────────────────────────────────────────────────
function generateAngle(_grade: Grade, difficulty: Difficulty): Problem {
  if (Math.random() < 0.5) {
    // 삼각형 내각의 합 = 180
    const a = randomInt(30, 100);
    const b = randomInt(20, 150 - a);
    const answer = 180 - a - b;
    return {
      id: createProblemId("ang"),
      topicId: "angle",
      prompt: `삼각형의 두 각이 ${a}°, ${b}°일 때 나머지 한 각의 크기는 몇 도일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}°`,
      explanation: `삼각형 세 각의 합은 180°예요. 180 − ${a} − ${b} = ${answer}°이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  // 사각형 내각의 합 = 360
  const a = randomInt(50, 100);
  const b = randomInt(50, 100);
  const c = randomInt(50, Math.max(51, 300 - a - b));
  const answer = 360 - a - b - c;
  if (answer <= 0 || answer >= 360) return generateAngle(_grade, difficulty);
  return {
    id: createProblemId("ang"),
    topicId: "angle",
    prompt: `사각형의 세 각이 ${a}°, ${b}°, ${c}°일 때 나머지 한 각의 크기는 몇 도일까요?`,
    answer: String(answer),
    displayAnswer: `${answer}°`,
    explanation: `사각형 네 각의 합은 360°예요. 360 − ${a} − ${b} − ${c} = ${answer}°이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 다각형의 넓이 ─────────────────────────────────────────────
function generatePolygonArea(_grade: Grade, difficulty: Difficulty): Problem {
  const hi = difficulty === "easy" ? 10 : difficulty === "medium" ? 16 : 24;
  const kind = pickFrom(["parallelogram", "triangle", "trapezoid", "rhombus"] as const);
  if (kind === "parallelogram") {
    const base = randomInt(3, hi);
    const height = randomInt(3, hi);
    const answer = base * height;
    return {
      id: createProblemId("pa"),
      topicId: "polygon-area",
      prompt: `밑변이 ${base}cm, 높이가 ${height}cm인 평행사변형의 넓이는 몇 cm²일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm²`,
      explanation: `평행사변형 넓이 = 밑변 × 높이 = ${base} × ${height} = ${answer}cm²예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "triangle") {
    const base = randomInt(2, hi) * 2; // 짝수로 정수 넓이 보장
    const height = randomInt(3, hi);
    const answer = (base * height) / 2;
    return {
      id: createProblemId("pa"),
      topicId: "polygon-area",
      prompt: `밑변이 ${base}cm, 높이가 ${height}cm인 삼각형의 넓이는 몇 cm²일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm²`,
      explanation: `삼각형 넓이 = 밑변 × 높이 ÷ 2 = ${base} × ${height} ÷ 2 = ${answer}cm²예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "trapezoid") {
    const top = randomInt(2, hi);
    let bottom = randomInt(2, hi);
    const height = randomInt(2, hi);
    if ((top + bottom) % 2 !== 0) bottom += 1; // 합을 짝수로
    const answer = ((top + bottom) * height) / 2;
    return {
      id: createProblemId("pa"),
      topicId: "polygon-area",
      prompt: `윗변 ${top}cm, 아랫변 ${bottom}cm, 높이 ${height}cm인 사다리꼴의 넓이는 몇 cm²일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm²`,
      explanation: `사다리꼴 넓이 = (윗변 + 아랫변) × 높이 ÷ 2 = (${top} + ${bottom}) × ${height} ÷ 2 = ${answer}cm²예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  // 마름모
  let d1 = randomInt(2, hi);
  const d2 = randomInt(2, hi);
  if ((d1 * d2) % 2 !== 0) d1 += 1;
  const answer = (d1 * d2) / 2;
  return {
    id: createProblemId("pa"),
    topicId: "polygon-area",
    prompt: `두 대각선이 ${d1}cm, ${d2}cm인 마름모의 넓이는 몇 cm²일까요?`,
    answer: String(answer),
    displayAnswer: `${answer}cm²`,
    explanation: `마름모 넓이 = 한 대각선 × 다른 대각선 ÷ 2 = ${d1} × ${d2} ÷ 2 = ${answer}cm²예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 원주와 원의 넓이 (원주율 3.14) ────────────────────────────
function generateCircle(_grade: Grade, difficulty: Difficulty): Problem {
  const PI = 3.14;
  if (Math.random() < 0.5) {
    const radius = randomInt(1, difficulty === "hard" ? 20 : 10);
    const diameter = radius * 2;
    const answer = diameter * PI;
    return {
      id: createProblemId("cir"),
      topicId: "circle",
      prompt: `반지름이 ${radius}cm인 원의 원주는 몇 cm일까요? (원주율 3.14)`,
      answer: formatDecimal(answer, 2),
      displayAnswer: `${formatDecimal(answer, 2)}cm`,
      explanation: `원주 = 지름 × 원주율 = ${diameter} × 3.14 = ${formatDecimal(answer, 2)}cm예요.`,
      inputType: "number",
      allowDecimalInput: true,
      promptLayout: "story",
    };
  }
  const radius = randomInt(1, difficulty === "hard" ? 15 : 8);
  const answer = radius * radius * PI;
  return {
    id: createProblemId("cir"),
    topicId: "circle",
    prompt: `반지름이 ${radius}cm인 원의 넓이는 몇 cm²일까요? (원주율 3.14)`,
    answer: formatDecimal(answer, 2),
    displayAnswer: `${formatDecimal(answer, 2)}cm²`,
    explanation: `원의 넓이 = 반지름 × 반지름 × 원주율 = ${radius} × ${radius} × 3.14 = ${formatDecimal(answer, 2)}cm²예요.`,
    inputType: "number",
    allowDecimalInput: true,
    promptLayout: "story",
  };
}

// ── 합동과 대칭 ───────────────────────────────────────────────
function generateSymmetry(_grade: Grade, difficulty: Difficulty): Problem {
  if (Math.random() < 0.5) {
    const len = randomInt(3, difficulty === "hard" ? 30 : 15);
    return {
      id: createProblemId("sym"),
      topicId: "symmetry",
      prompt: `합동인 두 도형이 있어요. 한 도형의 어떤 변의 길이가 ${len}cm이면, 다른 도형에서 대응하는 변의 길이는 몇 cm일까요?`,
      answer: String(len),
      displayAnswer: `${len}cm`,
      explanation: `합동인 도형에서 대응변의 길이는 서로 같아요. 그래서 ${len}cm예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const angle = randomInt(20, 150);
  return {
    id: createProblemId("sym"),
    topicId: "symmetry",
    prompt: `선대칭도형에서 어떤 각의 크기가 ${angle}°이면, 대칭축을 기준으로 대응하는 각의 크기는 몇 도일까요?`,
    answer: String(angle),
    displayAnswer: `${angle}°`,
    explanation: `선대칭도형에서 대응각의 크기는 서로 같아요. 그래서 ${angle}°예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 입체도형의 구성 요소 ──────────────────────────────────────
function generateSolid(_grade: Grade, difficulty: Difficulty): Problem {
  const kind = pickFrom(["cuboid", "prism", "pyramid"] as const);
  const part = pickFrom(["면", "모서리", "꼭짓점"] as const);
  if (kind === "cuboid") {
    const counts = { 면: 6, 모서리: 12, 꼭짓점: 8 };
    return {
      id: createProblemId("sol"),
      topicId: "solid",
      prompt: `직육면체의 ${part}의 수는 몇 개일까요?`,
      answer: String(counts[part]),
      displayAnswer: `${counts[part]}개`,
      explanation: `직육면체는 면 6개, 모서리 12개, 꼭짓점 8개예요. ${part}은(는) ${counts[part]}개예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const n = randomInt(3, difficulty === "hard" ? 8 : 6);
  const shapeName = `${n}각형`;
  if (kind === "prism") {
    const counts = { 면: n + 2, 모서리: 3 * n, 꼭짓점: 2 * n };
    return {
      id: createProblemId("sol"),
      topicId: "solid",
      prompt: `밑면이 ${shapeName}인 각기둥의 ${part}의 수는 몇 개일까요?`,
      answer: String(counts[part]),
      displayAnswer: `${counts[part]}개`,
      explanation: `밑면이 ${shapeName}인 각기둥은 면 ${n + 2}개, 모서리 ${3 * n}개, 꼭짓점 ${2 * n}개예요. ${part}은(는) ${counts[part]}개예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const counts = { 면: n + 1, 모서리: 2 * n, 꼭짓점: n + 1 };
  return {
    id: createProblemId("sol"),
    topicId: "solid",
    prompt: `밑면이 ${shapeName}인 각뿔의 ${part}의 수는 몇 개일까요?`,
    answer: String(counts[part]),
    displayAnswer: `${counts[part]}개`,
    explanation: `밑면이 ${shapeName}인 각뿔은 면 ${n + 1}개, 모서리 ${2 * n}개, 꼭짓점 ${n + 1}개예요. ${part}은(는) ${counts[part]}개예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 겉넓이와 부피 ─────────────────────────────────────────────
function generateVolume(_grade: Grade, difficulty: Difficulty): Problem {
  const hi = difficulty === "easy" ? 6 : difficulty === "medium" ? 10 : 15;
  const kind = pickFrom(["cuboidVolume", "cubeVolume", "cubeSurface", "cuboidSurface"] as const);
  if (kind === "cubeVolume") {
    const a = randomInt(2, hi);
    const answer = a * a * a;
    return {
      id: createProblemId("vol"),
      topicId: "volume",
      prompt: `한 모서리가 ${a}cm인 정육면체의 부피는 몇 cm³일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm³`,
      explanation: `정육면체 부피 = 한 모서리 × 한 모서리 × 한 모서리 = ${a} × ${a} × ${a} = ${answer}cm³예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "cubeSurface") {
    const a = randomInt(2, hi);
    const answer = 6 * a * a;
    return {
      id: createProblemId("vol"),
      topicId: "volume",
      prompt: `한 모서리가 ${a}cm인 정육면체의 겉넓이는 몇 cm²일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm²`,
      explanation: `정육면체 겉넓이 = 한 면의 넓이 × 6 = ${a} × ${a} × 6 = ${answer}cm²예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const a = randomInt(2, hi);
  const b = randomInt(2, hi);
  const c = randomInt(2, hi);
  if (kind === "cuboidSurface") {
    const answer = 2 * (a * b + b * c + c * a);
    return {
      id: createProblemId("vol"),
      topicId: "volume",
      prompt: `가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 겉넓이는 몇 cm²일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}cm²`,
      explanation: `직육면체 겉넓이 = (가로×세로 + 세로×높이 + 높이×가로) × 2 = (${a * b} + ${b * c} + ${c * a}) × 2 = ${answer}cm²예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const answer = a * b * c;
  return {
    id: createProblemId("vol"),
    topicId: "volume",
    prompt: `가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 부피는 몇 cm³일까요?`,
    answer: String(answer),
    displayAnswer: `${answer}cm³`,
    explanation: `직육면체 부피 = 가로 × 세로 × 높이 = ${a} × ${b} × ${c} = ${answer}cm³예요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

// ── 시각과 시간 ───────────────────────────────────────────────
function generateTime(_grade: Grade, difficulty: Difficulty): Problem {
  const kind = pickFrom(["hourToMin", "hmToMin", "minToHour", "minToSec", "addMin"] as const);
  if (kind === "hourToMin") {
    const h = randomInt(2, 6);
    return {
      id: createProblemId("time"),
      topicId: "time",
      prompt: `${h}시간은 몇 분일까요?`,
      answer: String(h * 60),
      displayAnswer: `${h * 60}분`,
      explanation: `1시간은 60분이에요. ${h} × 60 = ${h * 60}분이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "hmToMin") {
    const h = randomInt(1, 4);
    const m = randomInt(1, 59);
    const answer = h * 60 + m;
    return {
      id: createProblemId("time"),
      topicId: "time",
      prompt: `${h}시간 ${m}분은 몇 분일까요?`,
      answer: String(answer),
      displayAnswer: `${answer}분`,
      explanation: `${h}시간은 ${h * 60}분이고, ${h * 60} + ${m} = ${answer}분이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "minToHour") {
    const h = randomInt(2, 6);
    return {
      id: createProblemId("time"),
      topicId: "time",
      prompt: `${h * 60}분은 몇 시간일까요?`,
      answer: String(h),
      displayAnswer: `${h}시간`,
      explanation: `60분이 1시간이에요. ${h * 60} ÷ 60 = ${h}시간이에요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  if (kind === "minToSec") {
    const m = randomInt(2, difficulty === "hard" ? 9 : 5);
    return {
      id: createProblemId("time"),
      topicId: "time",
      prompt: `${m}분은 몇 초일까요?`,
      answer: String(m * 60),
      displayAnswer: `${m * 60}초`,
      explanation: `1분은 60초예요. ${m} × 60 = ${m * 60}초예요.`,
      inputType: "number",
      promptLayout: "story",
    };
  }
  const a = randomInt(10, 40);
  const b = randomInt(10, 40);
  return {
    id: createProblemId("time"),
    topicId: "time",
    prompt: `${a}분 + ${b}분은 몇 분일까요?`,
    answer: String(a + b),
    displayAnswer: `${a + b}분`,
    explanation: `${a} + ${b} = ${a + b}분이에요.`,
    inputType: "number",
    promptLayout: "story",
  };
}

export const MEASURE_GENERATORS: Record<string, Generator> = {
  angle: generateAngle,
  "polygon-area": generatePolygonArea,
  circle: generateCircle,
  symmetry: generateSymmetry,
  solid: generateSolid,
  volume: generateVolume,
  time: generateTime,
};
