import type { UserMode, UserProfile } from "@/types/user";
import { DISPLAY_NAME_MAX, DISPLAY_NAME_MIN } from "@/types/user";

const CURRENT_USER_KEY = "math-kids:current-user";
const USERS_KEY = "math-kids:users";

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

/** Short random token for local ids */
export function createLocalToken(length = 6): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function createUserId(mode: UserMode): string {
  return `${mode}-${createLocalToken(8)}`;
}

export function validateDisplayName(raw: string): {
  ok: boolean;
  value: string;
  error?: string;
} {
  const value = raw.trim().replace(/\s+/g, " ");
  if (value.length < DISPLAY_NAME_MIN) {
    return { ok: false, value, error: "이름을 입력해 주세요." };
  }
  if (value.length > DISPLAY_NAME_MAX) {
    return {
      ok: false,
      value,
      error: `이름은 ${DISPLAY_NAME_MAX}자까지 쓸 수 있어요.`,
    };
  }
  return { ok: true, value };
}

function listUsers(): UserProfile[] {
  return readJson<UserProfile[]>(USERS_KEY, []);
}

function saveUsers(users: UserProfile[]): void {
  writeJson(USERS_KEY, users);
}

function upsertUser(profile: UserProfile): void {
  const users = listUsers();
  const index = users.findIndex((u) => u.id === profile.id);
  if (index >= 0) users[index] = profile;
  else users.push(profile);
  saveUsers(users);
}

export function getCurrentUser(): UserProfile | null {
  return readJson<UserProfile | null>(CURRENT_USER_KEY, null);
}

export function setCurrentUser(profile: UserProfile): void {
  const next = { ...profile, lastSeenAt: Date.now() };
  writeJson(CURRENT_USER_KEY, next);
  upsertUser(next);
}

export function createGuestProfile(): UserProfile {
  const now = Date.now();
  return {
    id: createUserId("guest"),
    displayName: "게스트",
    mode: "guest",
    createdAt: now,
    lastSeenAt: now,
  };
}

/**
 * Ensure a current user exists. First visit → create guest.
 * Returns the active profile.
 */
export function ensureCurrentUser(): UserProfile {
  const existing = getCurrentUser();
  if (existing) {
    const touched = { ...existing, lastSeenAt: Date.now() };
    setCurrentUser(touched);
    return touched;
  }
  const guest = createGuestProfile();
  setCurrentUser(guest);
  return guest;
}

/** Switch to a fresh guest identity (keeps previous users in registry). */
export function continueAsGuest(): UserProfile {
  const guest = createGuestProfile();
  setCurrentUser(guest);
  return guest;
}

/**
 * Simple named login: nickname only, no password.
 * Reuses an existing named profile with the same display name when present.
 */
export function loginWithName(rawName: string): {
  ok: boolean;
  profile?: UserProfile;
  error?: string;
} {
  const validated = validateDisplayName(rawName);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  const users = listUsers();
  const reused = users.find(
    (u) => u.mode === "named" && u.displayName === validated.value,
  );

  const now = Date.now();
  const profile: UserProfile = reused
    ? { ...reused, lastSeenAt: now }
    : {
        id: createUserId("named"),
        displayName: validated.value,
        mode: "named",
        createdAt: now,
        lastSeenAt: now,
      };

  setCurrentUser(profile);
  return { ok: true, profile };
}

export function getRecentNamedUsers(limit = 5): UserProfile[] {
  return listUsers()
    .filter((u) => u.mode === "named")
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    .slice(0, limit);
}

export function shortUserId(id: string): string {
  const parts = id.split("-");
  return parts.length > 1 ? parts[parts.length - 1].slice(0, 6) : id.slice(0, 6);
}
