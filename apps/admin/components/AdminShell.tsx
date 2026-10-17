"use client";

import { Suspense, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Search,
  SearchX,
  X,
} from "lucide-react";
import {
  ADMIN_MENU,
  filterAdminMenu,
  normalizeMenuSearch,
  resolveActiveNavKey,
  type NavItem,
  type NavLeaf,
} from "@/lib/adminNav";
import { permissionForPath } from "@/lib/staffPermissions";
import { brand, ports } from "@drmojtahedi/shared";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import RouteProgressBar from "@/components/RouteProgressBar";
import { useAuth } from "@/lib/auth";

const COLLAPSE_KEY = "dm-admin-sidebar-collapsed";
const SUBMENU_KEY = "dm-admin-open-submenus";

function filterMenuByPermission(
  items: NavItem[],
  hasPermission: (key: string) => boolean,
): NavItem[] {
  return items
    .map((item) => {
      if (item.kind === "link") {
        const need = permissionForPath(item.href);
        if (need && !hasPermission(need)) return null;
        return item;
      }
      const children = item.children.filter((leaf) => {
        const need = permissionForPath(leaf.href);
        return !need || hasPermission(need);
      });
      if (!children.length) return null;
      return { ...item, children };
    })
    .filter(Boolean) as NavItem[];
}

function groupContainsActive(item: NavItem, activeKey: string) {
  if (item.kind === "link") return item.key === activeKey;
  return item.children.some((leaf) => leaf.key === activeKey);
}

