"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { subscribeNewsletter } from "@/lib/api/engagement";
import { isApiEnabled } from "@/lib/api/config";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "drmojtahedi-newsletter";

export function NewsletterSignup({
  variant = "footer",
  className,
}: {
  variant?: "footer" | "page";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFooter = variant === "footer";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("ایمیل معتبر وارد کنید.");
      return;
    }
    setBusy(true);
    try {
      if (isApiEnabled()) {
        await subscribeNewsletter(value);
      } else {
        const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
        const next = Array.from(new Set([value, ...prev]));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      setDone(true);
      setEmail("");
    } catch {
      setError("ثبت ممکن نشد. دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p
        className={cn(
          "flex items-center gap-2 text-sm",
          isFooter ? "text-mint-soft" : "text-pine",
          className,
        )}
      >
        <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        {isApiEnabled()
          ? "ثبت شد. از عضویت در خبرنامه سپاسگزاریم."
          : "ثبت شد. پس از اتصال API، خبرنامه فعال می‌شود."}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex max-w-md flex-col gap-2 sm:flex-row",
        className,
      )}
    >
      <label className="sr-only" htmlFor={`newsletter-email-${variant}`}>
        ایمیل خبرنامه
      </label>
      <input
        id={`newsletter-email-${variant}`}
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ایمیل برای خبرنامه"
        autoComplete="email"
        className={
          isFooter
            ? "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white shadow-sm placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
            : "w-full rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm shadow-sm focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
        }
      />
      <button
        type="submit"
        disabled={busy}
        className={
          isFooter
            ? "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-pine-dark transition hover:bg-mint-soft disabled:opacity-60"
            : "inline-flex items-center justify-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-60"
        }
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        عضویت
      </button>
      {error ? (
        <p className={cn("text-xs sm:col-span-2", isFooter ? "text-red-200" : "text-red-600")}>
          {error}
        </p>
      ) : null}
    </form>
  );
}
