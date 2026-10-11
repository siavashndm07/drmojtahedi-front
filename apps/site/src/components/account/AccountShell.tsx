"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCard,
  Heart,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuthUi } from "@/components/auth/AuthUi";
import { useAuth } from "@/lib/auth";
import { toPersianDigits } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: "/account", label: "خلاصه حساب", icon: LayoutDashboard, exact: true },
  { href: "/account/profile", label: "پروفایل", icon: UserRound },
  { href: "/account/membership-fee", label: "حق عضویت", icon: CreditCard },
  { href: "/account/donate", label: "کمک بلاعوض", icon: Heart },
  { href: "/account/donations", label: "سوابق کمک", icon: ListOrdered },
];

const PUBLIC_ACCOUNT_PREFIXES = [
  "/account/login",
  "/account/register",
  "/account/membership",
];

function isPublicAccountPath(pathname: string) {
  return PUBLIC_ACCOUNT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const { openLogin } = useAuthUi();

  if (!ready) {
    return (
      <div className="content-wide py-20 text-center text-sm text-ink-muted">
        در حال بررسی ورود…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="content-wide py-16 text-center">
        <p className="text-sm text-ink-muted">برای دسترسی به حساب وارد شوید.</p>
        <button
          type="button"
          onClick={openLogin}
          className="mt-4 inline-flex rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
        >
          ورود با پیامک
        </button>
      </div>
    );
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    `عضو ${toPersianDigits(user.phone.slice(-4))}`;

  return (
    <div className="content-wide pb-16 pt-6 sm:pt-8">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-surface px-4 py-3 lg:hidden">
        <div className="min-w-0">
          <p className="text-xs text-ink-muted">حساب کاربری</p>
          <p className="mt-0.5 truncate font-semibold text-ink">{displayName}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
        >
          <LogOut className="size-3.5" aria-hidden />
          خروج
        </button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition",
                active
                  ? "bg-pine text-white"
                  : "border border-ink/10 bg-surface text-ink-muted",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm">
            <div className="border-b border-ink/10 bg-gradient-to-l from-mint-soft/70 to-cream px-5 py-5">
              <p className="text-xs text-ink-muted">خوش آمدید</p>
              <p className="mt-1 font-bold text-ink">{displayName}</p>
              <p className="mt-1 text-xs text-ink-muted" dir="ltr">
                {toPersianDigits(user.phone)}
              </p>
              <p className="mt-2 text-[11px] text-ink-muted">
                {user.membershipType} ·{" "}
                {user.membershipStatus === "active"
                  ? "فعال"
                  : user.membershipStatus === "expired"
                    ? "منقضی"
                    : "در انتظار تکمیل"}
              </p>
            </div>
            <nav className="space-y-0.5 p-2" aria-label="منوی حساب کاربری">
              {NAV.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition",
                      active
                        ? "bg-mint-soft font-semibold text-ink"
                        : "text-ink-muted hover:bg-cream hover:text-ink",
                    )}
                  >
                    <Icon className="size-4 text-pine" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-ink/10 p-3">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="size-4" aria-hidden />
                خروج از حساب
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

/** Wraps portal routes in shell; leaves login/register/membership bare. */
export function AccountPortalGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, user } = useAuth();
  const { openLogin } = useAuthUi();
  const router = useRouter();

  if (isPublicAccountPath(pathname)) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="content-wide py-20 text-center text-sm text-ink-muted">
        در حال بررسی ورود…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="content-wide py-16 text-center">
        <p className="text-lg font-semibold text-ink">ورود به حساب کاربری</p>
        <p className="mt-2 text-sm text-ink-muted">
          برای مشاهدهٔ خلاصه حساب، پروفایل و کمک‌ها با پیامک وارد شوید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={openLogin}
            className="inline-flex rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
          >
            ورود با پیامک
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex rounded-full border border-ink/10 bg-surface px-5 py-2.5 text-sm font-medium"
          >
            بازگشت به خانه
          </button>
        </div>
      </div>
    );
  }

  return <AccountShell>{children}</AccountShell>;
}
