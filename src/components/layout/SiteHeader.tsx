"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, HeartHandshake } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
}: {
  child: NavChild;
  onNavigate?: () => void;
}) {
  const ChildIcon = getNavIcon(child.icon);
  return (
    <Link
      href={child.href}
      onClick={onNavigate}
      className="group/link flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-mint-soft"
    >
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-pine transition group-hover/link:bg-pine group-hover/link:text-white">
        <ChildIcon className="size-4" strokeWidth={1.8} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink group-hover/link:text-pine">
          {child.label}
        </span>
        {child.description ? (
          <span className="mt-0.5 block text-xs leading-5 text-ink-muted">
            {child.description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function FeaturedCard({ featured }: { featured: NavFeatured }) {
  return (
    <Link
      href={featured.href}
      className="group flex h-full min-h-48 flex-col justify-between rounded-2xl bg-pine p-5 text-white transition hover:bg-pine-dark"
    >
      <div>
        <p className="text-[11px] tracking-[0.16em] text-white/60">پیشنهاد</p>
        <p className="mt-2 text-lg font-semibold leading-7">{featured.title}</p>
        <p className="mt-2 text-sm leading-7 text-white/75">
          {featured.description}
        </p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mint-soft">
        {featured.cta ?? "مشاهده"}
        <ArrowLeft
          className="size-3.5 transition group-hover:-translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

/**
 * Full-width mega panel content. Rendered inside the shared surface that
 * spans the viewport. Columns are laid out horizontally; the featured card
 * occupies its own column on the end.
 */
function MegaPanelContent({ item }: { item: NavItem }) {
  const groups = item.groups ?? [];
  const hasFeatured = Boolean(item.featured);
  const totalCols = groups.length + (hasFeatured ? 1 : 0);

  return (
    <div
      className={cn(
        "grid gap-0",
        totalCols === 1 && "grid-cols-1",
        totalCols === 2 && "sm:grid-cols-2",
        totalCols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        totalCols === 4 && "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {groups.map((group, index) => (
        <div
          key={group.title}
          className={cn(
            "p-4 md:p-5",
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
            "border-ink/8 bg-mint-soft/25 p-4 md:p-5",
            groups.length > 0 && "border-t sm:border-t-0 sm:border-s",
          )}
        >
          <FeaturedCard featured={item.featured} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * The shared full-width surface. Positioned below the header row, spanning
 * the viewport width. Animates in/out with opacity + slight translate.
 */
function MegaSurface({
  activeItem,
  onMouseEnter,
  onMouseLeave,
  contentRef,
}: {
  activeItem: NavItem | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  contentRef?: React.Ref<HTMLDivElement>;
}) {
  const visible = Boolean(activeItem);

  return (
    <div
      ref={contentRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!visible}
      className={cn(
        "absolute inset-x-0 top-full z-40 hidden lg:block",
        "transition-[opacity,transform] duration-200 ease-out",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      {/* Invisible hover bridge — absolutely positioned so it doesn't create
          a visual gap, but still catches the pointer between header and panel. */}
      <div
        className="absolute inset-x-0 -top-2 h-2"
        aria-hidden
      />

      <div className="border-y border-ink/10 bg-surface shadow-[0_24px_48px_-24px_rgb(0_0_0/0.18)]">
        <div className="content-wide">
          {activeItem ? (
            <MegaPanelContent item={activeItem} />
          ) : (
            <div className="h-0" />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * A collapsible sub-group inside the mobile accordion. Renders the group
 * title and its items in a 2-column grid on wider phones.
 */
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
            <Link
              href={child.href}
              onClick={onNavigate}
              className="group/link flex items-start gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-mint-soft"
            >
              <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-pine">
                {(() => {
                  const ChildIcon = getNavIcon(child.icon);
                  return (
                    <ChildIcon
                      className="size-3.5"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  );
                })()}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">
                  {child.label}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileAccordionItem({
  item,
  isOpen,
  onToggle,
  onNavigate,
  panelId,
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  panelId: string;
}) {
  const Icon = getNavIcon(item.icon);
  const groups = item.groups ?? [];
  const hasChildren = groups.length > 0;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setHeight(isOpen ? el.scrollHeight : 0);
  }, [isOpen, groups.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      const el = contentRef.current;
      if (!el) return;
      setHeight(el.scrollHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  if (!hasChildren) {
    return (
      <li className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
        <Link
          href={item.href}
          className="flex items-center gap-3 px-4 py-3.5"
          onClick={onNavigate}
        >
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-mint-soft text-pine">
            <Icon className="size-5" strokeWidth={1.8} aria-hidden />
          </span>
          <span className="text-base font-semibold text-ink">{item.label}</span>
        </Link>
      </li>
    );
  }

  return (
    <li className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors",
          isOpen ? "bg-mint-soft/40" : "hover:bg-mint-soft/25",
        )}
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-pine">
          <Icon className="size-5" strokeWidth={1.8} aria-hidden />
        </span>
        <span className="flex-1 text-base font-semibold text-ink">
          {item.label}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-muted transition-transform duration-300",
            isOpen && "rotate-180 text-pine",
          )}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        ref={contentRef}
        style={{ height }}
        className="overflow-hidden bg-mint-soft/25 transition-[height] duration-300 ease-out"
        aria-hidden={!isOpen}
      >
        <div className="space-y-1 border-t border-ink/10 px-2 pb-3">
          <Link
            href={item.href}
            onClick={onNavigate}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-pine hover:bg-white/60"
          >
            مشاهدهٔ صفحهٔ {item.label}
            <ArrowLeft className="size-3.5" aria-hidden />
          </Link>

          {groups.map((group) => (
            <MobileGroup
              key={group.title}
              group={group}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </li>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();

  const [openSection, setOpenSection] = useState<string | null>(null);

  // Delay closing so the user can move from trigger to panel.
  const closeTimer = useRef<number | null>(null);

  const activeItem =
    primaryNavigation.find((i) => i.href === activeMega) ?? null;

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

  useEffect(() => {
    if (!open) setOpenSection(null);
  }, [open]);

  const openMega = (href: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMega(href);
  };

  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    // Small grace period so pointer can cross the gap.
    closeTimer.current = window.setTimeout(() => {
      setActiveMega(null);
      closeTimer.current = null;
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

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
                  {primaryNavigation.map((item) => (
                    <MobileAccordionItem
                      key={item.href}
                      item={item}
                      isOpen={openSection === item.href}
                      onToggle={() =>
                        setOpenSection((current) =>
                          current === item.href ? null : item.href,
                        )
                      }
                      onNavigate={() => setOpen(false)}
                      panelId={`${panelId}-${item.href.replace(/\W+/g, "-")}`}
                    />
                  ))}
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
    <header
      className="sticky top-0 z-50"
      onMouseLeave={scheduleCloseMega}
    >
      <div className="relative border-b border-ink/10 bg-cream/90 backdrop-blur-md">
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
              {primaryNavigation.map((item) => {
                const Icon = getNavIcon(item.icon);
                const hasChildren = Boolean(item.groups?.length);
                const isOpen = activeMega === item.href;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      if (!hasChildren) {
                        // Hovering a non-mega item clears the mega panel.
                        if (closeTimer.current) {
                          window.clearTimeout(closeTimer.current);
                          closeTimer.current = null;
                        }
                        setActiveMega(null);
                        return;
                      }
                      openMega(item.href);
                    }}
                    onFocusCapture={() => {
                      if (hasChildren) openMega(item.href);
                    }}
                    onBlurCapture={(event) => {
                      if (
                        !event.currentTarget.contains(
                          event.relatedTarget as Node,
                        )
                      ) {
                        scheduleCloseMega();
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

        {/* Shared full-width mega surface, anchored under the nav row. */}
        <MegaSurface
          activeItem={activeItem}
          onMouseEnter={() => {
            if (closeTimer.current) {
              window.clearTimeout(closeTimer.current);
              closeTimer.current = null;
            }
          }}
          onMouseLeave={scheduleCloseMega}
        />
      </div>
      {mobileDrawer}
    </header>
  );
}