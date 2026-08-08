"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  authApi,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api";

const STORAGE_KEY = "ishvarax.auth";

type StoredAuth = {
  user?: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persist(user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user } satisfies StoredAuth));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth;
        setUser(parsed.user ?? null);
      }
    } catch {
      // ignore malformed storage
    }
    setIsReady(true);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    await authApi.login(payload);
    const current: AuthUser = { username: payload.username };
    persist(current);
    setUser(current);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await authApi.register(payload);
    const current: AuthUser = { username: payload.username, email: payload.email };
    persist(current);
    setUser(current);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, login, register, logout }),
    [user, isReady, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
