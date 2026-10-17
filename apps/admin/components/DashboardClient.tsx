"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  BookMarked,
  BookOpen,
  CheckCircle2,
  FileHeart,
  HandHeart,
  Image as ImageIcon,
  Images,
  Landmark,
  Mail,
  Mic,
  Newspaper,
  PenLine,
  Plus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import DonutChart from "@/components/charts/DonutChart";
import SiteTrafficPanel from "@/components/SiteTrafficPanel";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/lib/auth";
import { apiDashboard, type DashboardStats } from "@/lib/api/resources";
import { formatFaDateTime, toPersianDigits } from "@/lib/digits";

const CONTENT_STATUS: Record<string, string> = {
  published: "منتشر",
  draft: "پیش‌نویس",
  placeholder: "جایگزین",
  "coming-soon": "به‌زودی",
};

const CONTRIBUTION_STATUS: Record<string, string> = {
  new: "جدید",
  reviewed: "بررسی‌شده",
  published: "منتشر",
  archived: "بایگانی",
};

const PAYMENT_STATUS: Record<string, string> = {
  pending: "در انتظار",
  redirected: "درگاه",
  awaiting_transfer: "منتظر واریز",
  paid: "پرداخت‌شده",
  failed: "ناموفق",
  cancelled: "لغو",
};

const SHORTCUTS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/news/new", label: "خبر جدید", icon: Newspaper },
  { href: "/articles/new", label: "مقاله جدید", icon: BookMarked },
  { href: "/sliders", label: "اسلایدر", icon: Images },
  { href: "/galleries", label: "گالری", icon: ImageIcon },
  { href: "/people", label: "افراد", icon: Users },
  { href: "/archive", label: "آرشیو", icon: Archive },
  { href: "/donations", label: "کمک‌ها", icon: HandHeart },
  { href: "/members", label: "اعضا", icon: Landmark },
];

function count(value: number | undefined, loading: boolean) {
  if (loading && value === undefined) return "—";
  return toPersianDigits(value ?? 0);
}

function formatRial(amount: number) {
  return `${toPersianDigits(amount.toLocaleString("en-US"))} ریال`;
}

