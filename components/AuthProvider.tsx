"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserProfile } from "@/types/user";
import {
  continueAsGuest,
  ensureCurrentUser,
  getRecentNamedUsers,
  loginWithName,
  setCurrentUser,
} from "@/lib/auth";
import { migrateLegacyStorageIfNeeded } from "@/lib/storage";

type AuthContextValue = {
  user: UserProfile | null;
  ready: boolean;
  recentNamed: UserProfile[];
  refresh: () => void;
  signInWithName: (name: string) => { ok: boolean; error?: string };
  switchToGuest: () => void;
  selectNamedUser: (profile: UserProfile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [recentNamed, setRecentNamed] = useState<UserProfile[]>([]);

  const refresh = useCallback(() => {
    migrateLegacyStorageIfNeeded();
    const current = ensureCurrentUser();
    setUser(current);
    setRecentNamed(getRecentNamedUsers());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signInWithName = useCallback(
    (name: string) => {
      const result = loginWithName(name);
      if (result.ok && result.profile) {
        setUser(result.profile);
        setRecentNamed(getRecentNamedUsers());
      }
      return { ok: result.ok, error: result.error };
    },
    [],
  );

  const switchToGuest = useCallback(() => {
    const guest = continueAsGuest();
    setUser(guest);
    setRecentNamed(getRecentNamedUsers());
  }, []);

  const selectNamedUser = useCallback((profile: UserProfile) => {
    setCurrentUser(profile);
    setUser({ ...profile, lastSeenAt: Date.now() });
    setRecentNamed(getRecentNamedUsers());
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      recentNamed,
      refresh,
      signInWithName,
      switchToGuest,
      selectNamedUser,
    }),
    [user, ready, recentNamed, refresh, signInWithName, switchToGuest, selectNamedUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
