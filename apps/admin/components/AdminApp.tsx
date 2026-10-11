"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { useAuth } from "@/lib/auth";

export default function AdminApp({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user && !isLogin) {
      setRedirecting(true);
      router.replace("/login");
      return;
    }
    if (user && isLogin) {
      setRedirecting(true);
      router.replace("/");
      return;
    }
    setRedirecting(false);
  }, [ready, user, isLogin, router]);

  if (!ready || redirecting || (!user && !isLogin) || (user && isLogin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm text-ink-muted">
        در حال آماده‌سازی پنل…
      </div>
    );
  }

  if (isLogin) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