function Section({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-ink/5 pb-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-pine dark:bg-mint">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink">{title}</h2>
            {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "ok" | "warn" | "muted" }) {
  const toneClass =
    tone === "ok"
      ? "bg-mint-soft text-pine dark:bg-mint"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"
        : "bg-cream text-ink-muted dark:bg-cream/15";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClass}`}>
      {label}
    </span>
  );
}

function contentTone(status: string): "ok" | "warn" | "muted" {
  if (status === "published") return "ok";
  if (status === "draft") return "warn";
  return "muted";
}

function paymentTone(status: string): "ok" | "warn" | "muted" {
  if (status === "paid") return "ok";
  if (status === "failed" || status === "cancelled") return "muted";
  return "warn";
}

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

  const queue =
    (stats?.contributionsNew ?? 0) +
    (stats?.donationsOpen ?? 0) +
    (stats?.feesOpen ?? 0) +
    (stats?.membersPending ?? 0);

  const alerts = [
    stats?.contributionsNew
      ? {
          href: "/contributions",
          label: `${toPersianDigits(stats.contributionsNew)} ارسال در صف بررسی`,
          icon: FileHeart,
        }
      : null,
    stats?.donationsOpen
      ? {
          href: "/donations",
          label: `${toPersianDigits(stats.donationsOpen)} کمک ناتمام`,
          icon: HandHeart,
        }
      : null,
    stats?.feesOpen
      ? {
          href: "/membership-fees",
          label: `${toPersianDigits(stats.feesOpen)} حق عضویت باز`,
          icon: Wallet,
        }
      : null,
    stats?.membersPending
      ? {
          href: "/members",
          label: `${toPersianDigits(stats.membersPending)} عضویت در انتظار`,
          icon: Users,
        }
      : null,
    stats?.drafts
      ? {
          href: "/news",
          label: `${toPersianDigits(stats.drafts)} پیش‌نویس منتشرنشده`,
          icon: PenLine,
        }
      : null,
  ].filter(Boolean) as { href: string; label: string; icon: LucideIcon }[];

  const contentMix = [
    { label: "اخبار", value: stats?.news ?? 0 },
    { label: "مقالات", value: stats?.articles ?? 0 },
    { label: "کتاب‌ها", value: stats?.books ?? 0 },
    { label: "آرشیو", value: stats?.archive ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm">
        <div className="relative bg-gradient-to-l from-[#1a3d3a] via-pine to-pine-dark px-5 py-6 text-white sm:px-7 sm:py-7">
          <div
            className="pointer-events-none absolute inset-y-0 start-0 w-2/3 bg-[radial-gradient(circle_at_15%_20%,rgb(255_255_255/0.16),transparent_52%)]"
            aria-hidden
          />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-white/70">{todayLabel}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                {user?.displayName ? `سلام، ${user.displayName}` : "داشبورد عملیات"}
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
                {user?.isSuperuser ? "مدیر کل" : "کاربر پنل"} · خلاصه محتوا، صف بررسی و بازدید امروز
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/news/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-pine transition hover:bg-mint-soft"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                خبر جدید
              </Link>
              <Link
                href="/contributions"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                صف ارسال‌ها
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
          <dl className="relative mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {[
              { label: "بازدید امروز", value: count(stats?.todayVisits, loading) },
              { label: "بازدیدکننده یکتا", value: count(stats?.todayUniques, loading) },
              { label: "صف باز", value: count(loading ? undefined : queue, loading) },
              { label: "پیش‌نویس", value: count(stats?.drafts, loading) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
                <dt className="text-[11px] text-white/70">{item.label}</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          {error}
        </p>
      ) : null}

      {alerts.length > 0 ? (
        <section className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
          <p className="mb-3 text-sm font-semibold text-ink">نیاز به اقدام</p>
          <ul className="flex flex-wrap gap-2">
            {alerts.map((alert) => (
              <li key={alert.href + alert.label}>
                <Link
                  href={alert.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs text-ink transition hover:border-pine/30"
                >
                  <alert.icon className="h-3.5 w-3.5 text-pine" aria-hidden />
                  {alert.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : !loading ? (
        <p className="flex items-center gap-2 rounded-2xl border border-pine/15 bg-mint-soft/40 px-4 py-3 text-sm text-pine dark:bg-mint/20">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          صف بررسی خالی است. پیش‌نویس باز و پرداخت ناتمامی نیست.
        </p>
      ) : null}

      <Section
        title="انتشارات"
        description="اخبار، مجله و کتاب — پیش‌نویس‌ها هنوز روی سایت نیستند"
        icon={Newspaper}
        action={
          <Link href="/news" className="inline-flex items-center gap-1 text-xs font-medium text-pine">
            اخبار
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              label="اخبار"
              value={count(stats?.news, loading)}
              href="/news"
              icon={Newspaper}
              tone="ok"
            />
            <StatCard
              label="مقالات"
              value={count(stats?.articles, loading)}
              href="/articles"
              icon={BookMarked}
            />
            <StatCard
              label="کتاب‌ها"
              value={count(stats?.books, loading)}
              href="/books"
              icon={BookOpen}
            />
            <StatCard
              label="پیش‌نویس"
              value={count(stats?.drafts, loading)}
              href="/news"
              icon={PenLine}
              tone={!loading && stats?.drafts ? "warn" : "ok"}
              hint={
                loading
                  ? undefined
                  : stats?.drafts
                    ? "خبر، مقاله یا کتاب"
                    : "همه منتشر شده‌اند"
              }
            />
          </div>
          <DonutChart title="ترکیب محتوا" data={contentMix} icon={Newspaper} centerLabel="مورد" />
        </div>
      </Section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="میراث و آرشیو" description="افراد، اسناد، گالری و تاریخ شفاهی" icon={Landmark}>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="افراد" value={count(stats?.people, loading)} href="/people" icon={Users} />
            <StatCard
              label="آرشیو"
              value={count(stats?.archive, loading)}
              href="/archive"
              icon={Archive}
            />
            <StatCard
              label="گالری"
              value={count(stats?.galleries, loading)}
              href="/galleries"
              icon={Images}
              tone="ok"
            />
            <StatCard
              label="تاریخ شفاهی"
              value={count(stats?.oralHistory, loading)}
              href="/oral-history"
              icon={Mic}
            />
          </div>
        </Section>

        <Section title="همراهی" description="اعضا، حامیان، خبرنامه و کمک‌ها" icon={HandHeart}>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              label="اعضا"
              value={count(stats?.members, loading)}
              href="/members"
              icon={Users}
              hint={
                stats?.membersPending
                  ? `${toPersianDigits(stats.membersPending)} در انتظار تأیید`
                  : undefined
              }
              tone={stats?.membersPending ? "warn" : "default"}
            />
            <StatCard
              label="حامیان"
              value={count(stats?.sponsors, loading)}
              href="/sponsors"
              icon={HandHeart}
              tone="ok"
            />
            <StatCard
              label="خبرنامه فعال"
              value={count(stats?.newsletter, loading)}
              href="/newsletter"
              icon={Mail}
            />
            <StatCard
              label="کمک پرداخت‌شده"
              value={count(stats?.donationsPaid, loading)}
              href="/donations"
              icon={Wallet}
              hint={
                stats?.donationsOpen
                  ? `${toPersianDigits(stats.donationsOpen)} ناتمام`
                  : undefined
              }
              tone={stats?.donationsOpen ? "warn" : "ok"}
            />
          </div>
        </Section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityCard
          title="آخرین اخبار"
          href="/news"
          empty="خبری ثبت نشده."
          loading={loading}
          rows={(stats?.recentNews ?? []).map((item) => ({
            key: String(item.id),
            href: `/news/${item.id}`,
            title: item.title,
            meta: formatFaDateTime(item.updatedAt),
            status: CONTENT_STATUS[item.status] ?? item.status,
            tone: contentTone(item.status),
          }))}
        />
        <ActivityCard
          title="ارسال خاطره و سند"
          href="/contributions"
          empty="ارسالی در صف نیست."
          loading={loading}
          rows={(stats?.recentContributions ?? []).map((item) => ({
            key: String(item.id),
            href: "/contributions",
            title: item.title,
            meta: `${item.name} · ${formatFaDateTime(item.createdAt)}`,
            status: CONTRIBUTION_STATUS[item.status] ?? item.status,
            tone: item.status === "new" ? "warn" : "muted",
          }))}
        />
        <ActivityCard
          title="آخرین کمک‌ها"
          href="/donations"
          empty="کمکی ثبت نشده."
          loading={loading}
          rows={(stats?.recentDonations ?? []).map((item) => ({
            key: String(item.id),
            href: "/donations",
            title: formatRial(item.amount),
            meta: `${item.name} · ${formatFaDateTime(item.createdAt)}`,
            status: PAYMENT_STATUS[item.status] ?? item.status,
            tone: paymentTone(item.status),
          }))}
        />
      </div>

      <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
        <h2 className="text-sm font-bold text-ink">دسترسی سریع</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {SHORTCUTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-cream/40 px-2 py-3 text-center text-xs font-medium text-ink transition hover:border-pine/30 hover:bg-mint-soft/50 dark:bg-ink/5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-pine shadow-sm">
                <item.icon className="h-4 w-4" aria-hidden />
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <SiteTrafficPanel
        todayVisits={stats?.todayVisits ?? 0}
        todayUniques={stats?.todayUniques ?? 0}
        visitBrowsers={stats?.visitBrowsers}
        visitDevices={stats?.visitDevices}
        recentVisits={stats?.recentVisits}
        loading={loading}
      />
    </div>
  );
}

function ActivityCard({
  title,
  href,
  empty,
  loading,
  rows,
}: {
  title: string;
  href: string;
  empty: string;
  loading: boolean;
  rows: {
    key: string;
    href: string;
    title: string;
    meta: string;
    status: string;
    tone: "ok" | "warn" | "muted";
  }[];
}) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-xs text-pine">
          همه
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3" aria-hidden>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-cream/70 dark:bg-ink/10" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-ink/5">
          {rows.map((row) => (
            <li key={row.key}>
              <Link href={row.href} className="flex items-start justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{row.title}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-ink-muted">{row.meta}</span>
                </span>
                <StatusPill label={row.status} tone={row.tone} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
