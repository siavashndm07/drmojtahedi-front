"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  FileHeart,
  HandHeart,
  Mail,
  Newspaper,
  Users,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SiteTrafficPanel from "@/components/SiteTrafficPanel";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import { apiDashboard, type DashboardStats } from "@/lib/api/resources";
import { toPersianDigits } from "@/lib/digits";

const QUICK_LINKS = [
  { href: "/news", label: "اخبار", hint: "ایجاد و ویرایش اخبار" },
  { href: "/people", label: "افراد", hint: "شاگردان و مؤسسان" },
  { href: "/archive", label: "آرشیو", hint: "اسناد و اشیاء" },
  { href: "/sponsors", label: "حامیان", hint: "حامیان فردی و سازمانی" },
  { href: "/newsletter", label: "خبرنامه", hint: "ایمیل‌های مشترک" },
  { href: "/contributions", label: "ارسال‌ها", hint: "خاطره و سند" },
];

export default function DashboardClient() {
  const { user, accessToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const next = await apiDashboard(accessToken);
        if (!cancelled) {
          setStats(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "بارگذاری ناموفق");
          setStats({
            news: 0,
            people: 0,
            archive: 0,
            sponsors: 0,
            newsletter: 0,
            contributions: 0,
            todayVisits: 0,
            todayUniques: 0,
            visitBrowsers: [],
            visitDevices: [],
            recentVisits: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("fa-IR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={user?.displayName ? `سلام، ${user.displayName}` : "داشبورد"}
        description={
          loading
            ? "در حال بارگذاری…"
            : `${todayLabel} — ${
                isApiEnabled() ? "آمار زنده از API" : "حالت بدون API"
              }`
        }
        action={
          <Link href="/news" className="btn-primary !gap-1.5 !py-2 text-xs">
            <Newspaper className="h-3.5 w-3.5" />
            مدیریت اخبار
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          {error} — اگر بک‌اند روشن نیست، آمار صفر نمایش داده می‌شود.
        </p>
      ) : null}

      <SiteTrafficPanel
        todayVisits={stats?.todayVisits ?? 0}
        todayUniques={stats?.todayUniques ?? 0}
        visitBrowsers={stats?.visitBrowsers}
        visitDevices={stats?.visitDevices}
        recentVisits={stats?.recentVisits}
        loading={loading}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="اخبار"
          value={toPersianDigits(stats?.news ?? 0)}
          href="/news"
          icon={Newspaper}
          tone="ok"
        />
        <StatCard
          label="افراد"
          value={toPersianDigits(stats?.people ?? 0)}
          href="/people"
          icon={Users}
        />
        <StatCard
          label="آرشیو"
          value={toPersianDigits(stats?.archive ?? 0)}
          href="/archive"
          icon={Archive}
        />
        <StatCard
          label="حامیان"
          value={toPersianDigits(stats?.sponsors ?? 0)}
          href="/sponsors"
          icon={HandHeart}
          tone="ok"
        />
        <StatCard
          label="خبرنامه"
          value={toPersianDigits(stats?.newsletter ?? 0)}
          href="/newsletter"
          icon={Mail}
        />
        <StatCard
          label="ارسال خاطره"
          value={toPersianDigits(stats?.contributions ?? 0)}
          href="/contributions"
          icon={FileHeart}
          tone={stats?.contributions ? "warn" : "default"}
          hint={stats?.contributions ? "در صف بررسی" : undefined}
        />
      </div>

      <section className="rounded-3xl border border-ink/10 bg-surface/80 p-5 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-ink/5 pb-5">
          <h2 className="text-base font-bold text-ink">میانبرها</h2>
          <p className="mt-1 text-sm text-ink-muted">
            بخش‌های پرکاربرد بنیاد — همان الگوی میانبر داشبورد بینا.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-ink/10 bg-cream/40 p-4 transition hover:border-pine/30 hover:bg-mint-soft/40 dark:bg-ink/5"
            >
              <p className="font-semibold text-ink">{link.label}</p>
              <p className="mt-1 text-xs text-ink-muted">{link.hint}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
