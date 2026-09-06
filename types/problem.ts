export type Difficulty = "easy" | "medium" | "hard";
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;
export type InputType = "number" | "fraction";

export type PromptLayout = "equation" | "story";

export interface Problem {
  id: string;
  topicId: string;
  prompt: string;
  /** Normalized canonical answer for grading */
  answer: string;
  displayAnswer: string;
  explanation: string;
  inputType: InputType;
  /** Longer text prompts (문장제·도형 설명 등) use story layout */
  promptLayout?: PromptLayout;
}

export interface Attempt {
  problemId: string;
  topicId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  displayAnswer: string;
  isCorrect: boolean;
  explanation: string;
  answeredAt: number;
  inputType: InputType;
  promptLayout?: PromptLayout;
}

export interface QuizSession {
  id: string;
  topicId: string;
  grade: Grade;
  difficulty: Difficulty;
  problemCount: number;
  attempts: Attempt[];
  startedAt: number;
  finishedAt?: number;
  timed?: boolean;
  timeLimitSeconds?: number;
}

export interface TopicDefinition {
  id: string;
  name: string;
  description: string;
  grades: Grade[];
  /** Relative difficulty baseline within the curriculum */
  defaultDifficulty: Difficulty;
}

export interface ScoreRecord {
  id: string;
  topicId: string;
  grade: Grade;
  difficulty: Difficulty;
  correct: number;
  total: number;
  percent: number;
  finishedAt: number;
  /** Local user id that owns this record */
  userId?: string;
}

export interface WrongNoteItem {
  id: string;
  topicId: string;
  prompt: string;
  correctAnswer: string;
  displayAnswer: string;
  explanation: string;
  userAnswer: string;
  inputType: InputType;
  promptLayout?: PromptLayout;
  savedAt: number;
  resolved: boolean;
}
