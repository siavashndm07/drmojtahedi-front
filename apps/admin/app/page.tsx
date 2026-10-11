"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";
import { apiDashboard, type DashboardStats } from "@/lib/api/resources";
import { toPersianDigits } from "@/lib/digits";

const CARDS: { key: keyof DashboardStats; label: string; href: string }[] = [
  { key: "news", label: "اخبار", href: "/news" },
  { key: "people", label: "افراد", href: "/people" },
  { key: "archive", label: "آرشیو", href: "/archive" },
  { key: "sponsors", label: "حامیان", href: "/sponsors" },
  { key: "newsletter", label: "خبرنامه", href: "/newsletter" },
  { key: "contributions", label: "ارسال‌ها", href: "/contributions" },
];

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await apiDashboard(accessToken);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در دریافت آمار");
          setStats({
            news: 0,
            people: 0,
            archive: 0,
            sponsors: 0,
            newsletter: 0,
            contributions: 0,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div>
      <PageHeader
        title="داشبورد"
        description="خلاصهٔ محتوای بنیاد و صف‌های همراهی."
      />
      {error ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error} — اگر بک‌اند روشن نیست، آمار صفر نمایش داده می‌شود.
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm transition hover:border-pine/35"
          >
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-pine">
              {toPersianDigits(stats?.[card.key] ?? 0)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
