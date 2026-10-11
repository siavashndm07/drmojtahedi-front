"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthUi } from "@/components/auth/AuthUi";
import { useAuth } from "@/lib/auth";

export function RequireAuth({
  children,
  fallbackHref = "/",
}: {
  children: ReactNode;
  fallbackHref?: string;
}) {
  const { user, ready } = useAuth();
  const { openLogin } = useAuthUi();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      openLogin();
      router.replace(fallbackHref);
    }
  }, [ready, user, openLogin, router, fallbackHref]);

  if (!ready) {
    return (
      <div className="content-shell section-pad">
        <p className="text-sm text-ink-muted">در حال بارگذاری حساب...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="content-shell section-pad">
        <p className="text-sm text-ink-muted">
          برای ادامه وارد شوید.{" "}
          <button
            type="button"
            onClick={openLogin}
            className="font-medium text-pine hover:underline"
          >
            ورود با پیامک
          </button>
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-pine hover:underline">
          بازگشت به خانه
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