function NavLinkRow({
  leaf,
  active,
  collapsed,
  onNavigate,
}: {
  leaf: NavLeaf;
  active: boolean;
  collapsed?: boolean;
  onNavigate: () => void;
}) {
  const Icon = leaf.icon;
  return (
    <Link
      href={leaf.href}
      onClick={onNavigate}
      title={collapsed ? leaf.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-2.5 rounded-xl text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
        collapsed ? "justify-center p-2.5" : "px-3 py-2"
      } ${
        active
          ? "bg-pine text-white shadow-sm"
          : "text-ink-muted hover:bg-mint-soft/80 hover:text-ink dark:hover:bg-mint/40"
      }`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-pine/80"}`}
        aria-hidden
      />
      {!collapsed ? (
        <span className="flex-1 truncate text-right font-medium">{leaf.label}</span>
      ) : null}
    </Link>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeKey = resolveActiveNavKey(pathname);
  const { user, logout, hasPermission } = useAuth();
  const searchId = useId();

  const visibleMenu = useMemo(
    () => filterMenuByPermission(ADMIN_MENU, hasPermission),
    [hasPermission],
  );

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wasMobile, setWasMobile] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [menuQuery, setMenuQuery] = useState("");

  const filteredMenu = useMemo(
    () => filterAdminMenu(visibleMenu, menuQuery),
    [menuQuery, visibleMenu],
  );

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
        filteredMenu
          .filter((item) => item.kind === "group")
          .map((item) => item.key),
      );
      return;
    }
    for (const item of visibleMenu) {
      if (item.kind !== "group") continue;
      if (!groupContainsActive(item, activeKey)) continue;
      setOpenSubmenus((prev) =>
        prev.includes(item.key) ? prev : [...prev, item.key],
      );
    }
  }, [activeKey, searching, filteredMenu, visibleMenu]);

  useEffect(() => {
    if (!collapsed) return;
    setMenuQuery("");
  }, [collapsed]);

  useEffect(() => {
    if (collapsed || !isMobile) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCollapsed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collapsed, isMobile]);

  function toggleCollapse() {
    setCollapsed((prev) => !prev);
  }

  function toggleSubmenu(key: string) {
    setOpenSubmenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function handleNavigate() {
    setMenuQuery("");
    if (isMobile) setCollapsed(true);
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:bg-mint-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35 lg:hidden"
              aria-label={sidebarOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
            <div>
              <p className="text-[11px] text-ink-muted">پنل مدیریت</p>
              <p className="text-sm font-bold text-ink sm:text-base">
                {brand.nameFa}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-cream/50 py-1 pe-3 ps-1">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-soft text-xs font-bold text-pine dark:bg-mint"
                  aria-hidden
                >
                  {(user.displayName || user.username).slice(0, 1)}
                </span>
                <span className="hidden max-w-[10rem] truncate text-xs font-medium text-ink md:inline">
                  {user.displayName || user.username}
                </span>
              </div>
            ) : null}
            <ThemeToggle />
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:bg-mint-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35"
              aria-label="خروج از حساب"
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
              مشاهده سایت
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
        id="admin-sidebar"
        aria-label="ناوبری پنل مدیریت"
        className={`fixed right-0 top-16 z-40 flex flex-col overflow-hidden border-l border-ink/10 bg-surface shadow-xl transition-all duration-300 ${
          collapsed
            ? "w-72 translate-x-full lg:w-[4.5rem] lg:translate-x-0"
            : "w-72 translate-x-0"
        }`}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-2 border-b border-ink/10 px-3 py-3"
          dir="rtl"
        >
          {!collapsed ? (
            <Link
              href="/"
              className="min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35"
            >
              <p className="truncate text-sm font-bold text-ink">
                {brand.shortName}
              </p>
              <p className="text-[11px] text-ink-muted">مدیریت محتوا و اعضا</p>
            </Link>
          ) : (
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-mint-soft text-xs font-bold text-pine dark:bg-mint">
              م
            </span>
          )}
          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-mint-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35 lg:inline-flex"
            title={collapsed ? "باز کردن منو" : "جمع کردن منو"}
            aria-label={collapsed ? "باز کردن منو" : "جمع کردن منو"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <Menu className="h-4 w-4" aria-hidden />
            ) : (
              <X className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>

        {!collapsed ? (
          <div className="shrink-0 border-b border-ink/10 px-3 py-2.5" dir="rtl">
            <label htmlFor={searchId} className="relative block">
              <span className="sr-only">جستجوی منو</span>
              <Search
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
                aria-hidden
              />
              <input
                id={searchId}
                type="search"
                value={menuQuery}
                onChange={(e) => setMenuQuery(e.target.value)}
                placeholder="جستجو در منو…"
                className="w-full rounded-xl border border-ink/10 bg-cream/70 py-2.5 pe-3 ps-9 text-xs text-ink outline-none transition placeholder:text-ink-muted focus:border-pine/40 focus:bg-surface focus:ring-2 focus:ring-pine/15 dark:bg-ink/5"
                autoComplete="off"
              />
            </label>
          </div>
        ) : (
          <div className="shrink-0 border-b border-ink/10 p-2">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition hover:bg-mint-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35"
              title="جستجوی منو"
              aria-label="باز کردن جستجوی منو"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        <nav
          className="flex-1 overflow-x-hidden overflow-y-auto px-2.5 py-3"
          aria-label="منوی اصلی"
        >
          <ul className="space-y-1.5">
            {filteredMenu.length === 0 ? (
              <li>
                <EmptyState
                  bare
                  compact
                  icon={SearchX}
                  title="موردی در منو نیست"
                  description="نام بخش را جور دیگر بنویسید."
                />
              </li>
            ) : null}

            {filteredMenu.map((item) => {
              if (item.kind === "link") {
                return (
                  <li key={item.key}>
                    <NavLinkRow
                      leaf={item}
                      active={activeKey === item.key}
                      collapsed={collapsed}
                      onNavigate={handleNavigate}
                    />
                  </li>
                );
              }

              const Icon = item.icon;
              const open = searching || openSubmenus.includes(item.key);
              const groupActive = groupContainsActive(item, activeKey);

              return (
                <li key={item.key} className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (collapsed) {
                        setCollapsed(false);
                        setOpenSubmenus((prev) =>
                          prev.includes(item.key) ? prev : [...prev, item.key],
                        );
                        return;
                      }
                      if (!searching) toggleSubmenu(item.key);
                    }}
                    aria-expanded={open && !collapsed}
                    aria-controls={`submenu-${item.key}`}
                    title={
                      collapsed
                        ? item.label
                        : item.description
                          ? `${item.label} — ${item.description}`
                          : item.label
                    }
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                      collapsed ? "justify-center px-2.5" : ""
                    } ${
                      open || groupActive
                        ? "bg-mint-soft/90 font-semibold text-ink dark:bg-mint/50"
                        : "text-ink-muted hover:bg-cream hover:text-ink"
                    }`}
                  >
                    <Icon
                      className={`h-[1.125rem] w-[1.125rem] shrink-0 ${
                        open || groupActive ? "text-pine" : ""
                      }`}
                      aria-hidden
                    />
                    {!collapsed ? (
                      <>
                        <span className="min-w-0 flex-1 text-right">
                          <span className="block truncate">{item.label}</span>
                          {item.description ? (
                            <span className="mt-0.5 block truncate text-[10px] font-normal text-ink-muted">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-ink-muted transition duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </>
                    ) : null}
                  </button>

                  <div
                    id={`submenu-${item.key}`}
                    role="region"
                    aria-label={item.label}
                    aria-hidden={!(open && !collapsed)}
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                      open && !collapsed
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <ul className="min-h-0 space-y-0.5 overflow-hidden border-r border-pine/15 py-1 pe-0.5 ps-2.5">
                      {item.children.map((leaf) => (
                        <li key={leaf.key}>
                          <NavLinkRow
                            leaf={leaf}
                            active={activeKey === leaf.key}
                            onNavigate={handleNavigate}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-ink/10 p-3">
          {!collapsed ? (
            <p className="text-center text-[11px] leading-5 text-ink-muted">
              پنل {brand.shortName}
              <span className="mx-1 text-ink/20">·</span>
              v0.1
            </p>
          ) : (
            <p className="text-center text-[10px] text-ink-muted">v0.1</p>
          )}
        </div>
      </aside>

      <main
        className={`min-h-screen flex-1 pt-16 transition-all duration-300 ${
          !isMobile ? (collapsed ? "lg:mr-[4.5rem]" : "lg:mr-72") : ""
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
