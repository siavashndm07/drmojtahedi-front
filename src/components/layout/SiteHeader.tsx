"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, HeartHandshake } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getNavIcon } from "@/components/icons/navIcons";
import { primaryNavigation, utilityNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const SearchIcon = getNavIcon("search");
  const MenuIcon = getNavIcon(open ? "close" : "menu");
  const LangIcon = getNavIcon("language");

  const mobileDrawer =
    mounted && open
      ? createPortal(
          <div
            id={panelId}
            className="fixed inset-0 z-[80] flex flex-col bg-cream lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="منوی موبایل"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 px-4">
              <p className="text-sm font-semibold text-ink">منو</p>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-surface"
                aria-label="بستن منو"
                onClick={() => setOpen(false)}
              >
                <MenuIcon className="size-5" strokeWidth={1.9} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 pb-10">
              <nav aria-label="منوی اصلی موبایل">
                <ul className="space-y-2">
                  {primaryNavigation.map((item) => {
                    const Icon = getNavIcon(item.icon);
                    return (
                      <li
                        key={item.href}
                        className="overflow-hidden rounded-2xl border border-ink/10 bg-surface"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3.5"
                          onClick={() => setOpen(false)}
                        >
                          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-mint-soft text-pine">
                            <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                          </span>
                          <span className="text-base font-semibold text-ink">{item.label}</span>
                        </Link>
                        {item.children?.length ? (
                          <ul className="grid gap-1 border-t border-ink/10 bg-mint-soft/30 p-2 sm:grid-cols-2">
                            {item.children.map((child) => {
                              const ChildIcon = getNavIcon(child.icon);
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-surface hover:text-pine"
                                    onClick={() => setOpen(false)}
                                  >
                                    <ChildIcon className="size-4 shrink-0" strokeWidth={1.8} />
                                    {child.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <nav aria-label="لینک‌های کمکی" className="mt-8">
                <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-mint-deep">
                  دسترسی سریع
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {utilityNavigation.map((item) => {
                    const Icon = getNavIcon(item.icon);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface px-3.5 py-3 text-sm font-medium hover:border-pine/30 hover:text-pine"
                          onClick={() => setOpen(false)}
                        >
                          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-mint-soft text-pine">
                            <Icon className="size-4" strokeWidth={1.8} aria-hidden />
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Blur stays on inner bar so it does not trap position:fixed descendants */}
        <div className="border-b border-ink/10 bg-cream/90 backdrop-blur-md">
          <div className="content-wide">
            <div className="flex h-16 items-center justify-between gap-3 md:h-[4.75rem]">
              <Link href="/" className="flex min-w-0 items-center gap-3">
                <Image
                  src="/images/header.png"
                  alt={siteConfig.name}
                  width={168}
                  height={56}
                  className="h-10 w-auto md:h-12"
                  priority
                />
                <span className="sr-only">{siteConfig.name}</span>
              </Link>

              <nav
                aria-label="ناوبری اصلی"
                className="hidden items-center gap-0.5 lg:flex"
              >
                {primaryNavigation.map((item, itemIndex) => {
                  const Icon = getNavIcon(item.icon);
                  const hasChildren = Boolean(item.children?.length);
                  const isOpen = activeMega === item.href;
                  /* RTL: start = right. Leftmost items (high index) flip to end so the panel stays on-screen. */
                  const alignToEnd = itemIndex >= primaryNavigation.length - 2;

                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => hasChildren && setActiveMega(item.href)}
                      onMouseLeave={() => setActiveMega(null)}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "group inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-mint-soft hover:text-pine",
                          isOpen && "bg-mint-soft text-pine",
                        )}
                        aria-expanded={hasChildren ? isOpen : undefined}
                        aria-haspopup={hasChildren ? "true" : undefined}
                      >
                        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-mint-soft/80 text-pine transition group-hover:bg-pine group-hover:text-white">
                          <Icon className="size-3.5" strokeWidth={1.9} aria-hidden />
                        </span>
                        <span className="whitespace-nowrap">{item.label}</span>
                        {hasChildren ? (
                          <ChevronDown
                            className={cn(
                              "size-3.5 text-ink-muted transition",
                              isOpen && "rotate-180 text-pine",
                            )}
                            aria-hidden
                          />
                        ) : null}
                      </Link>

                      {hasChildren && isOpen ? (
                        <div
                          className={cn(
                            "absolute top-full z-50 pt-2",
                            alignToEnd ? "end-0" : "start-0",
                          )}
                        >
                          <div
                            className={cn(
                              "overflow-hidden rounded-2xl border border-ink/10 bg-surface p-2 shadow-card",
                              (item.children?.length ?? 0) > 4
                                ? "w-[min(28rem,calc(100vw-2rem))]"
                                : "w-[min(18rem,calc(100vw-2rem))]",
                            )}
                          >
                            <ul
                              className={cn(
                                "grid gap-1",
                                (item.children?.length ?? 0) > 4 && "sm:grid-cols-2",
                              )}
                            >
                              {item.children!.map((child) => {
                                const ChildIcon = getNavIcon(child.icon);
                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-mint-soft"
                                    >
                                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-pine">
                                        <ChildIcon
                                          className="size-4"
                                          strokeWidth={1.8}
                                          aria-hidden
                                        />
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-ink">
                                          {child.label}
                                        </span>
                                        {child.description ? (
                                          <span className="mt-0.5 block text-xs leading-5 text-ink-muted">
                                            {child.description}
                                          </span>
                                        ) : null}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </nav>

              <div className="flex items-center gap-1 sm:gap-1.5">
                <Link
                  href="/search"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted transition hover:border-pine/30 hover:text-pine"
                  aria-label="جستجو"
                  title="جستجو"
                >
                  <SearchIcon className="size-4" strokeWidth={1.9} />
                </Link>
                <Link
                  href="/support"
                  className="hidden items-center gap-1.5 rounded-full bg-pine px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-pine-dark md:inline-flex"
                >
                  <HeartHandshake className="size-4" strokeWidth={1.9} aria-hidden />
                  حمایت
                </Link>
                <ThemeToggle />
                <button
                  type="button"
                  className="hidden size-10 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted transition hover:text-pine xl:inline-flex"
                  title="English — به‌زودی"
                  aria-label="زبان انگلیسی به‌زودی"
                >
                  <LangIcon className="size-4" strokeWidth={1.9} />
                </button>
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink lg:hidden"
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-label={open ? "بستن منو" : "باز کردن منو"}
                  onClick={() => setOpen((value) => !value)}
                >
                  <MenuIcon className="size-5" strokeWidth={1.9} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {mobileDrawer}
    </>
  );
}
