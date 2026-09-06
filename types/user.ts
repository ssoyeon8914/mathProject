export type UserMode = "guest" | "named";

export interface UserProfile {
  /** Stable local id, e.g. guest-k3f9a2 or named-a1b2c3 */
  id: string;
  displayName: string;
  mode: UserMode;
  createdAt: number;
  lastSeenAt: number;
}

export const DISPLAY_NAME_MIN = 1;
export const DISPLAY_NAME_MAX = 12;
