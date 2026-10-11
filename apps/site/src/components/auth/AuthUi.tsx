"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LoginDrawer } from "@/components/auth/LoginDrawer";

type AuthUiContextValue = {
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

const AuthUiContext = createContext<AuthUiContextValue | null>(null);

export function AuthUiProvider({ children }: { children: ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const value = useMemo(
    () => ({ loginOpen, openLogin, closeLogin }),
    [loginOpen, openLogin, closeLogin],
  );

  return (
    <AuthUiContext.Provider value={value}>
      {children}
      <LoginDrawer isOpen={loginOpen} onClose={closeLogin} />
    </AuthUiContext.Provider>
  );
}

export function useAuthUi() {
  const ctx = useContext(AuthUiContext);
  if (!ctx) {
    throw new Error("useAuthUi must be used within AuthUiProvider");
  }
  return ctx;
}
