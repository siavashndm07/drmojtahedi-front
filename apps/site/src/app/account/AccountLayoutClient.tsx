"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AccountPortalGate } from "@/components/account/AccountShell";
import { useAuthUi } from "@/components/auth/AuthUi";
import { useAuth } from "@/lib/auth";

const PUBLIC_PREFIXES = [
  "/account/login",
  "/account/register",
  "/account/membership",
];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function AccountLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, user } = useAuth();
  const { openLogin } = useAuthUi();

  useEffect(() => {
    if (!ready || user || isPublic(pathname)) return;
    openLogin();
  }, [ready, user, pathname, openLogin]);

  return <AccountPortalGate>{children}</AccountPortalGate>;
}
