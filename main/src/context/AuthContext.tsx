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
  type ProfileUpdatePayload,
  type RegisterPayload,
} from "@/lib/api";

const STORAGE_KEY = "ishvarax.auth";

type StoredAuth = {
  user?: AuthUser;
  token?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string;
  isReady: boolean;
  login: (payload: LoginPayload) => Promise<string>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persist(user: AuthUser, token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token } satisfies StoredAuth));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth;
        if (parsed.user && parsed.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
    }
    setIsReady(true);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    const profile = (res.user as AuthUser | undefined) ?? {
      username: payload.username,
    };
    const sessionToken = res.token ?? "";
    persist(profile, sessionToken);
    setUser(profile);
    setToken(sessionToken);
    return sessionToken;
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authApi.register(payload);
      await login({ username: payload.username, password: payload.password });
    },
    [login]
  );

  const updateProfile = useCallback(
    async (payload: ProfileUpdatePayload) => {
      const res = await authApi.updateProfile(payload);
      const profile = res.user as AuthUser | undefined;
      if (profile) {
        persist(profile, token);
        setUser(profile);
      }
    },
    [token]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken("");
  }, []);

  const value = useMemo(
    () => ({ user, token, isReady, login, register, updateProfile, logout }),
    [user, token, isReady, login, register, updateProfile, logout]
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
