import { TOPICS, getTopicById } from "@/lib/curriculum/topics";
import type {
  Difficulty,
  Grade,
  ScoreRecord,
  WrongNoteItem,
} from "@/types/problem";

export type TopicProgress = {
  topicId: string;
  topicName: string;
  sessions: number;
  correct: number;
  total: number;
  percent: number;
  lastPracticedAt: number | null;
  lastGrade: Grade | null;
  lastDifficulty: Difficulty | null;
  wrongNotes: number;
  /** weak | ok | strong | untried */
  level: "weak" | "ok" | "strong" | "untried";
};

export type DashboardSummary = {
  sessionCount: number;
  problemCount: number;
  correctCount: number;
  overallPercent: number;
  topicsTried: number;
  topicsTotal: number;
  coveragePercent: number;
  practiceDays: number;
  weakTopics: TopicProgress[];
  strongTopics: TopicProgress[];
  allTopics: TopicProgress[];
  recentScores: ScoreRecord[];
};

const MIN_PROBLEMS_FOR_LEVEL = 5;
const WEAK_THRESHOLD = 70;
const STRONG_THRESHOLD = 85;

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function buildTopicProgress(
  scores: ScoreRecord[],
  wrongNotes: WrongNoteItem[],
): TopicProgress[] {
  const wrongByTopic = new Map<string, number>();
  for (const note of wrongNotes) {
    wrongByTopic.set(note.topicId, (wrongByTopic.get(note.topicId) ?? 0) + 1);
  }

  return TOPICS.map((topic) => {
    const topicScores = scores.filter((s) => s.topicId === topic.id);
    const correct = topicScores.reduce((sum, s) => sum + s.correct, 0);
    const total = topicScores.reduce((sum, s) => sum + s.total, 0);
    const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
    const last = topicScores[0] ?? null; // scores are newest-first
    const wrong = wrongByTopic.get(topic.id) ?? 0;

    let level: TopicProgress["level"] = "untried";
    if (total >= MIN_PROBLEMS_FOR_LEVEL) {
      if (percent < WEAK_THRESHOLD || wrong >= 3) level = "weak";
      else if (percent >= STRONG_THRESHOLD) level = "strong";
      else level = "ok";
    } else if (wrong >= 3 || (total > 0 && percent < WEAK_THRESHOLD && total >= 3)) {
      level = "weak";
    } else if (total > 0) {
      level = "ok";
    }

    return {
      topicId: topic.id,
      topicName: topic.name,
      sessions: topicScores.length,
      correct,
      total,
      percent,
      lastPracticedAt: last?.finishedAt ?? null,
      lastGrade: last?.grade ?? null,
      lastDifficulty: last?.difficulty ?? null,
      wrongNotes: wrong,
      level,
    };
  });
}

export function buildDashboardSummary(
  scores: ScoreRecord[],
  wrongNotes: WrongNoteItem[],
): DashboardSummary {
  const allTopics = buildTopicProgress(scores, wrongNotes);
  const sessionCount = scores.length;
  const problemCount = scores.reduce((sum, s) => sum + s.total, 0);
  const correctCount = scores.reduce((sum, s) => sum + s.correct, 0);
  const overallPercent =
    problemCount === 0 ? 0 : Math.round((correctCount / problemCount) * 100);
  const topicsTried = allTopics.filter((t) => t.sessions > 0).length;
  const topicsTotal = TOPICS.length;
  const coveragePercent =
    topicsTotal === 0 ? 0 : Math.round((topicsTried / topicsTotal) * 100);

  const days = new Set(scores.map((s) => dayKey(s.finishedAt)));
  const practiceDays = days.size;

  const weakTopics = allTopics
    .filter((t) => t.level === "weak")
    .sort((a, b) => a.percent - b.percent || b.wrongNotes - a.wrongNotes);

  const strongTopics = allTopics
    .filter((t) => t.level === "strong")
    .sort((a, b) => b.percent - a.percent);

  return {
    sessionCount,
    problemCount,
    correctCount,
    overallPercent,
    topicsTried,
    topicsTotal,
    coveragePercent,
    practiceDays,
    weakTopics,
    strongTopics,
    allTopics,
    recentScores: scores.slice(0, 5),
  };
}

export function suggestPracticeGrade(topic: TopicProgress): Grade {
  if (topic.lastGrade) return topic.lastGrade;
  const def = getTopicById(topic.topicId);
  return def?.grades[0] ?? 1;
}

export function suggestPracticeDifficulty(topic: TopicProgress): Difficulty {
  if (topic.level === "weak") return "easy";
  if (topic.lastDifficulty) return topic.lastDifficulty;
  const def = getTopicById(topic.topicId);
  return def?.defaultDifficulty ?? "medium";
}

export { MIN_PROBLEMS_FOR_LEVEL, WEAK_THRESHOLD, STRONG_THRESHOLD };
