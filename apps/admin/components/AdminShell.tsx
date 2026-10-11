"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Archive,
  BookOpen,
  Bot,
  Building2,
  FileHeart,
  HandHeart,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Mic,
  Newspaper,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { brand } from "@drmojtahedi/shared";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "کلی",
    items: [{ href: "/", label: "داشبورد", icon: LayoutDashboard }],
  },
  {
    title: "محتوا",
    items: [
      { href: "/news", label: "اخبار", icon: Newspaper },
      { href: "/articles", label: "مقالات", icon: BookOpen },
      { href: "/books", label: "کتاب‌ها", icon: BookOpen },
    ],
  },
  {
    title: "میراث",
    items: [
      { href: "/people", label: "افراد", icon: Users },
      { href: "/places", label: "مکان‌ها", icon: MapPin },
      { href: "/timeline", label: "خط زمان", icon: Building2 },
    ],
  },
  {
    title: "آرشیو",
    items: [
      { href: "/archive", label: "آیتم‌ها", icon: Archive },
      { href: "/oral-history", label: "تاریخ شفاهی", icon: Mic },
      { href: "/media", label: "رسانه", icon: Archive },
    ],
  },
  {
    title: "بنیاد",
    items: [
      { href: "/projects", label: "پروژه‌ها", icon: Building2 },
      { href: "/sponsors", label: "حامیان", icon: HandHeart },
      { href: "/organs", label: "ارکان", icon: Users },
    ],
  },
  {
    title: "همراهی",
    items: [
      { href: "/donations", label: "کمک‌ها", icon: HandHeart },
      { href: "/members", label: "اعضا", icon: Users },
      { href: "/newsletter", label: "خبرنامه", icon: Mail },
      { href: "/contributions", label: "ارسال خاطره", icon: FileHeart },
    ],
  },
  {
    title: "سیستم",
    items: [
      { href: "/settings", label: "تنظیمات", icon: Settings },
      { href: "/ai", label: "دستیار AI", icon: Bot },
      { href: "/account", label: "حساب ادمین", icon: Users },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-5 p-4">
      {NAV.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-2 text-[11px] font-semibold text-ink-muted">
            {group.title}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-pine text-white"
                        : "text-ink-muted hover:bg-mint-soft hover:text-pine",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          className="rounded-lg border border-ink/10 p-2"
          onClick={() => setOpen(true)}
          aria-label="منو"
        >
          <Menu className="size-5" />
        </button>
        <p className="text-sm font-semibold">{brand.shortName} Admin</p>
        <button type="button" className="text-xs text-pine" onClick={toggle}>
          {theme === "dark" ? "روشن" : "تیره"}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="بستن"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 start-0 w-72 overflow-y-auto bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <p className="font-semibold">{brand.shortName}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="بستن">
                <X className="size-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[90rem] gap-0 lg:gap-6 lg:px-4 lg:py-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 overflow-y-auto rounded-2xl border border-ink/10 bg-surface lg:block">
          <div className="border-b border-ink/10 px-4 py-4">
            <p className="text-xs text-ink-muted">پنل مدیریت</p>
            <p className="mt-1 font-semibold text-pine">{brand.shortName}</p>
            <p className="mt-2 truncate text-xs text-ink-muted">
              {user?.displayName}
            </p>
          </div>
          {nav}
          <div className="space-y-2 border-t border-ink/10 p-4">
            <button
              type="button"
              onClick={toggle}
              className="w-full rounded-xl border border-ink/10 px-3 py-2 text-xs font-medium hover:border-pine/30"
            >
              حالت {theme === "dark" ? "روشن" : "تیره"}
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
            >
              <LogOut className="size-3.5" />
              خروج
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-0 lg:py-0">{children}</main>
      </div>
    </div>
  );
}
