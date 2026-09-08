import type {
  Attempt,
  QuizSession,
  ScoreRecord,
  WrongNoteItem,
} from "@/types/problem";
import { ensureCurrentUser, getCurrentUser } from "@/lib/auth";

const LEGACY_SCORES_KEY = "math-kids:scores";
const LEGACY_WRONG_NOTES_KEY = "math-kids:wrong-notes";
const LEGACY_LAST_SESSION_KEY = "math-kids:last-session";
const MIGRATION_FLAG = "math-kids:migrated-v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function activeUserId(): string {
  const user = getCurrentUser() ?? ensureCurrentUser();
  return user.id;
}

function scoresKey(userId = activeUserId()): string {
  return `math-kids:${userId}:scores`;
}

function wrongNotesKey(userId = activeUserId()): string {
  return `math-kids:${userId}:wrong-notes`;
}

function lastSessionKey(userId = activeUserId()): string {
  return `math-kids:${userId}:last-session`;
}

/** Move pre-auth global data into the first user's scoped keys once. */
export function migrateLegacyStorageIfNeeded(): void {
  if (!canUseStorage()) return;
  if (localStorage.getItem(MIGRATION_FLAG) === "1") return;

  const user = ensureCurrentUser();
  const legacyScores = readJson<ScoreRecord[]>(LEGACY_SCORES_KEY, []);
  const legacyNotes = readJson<WrongNoteItem[]>(LEGACY_WRONG_NOTES_KEY, []);
  const legacySession = readJson<QuizSession | null>(LEGACY_LAST_SESSION_KEY, null);

  if (legacyScores.length > 0 && readJson(scoresKey(user.id), []).length === 0) {
    writeJson(scoresKey(user.id), legacyScores);
  }
  if (legacyNotes.length > 0 && readJson(wrongNotesKey(user.id), []).length === 0) {
    writeJson(wrongNotesKey(user.id), legacyNotes);
  }
  if (legacySession && !readJson(lastSessionKey(user.id), null)) {
    writeJson(lastSessionKey(user.id), legacySession);
  }

  localStorage.setItem(MIGRATION_FLAG, "1");
}

export function getScoreHistory(): ScoreRecord[] {
  migrateLegacyStorageIfNeeded();
  return readJson<ScoreRecord[]>(scoresKey(), []);
}

export function saveScoreRecord(record: ScoreRecord): void {
  migrateLegacyStorageIfNeeded();
  const user = ensureCurrentUser();
  const existing = getScoreHistory();
  const withUser: ScoreRecord = { ...record, userId: user.id };
  writeJson(scoresKey(), [withUser, ...existing].slice(0, 50));
}

export function getWrongNotes(): WrongNoteItem[] {
  migrateLegacyStorageIfNeeded();
  return readJson<WrongNoteItem[]>(wrongNotesKey(), []).filter((n) => !n.resolved);
}

export function getAllWrongNotes(): WrongNoteItem[] {
  migrateLegacyStorageIfNeeded();
  return readJson<WrongNoteItem[]>(wrongNotesKey(), []);
}

export function addWrongNotesFromAttempts(attempts: Attempt[]): void {
  migrateLegacyStorageIfNeeded();
  const wrong = attempts.filter((a) => !a.isCorrect);
  if (wrong.length === 0) return;

  const existing = getAllWrongNotes();
  const additions: WrongNoteItem[] = wrong.map((a) => ({
    id: `wn-${a.problemId}-${a.answeredAt}`,
    topicId: a.topicId,
    prompt: a.prompt,
    correctAnswer: a.correctAnswer,
    displayAnswer: a.displayAnswer,
    explanation: a.explanation,
    userAnswer: a.userAnswer,
    inputType: a.inputType,
    promptLayout: a.promptLayout,
    allowDecimalInput: a.allowDecimalInput,
    savedAt: a.answeredAt,
    resolved: false,
  }));

  writeJson(wrongNotesKey(), [...additions, ...existing].slice(0, 100));
}

export function markWrongNoteResolved(id: string): void {
  const notes = getAllWrongNotes().map((n) =>
    n.id === id ? { ...n, resolved: true } : n,
  );
  writeJson(wrongNotesKey(), notes);
}

export function removeWrongNote(id: string): void {
  const notes = getAllWrongNotes().filter((n) => n.id !== id);
  writeJson(wrongNotesKey(), notes);
}

export function saveLastSession(session: QuizSession): void {
  migrateLegacyStorageIfNeeded();
  writeJson(lastSessionKey(), session);
}

export function getLastSession(): QuizSession | null {
  migrateLegacyStorageIfNeeded();
  return readJson<QuizSession | null>(lastSessionKey(), null);
}

export function clearLastSession(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(lastSessionKey());
}

export function buildScoreFromSession(session: QuizSession): ScoreRecord {
  const correct = session.attempts.filter((a) => a.isCorrect).length;
  const total = session.attempts.length;
  const user = getCurrentUser();
  return {
    id: session.id,
    topicId: session.topicId,
    grade: session.grade,
    difficulty: session.difficulty,
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    finishedAt: session.finishedAt ?? Date.now(),
    userId: user?.id,
  };
}
