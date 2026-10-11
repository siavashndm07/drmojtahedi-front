"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useAuthUi } from "@/components/auth/AuthUi";
import { useAuth } from "@/lib/auth";
import { toPersianDigits } from "@/lib/utils/digits";

export function HeaderAuthButton() {
  const { user, ready } = useAuth();
  const { openLogin } = useAuthUi();

  if (!ready) {
    return (
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-surface opacity-40" />
    );
  }

  if (user) {
    const label =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      toPersianDigits(user.phone.slice(-4));
    return (
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-2.5 py-1.5 text-sm font-medium text-ink transition hover:border-pine/40 hover:text-pine sm:px-3"
        title="حساب کاربری"
        aria-label={`حساب کاربری ${label}`}
      >
        <UserRound className="size-4" strokeWidth={1.9} aria-hidden />
        <span className="hidden max-w-24 truncate md:inline">{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={openLogin}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-2.5 py-1.5 text-sm font-medium text-ink transition hover:border-pine/40 hover:text-pine sm:px-3"
      aria-label="ورود یا ثبت‌نام"
    >
      <UserRound className="size-4" strokeWidth={1.9} aria-hidden />
      <span className="hidden sm:inline">ورود</span>
    </button>
  );
}
