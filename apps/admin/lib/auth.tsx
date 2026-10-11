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
import { apiAdminLogin, apiAdminMe } from "@/lib/api/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  clearAdminTokenStorage,
  getStoredAdminToken,
  setAdminTokens,
  adminTokenKeys,
} from "@/lib/adminToken";

export type AdminUser = {
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  isSuperuser: boolean;
  permissions: string[];
};

type AuthContextValue = {
  user: AdminUser | null;
  ready: boolean;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(
  me: {
    username: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    isSuperuser?: boolean;
    permissions?: string[];
  },
  fallback: string,
): AdminUser {
  const firstName = me.firstName?.trim() || "";
  const lastName = me.lastName?.trim() || "";
  return {
    username: me.username || fallback,
    firstName,
    lastName,
    displayName:
      me.displayName?.trim() ||
      [firstName, lastName].filter(Boolean).join(" ") ||
      me.username ||
      fallback,
    isSuperuser: Boolean(me.isSuperuser),
    permissions: Array.isArray(me.permissions) ? me.permissions : ["*"],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = getStoredAdminToken();
        const username = localStorage.getItem(adminTokenKeys.user);
        if (!token || !username) return;
        if (!isApiEnabled()) {
          if (!cancelled) {
            setAccessToken(token);
            setUser({
              username,
              firstName: "",
              lastName: "",
              displayName: username,
              isSuperuser: true,
              permissions: ["*"],
            });
          }
          return;
        }
        const me = await apiAdminMe(token);
        if (!cancelled) {
          setAccessToken(token);
          setUser(toUser(me, username));
        }
      } catch {
        clearAdminTokenStorage();
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    if (!isApiEnabled()) {
      setAdminTokens("demo-token", "demo-refresh", username);
      setAccessToken("demo-token");
      setUser({
        username,
        firstName: "",
        lastName: "",
        displayName: username,
        isSuperuser: true,
        permissions: ["*"],
      });
      return;
    }
    const result = await apiAdminLogin(username, password);
    setAdminTokens(result.access, result.refresh, username);
    setAccessToken(result.access);
    if (result.user) {
      setUser(toUser(result.user, username));
    } else {
      const me = await apiAdminMe(result.access);
      setUser(toUser(me, username));
    }
  }, []);

  const logout = useCallback(() => {
    clearAdminTokenStorage();
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, accessToken, login, logout }),
    [user, ready, accessToken, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
