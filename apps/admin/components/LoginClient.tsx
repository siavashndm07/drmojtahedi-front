"use client";

import { Suspense, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Archive,
  BookOpen,
  HandHeart,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Field, Input, PasswordInput } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { brand } from "@drmojtahedi/shared";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const expired = searchParams.get("expired") === "1";
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
      router.replace("/");
    } catch (err) {
      const message =
        err instanceof TypeError
          ? "ارتباط با سرور برقرار نشد. مطمئن شوید Django روی پورت ۸۰۰۰ روشن است."
          : err instanceof Error
            ? err.message
            : "ورود ناموفق بود.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-surface shadow-card">
      <div className="border-b border-ink/10 px-6 py-5 sm:px-8">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">ورود به پنل</h2>
        <p className="mt-2 text-sm text-ink-muted">با حساب کارکنان وارد شوید.</p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {expired ? (
          <div
            className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
            role="status"
          >
            نشست شما منقضی شده است. لطفاً دوباره وارد شوید.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="نام کاربری" htmlFor="admin-username">
            <Input
              id="admin-username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="نام‌کاربری"
              dir="ltr"
              className="text-start"
              required
            />
          </Field>
          <Field label="رمز عبور" htmlFor="admin-password">
            <PasswordInput
              id="admin-password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {error ? (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                در حال ورود…
              </>
            ) : (
              "ورود به پنل"
            )}
          </button>
        </form>
      </div>

      <div className="border-t border-ink/10 bg-cream/60 px-6 py-5 dark:bg-mint/40 sm:px-8">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-mint-deep" aria-hidden />
          <div>
            <p className="font-semibold text-ink">دسترسی محدود</p>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              فقط کاربران staff می‌توانند وارد این پنل شوند. پیش‌فرض توسعه پس از
              seed: admin / admin123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface/80 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-pine/20">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-mint-soft text-mint-deep dark:bg-mint">
        {icon}
      </div>
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-ink-muted">{text}</p>
    </div>
  );
}

export default function LoginClient() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-cool-mesh opacity-70 dark:opacity-30"
        aria-hidden
      />

      <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
        <section className="order-2 mb-10 lg:order-1 lg:mb-0 lg:flex-1">
          <p className="eyebrow">پنل مدیریت</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
            {brand.nameFa}
          </h1>
          <p className="mt-2 text-sm font-medium text-pine" dir="ltr">
            {brand.nameEn}
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
            محتوا، میراث، آرشیو و همراهی بنیاد را از یک پنل یکپارچه مدیریت کنید —
            با همان تجربهٔ کاربری پنل بینا.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Feature
              icon={<BookOpen className="h-5 w-5" />}
              title="محتوا"
              text="اخبار، مقالات و کتابخانه"
            />
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="میراث"
              text="افراد، مکان‌ها و خط زمان"
            />
            <Feature
              icon={<Archive className="h-5 w-5" />}
              title="آرشیو"
              text="اسناد، تاریخ شفاهی و رسانه"
            />
            <Feature
              icon={<HandHeart className="h-5 w-5" />}
              title="همراهی"
              text="خبرنامه، اعضا و ارسال خاطره"
            />
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/70 px-4 py-2 text-xs text-ink-muted backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-mint-deep" aria-hidden />
            مدیریت دیجیتال {brand.shortName}
          </div>
        </section>

        <section className="order-1 w-full lg:order-2 lg:max-w-md lg:flex-1">
          <Suspense
            fallback={
              <div className="flex min-h-[24rem] items-center justify-center rounded-[2rem] border border-ink/10 bg-surface shadow-card">
                <Loader2 className="h-6 w-6 animate-spin text-pine" aria-hidden />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
