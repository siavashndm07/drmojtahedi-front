"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, HeartHandshake } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getNavIcon } from "@/components/icons/navIcons";
import {
  primaryNavigation,
  utilityNavigation,
  type NavChild,
  type NavFeatured,
  type NavGroup,
  type NavItem,
} from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

function MegaLink({
  child,
  onNavigate,
  compact = false,
}: {
  child: NavChild;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const ChildIcon = getNavIcon(child.icon);
  return (
    <Link
      href={child.href}
      onClick={onNavigate}
      className={cn(
        "group/link flex items-start gap-3 rounded-xl transition-colors hover:bg-mint-soft",
        compact ? "px-2.5 py-2" : "px-3 py-2.5",
      )}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-xl bg-mint-soft text-pine transition group-hover/link:bg-pine group-hover/link:text-white",
          compact ? "mt-0.5 size-8" : "mt-0.5 size-9",
        )}
      >
        <ChildIcon className={compact ? "size-3.5" : "size-4"} strokeWidth={1.8} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink group-hover/link:text-pine">
          {child.label}
        </span>
        {child.description && !compact ? (
          <span className="mt-0.5 block text-xs leading-5 text-ink-muted">{child.description}</span>
        ) : null}
      </span>
    </Link>
  );
}

function FeaturedCard({ featured }: { featured: NavFeatured }) {
  return (
    <Link
      href={featured.href}
      className="group flex h-full min-h-40 flex-col justify-between rounded-2xl bg-pine p-5 text-white transition hover:bg-pine-dark"
    >
      <div>
        <p className="text-[11px] tracking-[0.16em] text-white/60">پیشنهاد</p>
        <p className="mt-2 text-lg font-semibold leading-7">{featured.title}</p>
        <p className="mt-2 text-sm leading-7 text-white/75">{featured.description}</p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mint-soft">
        {featured.cta ?? "مشاهده"}
        <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

function MegaPanel({ item }: { item: NavItem }) {
  const groups = item.groups ?? [];
  const hasFeatured = Boolean(item.featured);
  const cols = groups.length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card",
        cols + (hasFeatured ? 1 : 0) >= 3
          ? "w-[min(54rem,calc(100vw-2rem))]"
          : cols === 2
            ? "w-[min(36rem,calc(100vw-2rem))]"
            : "w-[min(22rem,calc(100vw-2rem))]",
      )}
    >
      <div
        className={cn(
          "grid gap-0",
          cols === 1 && !hasFeatured && "grid-cols-1",
          cols === 1 && hasFeatured && "sm:grid-cols-[1.2fr_0.9fr]",
          cols === 2 && !hasFeatured && "sm:grid-cols-2",
          cols === 2 && hasFeatured && "lg:grid-cols-[1fr_1fr_0.9fr]",
          cols === 3 && !hasFeatured && "lg:grid-cols-3",
          cols === 3 && hasFeatured && "lg:grid-cols-[1fr_1fr_1fr_0.95fr]",
        )}
      >
        {groups.map((group, index) => (
          <div
            key={group.title}
            className={cn(
              "p-3 md:p-4",
              index > 0 && "border-t border-ink/8 sm:border-t-0 sm:border-s",
            )}
          >
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.14em] text-bronze">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((child) => (
                <li key={`${child.href}-${child.label}`}>
                  <MegaLink child={child} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {item.featured ? (
          <div
            className={cn(
              "border-ink/8 bg-mint-soft/25 p-3 md:p-4",
              "border-t sm:border-t-0 sm:border-s",
            )}
          >
            <FeaturedCard featured={item.featured} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MobileGroup({
  group,
  onNavigate,
}: {
  group: NavGroup;
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pt-2 text-[11px] font-semibold tracking-[0.14em] text-bronze">
        {group.title}
      </p>
      <ul className="grid gap-0.5 sm:grid-cols-2">
        {group.items.map((child) => (
          <li key={child.href + child.label}>
            <MegaLink child={child} onNavigate={onNavigate} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}

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
                <ul className="space-y-3">
                  {primaryNavigation.map((item) => {
                    const Icon = getNavIcon(item.icon);
                    const groups = item.groups ?? [];
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
                        {groups.length ? (
                          <div className="space-y-3 border-t border-ink/10 bg-mint-soft/25 px-2 pb-3">
                            {groups.map((group) => (
                              <MobileGroup
                                key={group.title}
                                group={group}
                                onNavigate={() => setOpen(false)}
                              />
                            ))}
                          </div>
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

              <nav aria-label="ناوبری اصلی" className="hidden items-center gap-0.5 lg:flex">
                {primaryNavigation.map((item, itemIndex) => {
                  const Icon = getNavIcon(item.icon);
                  const hasChildren = Boolean(item.groups?.length);
                  const isOpen = activeMega === item.href;
                  const alignToEnd = itemIndex >= primaryNavigation.length - 2;

                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => hasChildren && setActiveMega(item.href)}
                      onMouseLeave={() => setActiveMega(null)}
                      onFocusCapture={() => hasChildren && setActiveMega(item.href)}
                      onBlurCapture={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                          setActiveMega(null);
                        }
                      }}
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
                          <MegaPanel item={item} />
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
