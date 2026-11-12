"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  authApi,
  onSessionExpired,
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
  /** Set when the last session ended because the server rejected its token. */
  sessionNotice: string | null;
  clearSessionNotice: () => void;
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
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

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
      const { photo, ...account } = payload;
      await authApi.register(account);
      const sessionToken = await login({ username: account.username, password: account.password });
      if (photo) {
        // The photo is accepted only from an authenticated user; a failure here
        // shouldn't undo a successful sign-up.
        try {
          const res = await authApi.updateProfile({
            username: account.username,
            password: account.password,
            photo,
          });
          const profile = res.user as AuthUser | undefined;
          if (profile) {
            persist(profile, sessionToken);
            setUser(profile);
          }
        } catch {
          // Leave the account without a photo; the profile page can add one later.
        }
      }
    },
    [login]
  );

  const updateProfile = useCallback(
    async (payload: ProfileUpdatePayload) => {
      const res = await authApi.updateProfile(payload);
      const profile = res.user as AuthUser | undefined;
      // A password change revokes old sessions; the server returns a fresh token.
      const nextToken = res.token ?? token;
      if (profile) {
        persist(profile, nextToken);
        setUser(profile);
        setToken(nextToken);
      }
    },
    [token]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken("");
  }, []);

  const clearSessionNotice = useCallback(() => setSessionNotice(null), []);

  useEffect(() => {
    if (!token) return;
    return onSessionExpired(() => {
      logout();
      setSessionNotice("Your session has ended. Please sign in again.");
      if (pathname !== "/login") router.push("/login");
    });
  }, [token, logout, pathname, router]);

  const value = useMemo(
    () => ({
      user,
      token,
      isReady,
      sessionNotice,
      clearSessionNotice,
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, token, isReady, sessionNotice, clearSessionNotice, login, register, updateProfile, logout]
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
