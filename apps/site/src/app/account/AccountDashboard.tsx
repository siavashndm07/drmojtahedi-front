"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  Heart,
  HandHeart,
  ListOrdered,
  UserRound,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth";
import { formatRials } from "@/lib/mock/donations";
import { toPersianDigits } from "@/lib/utils/digits";

const statusLabel = {
  active: "فعال",
  expired: "منقضی",
  pending: "در انتظار تکمیل",
} as const;

export default function AccountDashboardPage() {
  const { user, donations } = useAuth();
  const nudgedRef = useRef(false);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || null
    : null;
  const missingName = Boolean(
    user && (!user.firstName.trim() || !user.lastName.trim()),
  );
  const missingNationalId = Boolean(user && !user.nationalId.trim());
  const showNudge = missingName || missingNationalId;

  useEffect(() => {
    if (!user || !showNudge || nudgedRef.current) return;
    nudgedRef.current = true;
    toast(
      missingName
        ? "نام و نام خانوادگی را در پروفایل تکمیل کنید."
        : "کد ملی را در پروفایل وارد کنید.",
      { id: "account-profile-nudge" },
    );
  }, [user, showNudge, missingName]);

  if (!user) return null;

  const totalDonated = donations.reduce((sum, d) => sum + d.amountRials, 0);
  const recent = donations.slice(0, 3);

  return (
    <div className="space-y-8">
      {showNudge ? (
        <section className="rounded-2xl border border-pine/25 bg-gradient-to-l from-mint-soft/80 to-cream px-5 py-4 sm:px-6">
          <p className="text-sm font-bold text-ink">پروفایل شما ناقص است</p>
          <p className="mt-1 text-sm leading-7 text-ink-muted">
            {missingName
              ? "نام و نام خانوادگی را تکمیل کنید تا کمک‌ها و عضویت به نام شما ثبت شود."
              : "کد ملی را در پروفایل وارد کنید."}
          </p>
          <Link
            href="/account/profile"
            className="mt-4 inline-flex rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
          >
            تکمیل پروفایل
          </Link>
        </section>
      ) : null}

      <section>
        <h1 className="text-display text-2xl text-ink md:text-3xl">
          {displayName ? `سلام، ${displayName}` : "خلاصه حساب"}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          وضعیت عضویت و آخرین فعالیت‌های خیرخواهانه شما.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          href="/account/membership-fee"
          icon={CreditCard}
          label="وضعیت عضویت"
          value={statusLabel[user.membershipStatus]}
        />
        <StatCard
          href="/account/donations"
          icon={ListOrdered}
          label="تعداد کمک‌ها"
          value={toPersianDigits(donations.length)}
        />
        <StatCard
          href="/account/donations"
          icon={Heart}
          label="جمع کمک‌ها"
          value={
            totalDonated
              ? toPersianDigits(formatRials(totalDonated))
              : toPersianDigits(0)
          }
          hint="ریال"
        />
        <StatCard
          href="/account/profile"
          icon={UserRound}
          label="شماره عضویت"
          value={toPersianDigits(user.membershipNumber)}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <QuickLink
          href="/account/donate"
          title="کمک خیرخواهانه"
          description="انتخاب مبلغ و هدف کمک"
        />
        <QuickLink
          href="/account/membership-fee"
          title="پرداخت حق عضویت"
          description="تمدید عضویت سالانه"
        />
        <QuickLink
          href="/account/profile"
          title="ویرایش پروفایل"
          description="اطلاعات فردی و تماس"
        />
      </section>

      <section className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">آخرین کمک‌ها</h2>
          <Link
            href="/account/donations"
            className="inline-flex items-center gap-1 text-sm font-medium text-pine hover:underline"
          >
            همه
            <ArrowLeft className="size-3.5" aria-hidden />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={HandHeart}
            title="هنوز کمکی ثبت نشده"
            description="اولین کمک شما اینجا، کنار خلاصه حساب، دیده می‌شود."
            actionHref="/account/donate"
            actionLabel="ثبت کمک"
            className="mt-4 border-0 bg-transparent px-2 py-8 shadow-none"
          />
        ) : (
          <ul className="mt-4 divide-y divide-ink/8">
            {recent.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-ink">{item.bankName}</p>
                  <p className="text-xs text-ink-muted">
                    {item.dateLabel} · {item.timeLabel}
                  </p>
                </div>
                <p className="font-semibold text-pine" dir="ltr">
                  {toPersianDigits(formatRials(item.amountRials))} ریال
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  href,
  icon: Icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: typeof Heart;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm transition hover:border-pine/35 hover:shadow-card"
    >
      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-mint-soft text-pine">
        <Icon className="size-4" strokeWidth={1.8} aria-hidden />
      </span>
      <p className="mt-3 text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink group-hover:text-pine">
        {value}
        {hint ? (
          <span className="ms-1 text-xs font-medium text-ink-muted">{hint}</span>
        ) : null}
      </p>
    </Link>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm transition hover:border-pine/40"
    >
      <p className="font-semibold text-ink group-hover:text-pine">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-pine">
        ادامه
        <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
      </span>
    </Link>
  );
}
