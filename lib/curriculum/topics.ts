import type { Grade, TopicDefinition } from "@/types/problem";

export const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

export const TOPICS: TopicDefinition[] = [
  {
    id: "addition",
    name: "덧셈",
    description: "두 수를 더해요",
    grades: [1, 2, 3],
    defaultDifficulty: "easy",
  },
  {
    id: "subtraction",
    name: "뺄셈",
    description: "큰 수에서 작은 수를 빼요",
    grades: [1, 2, 3],
    defaultDifficulty: "easy",
  },
  {
    id: "multiplication",
    name: "곱셈",
    description: "구구단과 곱셈을 연습해요",
    grades: [2, 3, 4],
    defaultDifficulty: "medium",
  },
  {
    id: "division",
    name: "나눗셈",
    description: "나누어떨어지는 나눗셈을 풀어요",
    grades: [3, 4],
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-add",
    name: "분수 덧셈",
    description: "같은 분모 분수를 더해요",
    grades: [5, 6],
    defaultDifficulty: "medium",
  },
  {
    id: "fraction-sub",
    name: "분수 뺄셈",
    description: "같은 분모 분수를 빼요",
    grades: [5, 6],
    defaultDifficulty: "medium",
  },
  {
    id: "decimal-add",
    name: "소수 덧셈",
    description: "소수 한 자리 덧셈을 연습해요",
    grades: [5, 6],
    defaultDifficulty: "medium",
  },
  {
    id: "geometry",
    name: "도형",
    description: "변·꼭짓점, 둘레, 넓이를 알아봐요",
    grades: [1, 2, 3, 4, 5, 6],
    defaultDifficulty: "easy",
  },
  {
    id: "unit-conversion",
    name: "단위 환산",
    description: "길이·무게·들이 단위를 바꿔요",
    grades: [2, 3, 4, 5, 6],
    defaultDifficulty: "medium",
  },
  {
    id: "word-problem",
    name: "문장제",
    description: "이야기로 된 문제를 풀어요",
    grades: [1, 2, 3, 4, 5, 6],
    defaultDifficulty: "medium",
  },
];

export function getTopicsForGrade(grade: Grade): TopicDefinition[] {
  return TOPICS.filter((topic) => topic.grades.includes(grade));
}

export function getTopicById(topicId: string): TopicDefinition | undefined {
  return TOPICS.find((topic) => topic.id === topicId);
}

export function gradeLabel(grade: Grade): string {
  return `${grade}학년`;
}
