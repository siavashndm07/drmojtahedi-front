"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BookOpen,
  Bot,
  Building2,
  ChevronLeft,
  CreditCard,
  ExternalLink,
  FileHeart,
  HandHeart,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Mic,
  Newspaper,
  Search,
  Settings,
  Tags,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { permissionForPath } from "@/lib/staffPermissions";
import { brand, ports } from "@drmojtahedi/shared";
import ThemeToggle from "@/components/ThemeToggle";
import RouteProgressBar from "@/components/RouteProgressBar";
import { useAuth } from "@/lib/auth";

type NavChild = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavChild[];
};

const MENU: NavItem[] = [
  {
    key: "dashboard",
    label: "داشبورد",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    key: "content-group",
    label: "محتوا",
    icon: BookOpen,
    children: [
      { key: "news", label: "اخبار", href: "/news", icon: Newspaper },
      {
        key: "news-categories",
        label: "دسته‌های خبر",
        href: "/news/categories",
        icon: Tags,
      },
      { key: "articles", label: "مقالات", href: "/articles", icon: BookOpen },
      { key: "books", label: "کتاب‌ها", href: "/books", icon: BookOpen },
    ],
  },
  {
    key: "heritage-group",
    label: "میراث",
    icon: Users,
    children: [
      { key: "people", label: "افراد", href: "/people", icon: Users },
      { key: "places", label: "مکان‌ها", href: "/places", icon: MapPin },
      { key: "timeline", label: "خط زمان", href: "/timeline", icon: Building2 },
    ],
  },
  {
    key: "archive-group",
    label: "آرشیو",
    icon: Archive,
    children: [
      { key: "archive", label: "آیتم‌ها", href: "/archive", icon: Archive },
      { key: "oral-history", label: "تاریخ شفاهی", href: "/oral-history", icon: Mic },
      { key: "media", label: "رسانه", href: "/media", icon: Archive },
    ],
  },
  {
    key: "foundation-group",
    label: "بنیاد",
    icon: Building2,
    children: [
      { key: "projects", label: "پروژه‌ها", href: "/projects", icon: Building2 },
      { key: "sponsors", label: "حامیان", href: "/sponsors", icon: HandHeart },
      { key: "organs", label: "ارکان", href: "/organs", icon: Users },
    ],
  },
  {
    key: "engagement-group",
    label: "همراهی",
    icon: HandHeart,
    children: [
      { key: "donations", label: "کمک‌ها", href: "/donations", icon: HandHeart },
      { key: "members", label: "اعضا", href: "/members", icon: Users },
      { key: "newsletter", label: "خبرنامه", href: "/newsletter", icon: Mail },
      {
        key: "contributions",
        label: "ارسال خاطره",
        href: "/contributions",
        icon: FileHeart,
      },
    ],
  },
  {
    key: "settings-group",
    label: "سیستم",
    icon: Settings,
    children: [
      { key: "settings", label: "تنظیمات سایت", href: "/settings", icon: Settings },
      {
        key: "settings-payments",
        label: "پرداخت",
        href: "/settings/payments",
        icon: CreditCard,
      },
      {
        key: "settings-staff",
        label: "کاربران پنل",
        href: "/settings/staff",
        icon: Users,
      },
      { key: "ai", label: "دستیار AI", href: "/ai", icon: Bot },
      { key: "account", label: "حساب ادمین", href: "/account", icon: Users },
    ],
  },
];

const COLLAPSE_KEY = "dm-admin-sidebar-collapsed";
const SUBMENU_KEY = "dm-admin-open-submenus";

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function normalizeMenuSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "");
}

