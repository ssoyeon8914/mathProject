import type { Area, Grade, TopicDefinition } from "@/types/problem";

export const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

/** 2022 개정 교육과정 4개 영역 (초·중 공통 체계) */
export const AREAS: { id: Area; name: string; description: string }[] = [
  { id: "number", name: "수와 연산", description: "자연수·분수·소수의 계산" },
  { id: "relation", name: "변화와 관계", description: "규칙·등호·비와 비율" },
  { id: "geometry", name: "도형과 측정", description: "도형·측정·시간" },
  { id: "data", name: "자료와 가능성", description: "그래프·평균·가능성" },
];

export const TOPICS: TopicDefinition[] = [
  // ── 수와 연산 ───────────────────────────────────────────────
  {
    id: "addition",
    name: "덧셈",
    description: "두 수를 더해요",
    grades: [1, 2, 3],
    area: "number",
    defaultDifficulty: "easy",
  },
  {
    id: "subtraction",
    name: "뺄셈",
    description: "큰 수에서 작은 수를 빼요",
    grades: [1, 2, 3],
    area: "number",
    defaultDifficulty: "easy",
  },
  {
    id: "multiplication",
    name: "곱셈",
    description: "구구단과 곱셈을 연습해요",
    grades: [2, 3, 4],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "division",
    name: "나눗셈",
    description: "나누어떨어지는 나눗셈을 풀어요",
    grades: [3, 4],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "mixed-calc",
    name: "혼합 계산",
    description: "사칙연산이 섞인 식을 순서대로 계산해요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "rounding",
    name: "어림하기",
    description: "올림·버림·반올림으로 어림해요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "factors-multiples",
    name: "약수와 배수",
    description: "약수·배수·최대공약수·최소공배수를 구해요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-add",
    name: "분수 덧셈",
    description: "분모가 같은 분수를 더해요",
    grades: [3, 4],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-sub",
    name: "분수 뺄셈",
    description: "분모가 같은 분수를 빼요",
    grades: [3, 4],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-add-unlike",
    name: "분수 덧셈(이분모)",
    description: "분모가 다른 분수를 통분해서 더해요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-sub-unlike",
    name: "분수 뺄셈(이분모)",
    description: "분모가 다른 분수를 통분해서 빼요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-mul",
    name: "분수 곱셈",
    description: "분수끼리 곱해요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-div",
    name: "분수 나눗셈",
    description: "분수의 나눗셈을 풀어요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "hard",
  },
  {
    id: "decimal-add",
    name: "소수 덧셈",
    description: "소수의 덧셈을 연습해요",
    grades: [3, 4],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "decimal-sub",
    name: "소수 뺄셈",
    description: "소수의 뺄셈을 연습해요",
    grades: [3, 4],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "decimal-mul",
    name: "소수 곱셈",
    description: "소수의 곱셈을 연습해요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
  {
    id: "decimal-div",
    name: "소수 나눗셈",
    description: "소수의 나눗셈을 연습해요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "hard",
  },
  {
    id: "fraction-decimal",
    name: "분수와 소수",
    description: "분수를 소수로 바꿔요",
    grades: [5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },

  // ── 변화와 관계 ─────────────────────────────────────────────
  {
    id: "pattern",
    name: "규칙 찾기",
    description: "수 배열의 규칙을 찾아 다음 수를 구해요",
    grades: [2, 3, 4],
    area: "relation",
    defaultDifficulty: "easy",
  },
  {
    id: "equality",
    name: "등호와 동치",
    description: "등호 양쪽이 같도록 □를 구해요",
    grades: [3, 4],
    area: "relation",
    defaultDifficulty: "medium",
  },
  {
    id: "correspondence",
    name: "대응 관계",
    description: "두 양의 대응 관계를 찾아 값을 구해요",
    grades: [5, 6],
    area: "relation",
    defaultDifficulty: "medium",
  },
  {
    id: "ratio",
    name: "비와 비율",
    description: "비율과 백분율을 구해요",
    grades: [5, 6],
    area: "relation",
    defaultDifficulty: "medium",
  },
  {
    id: "proportion",
    name: "비례식과 비례배분",
    description: "비례식을 풀고 비례배분을 해요",
    grades: [5, 6],
    area: "relation",
    defaultDifficulty: "hard",
  },

  // ── 도형과 측정 ─────────────────────────────────────────────
  {
    id: "geometry",
    name: "도형",
    description: "변·꼭짓점, 둘레, 넓이를 알아봐요",
    grades: [1, 2, 3, 4, 5, 6],
    area: "geometry",
    defaultDifficulty: "easy",
  },
  {
    id: "angle",
    name: "각도",
    description: "각도와 삼각형·사각형 내각의 합을 구해요",
    grades: [4],
    area: "geometry",
    defaultDifficulty: "medium",
  },
  {
    id: "polygon-area",
    name: "다각형의 넓이",
    description: "평행사변형·삼각형·사다리꼴·마름모의 넓이를 구해요",
    grades: [5, 6],
    area: "geometry",
    defaultDifficulty: "medium",
  },
  {
    id: "circle",
    name: "원주와 넓이",
    description: "원주율로 원주와 원의 넓이를 구해요",
    grades: [6],
    area: "geometry",
    defaultDifficulty: "medium",
  },
  {
    id: "symmetry",
    name: "합동과 대칭",
    description: "합동·대칭에서 대응변·대응각을 알아봐요",
    grades: [5, 6],
    area: "geometry",
    defaultDifficulty: "medium",
  },
  {
    id: "solid",
    name: "입체도형",
    description: "직육면체·각기둥·각뿔의 구성 요소를 세어봐요",
    grades: [5, 6],
    area: "geometry",
    defaultDifficulty: "medium",
  },
  {
    id: "volume",
    name: "겉넓이와 부피",
    description: "직육면체·정육면체의 겉넓이와 부피를 구해요",
    grades: [6],
    area: "geometry",
    defaultDifficulty: "hard",
  },
  {
    id: "time",
    name: "시각과 시간",
    description: "시간 단위를 바꾸고 시간을 계산해요",
    grades: [2, 3, 4],
    area: "geometry",
    defaultDifficulty: "medium",
  },
  {
    id: "unit-conversion",
    name: "단위 환산",
    description: "길이·무게·들이 단위를 바꿔요",
    grades: [2, 3, 4, 5, 6],
    area: "geometry",
    defaultDifficulty: "medium",
  },

  // ── 자료와 가능성 ───────────────────────────────────────────
  {
    id: "graph-reading",
    name: "자료와 그래프",
    description: "표·그래프의 자료를 읽고 해석해요",
    grades: [3, 4, 5, 6],
    area: "data",
    defaultDifficulty: "easy",
  },
  {
    id: "average",
    name: "평균",
    description: "자료의 평균을 구해요",
    grades: [5, 6],
    area: "data",
    defaultDifficulty: "medium",
  },
  {
    id: "possibility",
    name: "가능성",
    description: "사건이 일어날 가능성을 수로 나타내요",
    grades: [5, 6],
    area: "data",
    defaultDifficulty: "easy",
  },

  // ── 통합 유형 ───────────────────────────────────────────────
  {
    id: "word-problem",
    name: "문장제",
    description: "이야기로 된 문제를 풀어요",
    grades: [1, 2, 3, 4, 5, 6],
    area: "number",
    defaultDifficulty: "medium",
  },
];

export function getTopicsForGrade(grade: Grade): TopicDefinition[] {
  return TOPICS.filter((topic) => topic.grades.includes(grade));
}

export function getTopicsByArea(grade: Grade, area: Area): TopicDefinition[] {
  return getTopicsForGrade(grade).filter((topic) => topic.area === area);
}

export function getTopicById(topicId: string): TopicDefinition | undefined {
  return TOPICS.find((topic) => topic.id === topicId);
}

export function gradeLabel(grade: Grade): string {
  return `${grade}학년`;
}