function resolveActiveKey(pathname: string): string {
  const matches: { key: string; href: string }[] = [];
  for (const item of MENU) {
    if (item.href && pathMatches(pathname, item.href)) {
      matches.push({ key: item.key, href: item.href });
    }
    for (const child of item.children ?? []) {
      if (pathMatches(pathname, child.href)) {
        matches.push({ key: child.key, href: child.href });
      }
    }
  }
  matches.sort((a, b) => b.href.length - a.href.length);
  return matches[0]?.key ?? "dashboard";
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeKey = resolveActiveKey(pathname);
  const { user, logout, hasPermission } = useAuth();

  const visibleMenu = useMemo(() => {
    return MENU.map((item) => {
      if (item.href) {
        const need = permissionForPath(item.href);
        if (need && !hasPermission(need)) return null;
        return item;
      }
      const children = (item.children ?? []).filter((child) => {
        const need = permissionForPath(child.href);
        return !need || hasPermission(need);
      });
      if (!children.length) return null;
      return { ...item, children };
    }).filter(Boolean) as NavItem[];
  }, [hasPermission]);

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wasMobile, setWasMobile] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [menuQuery, setMenuQuery] = useState("");

  const filteredMenu = useMemo(() => {
    const q = normalizeMenuSearch(menuQuery);
    if (!q) return visibleMenu;
    return visibleMenu.flatMap((item) => {
      const labelHit = normalizeMenuSearch(item.label).includes(q);
      if (!item.children?.length) {
        return labelHit ? [item] : [];
      }
      const children = item.children.filter(
        (child) =>
          normalizeMenuSearch(child.label).includes(q) ||
          normalizeMenuSearch(child.href).includes(q),
      );
      if (labelHit) return [{ ...item, children: item.children }];
      if (children.length) return [{ ...item, children }];
      return [];
    });
  }, [menuQuery, visibleMenu]);

  const searching = normalizeMenuSearch(menuQuery).length > 0;

  useEffect(() => {
    setMounted(true);
    try {
      const savedCollapse = localStorage.getItem(COLLAPSE_KEY);
      if (savedCollapse !== null) setCollapsed(JSON.parse(savedCollapse));
      const savedSubmenus = localStorage.getItem(SUBMENU_KEY);
      if (savedSubmenus) setOpenSubmenus(JSON.parse(savedSubmenus));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;
    try {
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed));
      localStorage.setItem(SUBMENU_KEY, JSON.stringify(openSubmenus));
    } catch {
      /* ignore */
    }
  }, [collapsed, openSubmenus, isMobile, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && !wasMobile) {
        setCollapsed(true);
      } else if (!mobile && wasMobile) {
        try {
          const saved = localStorage.getItem(COLLAPSE_KEY);
          if (saved !== null) setCollapsed(JSON.parse(saved));
        } catch {
          /* ignore */
        }
      }
      setWasMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mounted, wasMobile]);

  useEffect(() => {
    if (searching) {
      setOpenSubmenus(
        filteredMenu.filter((item) => item.children?.length).map((item) => item.key),
      );
      return;
    }
    for (const item of MENU) {
      if (item.children?.some((c) => c.key === activeKey)) {
        setOpenSubmenus((prev) =>
          prev.includes(item.key) ? prev : [...prev, item.key],
        );
      }
    }
  }, [activeKey, searching, filteredMenu]);

  useEffect(() => {
    if (!collapsed) return;
    setMenuQuery("");
  }, [collapsed]);

  function toggleCollapse() {
    setCollapsed((prev) => !prev);
  }

  function toggleSubmenu(key: string) {
    setOpenSubmenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  const sidebarOpen = !collapsed;

  return (
    <div className="relative flex min-h-screen bg-cream">
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>

      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-ink/10 bg-surface/90 backdrop-blur-md">
        <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleCollapse}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:bg-mint-soft lg:hidden"
              aria-label={sidebarOpen ? "بستن منو" : "باز کردن منو"}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
            <div>
              <p className="text-[11px] text-ink-muted">پنل مدیریت</p>
              <p className="text-sm font-bold text-ink sm:text-base">{brand.nameFa}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-soft text-xs font-bold text-pine dark:bg-mint">
                  {(user.displayName || user.username).slice(0, 1)}
                </span>
                <span className="hidden max-w-[10rem] truncate text-xs text-ink-muted md:inline">
                  {user.displayName || user.username}
                </span>
              </div>
            ) : null}
            <ThemeToggle />
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:bg-mint-soft"
              aria-label="خروج"
              title="خروج"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
            <a
              href={`http://localhost:${ports.site}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !gap-1.5 !px-3 !py-2 text-xs"
            >
              سایت
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="بستن منو"
          onClick={toggleCollapse}
        />
      ) : null}

      <aside
        className={`fixed right-0 top-16 z-40 flex flex-col overflow-hidden border-l border-ink/10 bg-surface shadow-lg transition-all duration-300 ${
          collapsed
            ? "w-64 translate-x-full lg:w-16 lg:translate-x-0"
            : "w-64 translate-x-0 lg:w-64"
        }`}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-ink/10 p-3" dir="rtl">
          {!collapsed ? (
            <Link href="/" className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{brand.shortName}</p>
              <p className="text-[11px] text-ink-muted">مدیریت بنیاد</p>
            </Link>
          ) : null}
          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-mint-soft hover:text-ink lg:inline-flex"
            title={collapsed ? "باز کردن منو" : "بستن منو"}
          >
            {collapsed ? (
              <Menu className="h-4 w-4" aria-hidden />
            ) : (
              <X className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>

        {!collapsed ? (
          <div className="shrink-0 border-b border-ink/10 px-2 py-2" dir="rtl">
            <label className="relative block">
              <span className="sr-only">جستجوی منو</span>
              <Search
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
                aria-hidden
              />
              <input
                type="search"
                value={menuQuery}
                onChange={(e) => setMenuQuery(e.target.value)}
                placeholder="جستجوی منو…"
                className="w-full rounded-lg border border-ink/10 bg-cream/60 py-2 pe-3 ps-8 text-xs text-ink outline-none transition placeholder:text-ink-muted focus:border-pine/40 focus:bg-surface dark:bg-ink/5"
                autoComplete="off"
              />
            </label>
          </div>
        ) : (
          <div className="shrink-0 border-b border-ink/10 p-2">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition hover:bg-mint-soft hover:text-ink"
              title="جستجوی منو"
              aria-label="جستجوی منو"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-3">
          <ul className="space-y-1">
            {filteredMenu.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-ink-muted">موردی یافت نشد</li>
            ) : null}
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              if (item.children) {
                const open = searching || openSubmenus.includes(item.key);
                const groupActive = item.children.some((c) => c.key === activeKey);
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => {
                        if (collapsed) setCollapsed(false);
                        if (!searching) toggleSubmenu(item.key);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-sm transition ${
                        collapsed ? "justify-center" : ""
                      } ${
                        open || groupActive
                          ? "bg-mint-soft font-semibold text-ink dark:bg-mint"
                          : "text-ink-muted hover:bg-cream hover:text-ink"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      {!collapsed ? (
                        <>
                          <span className="flex-1 text-right">{item.label}</span>
                          <ChevronLeft
                            className={`h-4 w-4 transition ${open ? "-rotate-90" : ""}`}
                            aria-hidden
                          />
                        </>
                      ) : null}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        open && !collapsed ? "max-h-[48rem]" : "max-h-0"
                      }`}
                    >
                      <ul className="space-y-1 py-1 ps-2">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const active = activeKey === child.key;
                          return (
                            <li key={child.key}>
                              <Link
                                href={child.href}
                                onClick={() => {
                                  setMenuQuery("");
                                  if (isMobile) setCollapsed(true);
                                }}
                                className={`flex items-center gap-3 rounded-md p-2.5 text-sm transition ${
                                  active
                                    ? "border-r-4 border-pine bg-mint-soft font-semibold text-pine dark:bg-mint"
                                    : "text-ink-muted hover:bg-cream hover:text-ink"
                                }`}
                              >
                                <ChildIcon className="h-4 w-4 shrink-0" aria-hidden />
                                <span className="flex-1 text-right">{child.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }

              const active = activeKey === item.key;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href ?? "#"}
                    onClick={() => {
                      if (isMobile) setCollapsed(true);
                    }}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-lg p-3 text-sm transition ${
                      collapsed ? "justify-center" : ""
                    } ${
                      active
                        ? "border-r-4 border-pine bg-mint-soft font-semibold text-pine dark:bg-mint"
                        : "text-ink-muted hover:bg-cream hover:text-ink"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    {!collapsed ? (
                      <span className="flex-1 text-right">{item.label}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-ink/10 p-3">
          {!collapsed ? (
            <p className="text-center text-[11px] text-ink-muted">
              پنل مدیریت {brand.shortName} · v0.1
            </p>
          ) : null}
        </div>
      </aside>

      <main
        className={`min-h-screen flex-1 pt-16 transition-all duration-300 ${
          !isMobile ? (collapsed ? "lg:mr-16" : "lg:mr-64") : ""
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
