"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Landmark,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { mockTimeline } from "@/lib/mock";
import { toPersianDigits, toPersianIndex } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";

const categoryIcons: Record<string, LucideIcon> = {
  آغاز: Sparkles,
  تحصیل: GraduationCap,
  آموزش: GraduationCap,
  رهبری: Landmark,
  نهادها: Landmark,
  میراث: Sparkles,
};

export function TimelinePreview() {
  const items = mockTimeline.slice(0, 5);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === active?.id),
  );
  const ActiveIcon = categoryIcons[active?.category ?? ""] ?? Sparkles;

  if (!active) return null;

  return (
    <FadeIn>
      <section className="relative overflow-hidden border-y border-ink/10">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 100% 10%, rgb(var(--mint) / 0.7), transparent 55%), radial-gradient(ellipse 45% 55% at 0% 90%, rgb(var(--bronze) / 0.1), transparent 50%), linear-gradient(165deg, rgb(var(--surface)) 0%, rgb(var(--cream)) 48%, rgb(var(--mint-soft)) 100%)",
          }}
        />
        {/* Soft geometric atmosphere */}
        <div
          className="pointer-events-none absolute -start-24 top-10 size-72 rounded-full border border-pine/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-16 bottom-8 size-56 rounded-full border border-bronze/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-pine/35 to-transparent"
          aria-hidden
        />

        <div className="content-wide relative section-pad">
          {/* Header — one job, one headline */}
          <div className="mb-10 max-w-3xl lg:mb-14">
            <p className="mb-3 text-sm font-semibold tracking-wide text-pine">
              خط زمان · {toPersianDigits(items.length)} دوره
            </p>
            <h2 className="text-display text-3xl text-ink md:text-4xl lg:text-5xl text-balance">
              مسیر زندگی در یک نگاه
            </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-ink-muted md:text-lg">
                از لاهیجان و تحصیل در فرانسه تا ریاست البرز و بنیان‌گذاری دانشگاه صنعتی
                شریف — هر گره، درگاهی به اسناد و مکان‌های مرتبط است.
              </p>
          </div>

          {/* Desktop: featured stage + graphical path */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)] lg:items-stretch lg:gap-10 xl:gap-14">
            {/* Featured era panel */}
            <div
              key={active.id}
              className="relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-pine-dark text-white shadow-[0_28px_60px_-28px_rgb(var(--pine-dark)/0.65)]"
              style={{ animation: "fadeUp 0.45s ease both" }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                aria-hidden
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 18% 22%, rgb(255 255 255 / 0.18) 0 1.5px, transparent 2px), radial-gradient(circle at 78% 68%, rgb(255 255 255 / 0.12) 0 1px, transparent 1.5px)",
                  backgroundSize: "28px 28px, 18px 18px",
                }}
              />
              <div
                className="pointer-events-none absolute -end-10 -top-10 size-48 rounded-full bg-white/10 blur-2xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -start-8 bottom-0 size-40 rounded-full bg-bronze/25 blur-2xl"
                aria-hidden
              />

              <div className="relative flex items-start justify-between gap-4 p-7 xl:p-8">
                <div>
                  <p className="text-xs tracking-[0.2em] text-white/55">
                    {toPersianIndex(activeIndex + 1)} / {toPersianDigits(items.length)}
                  </p>
                  <p className="mt-3 text-display text-4xl leading-none text-white xl:text-5xl">
                    {active.year}
                  </p>
                </div>
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur-sm">
                  <ActiveIcon className="size-6" strokeWidth={1.7} aria-hidden />
                </span>
              </div>

              <div className="relative space-y-4 px-7 pb-7 xl:px-8 xl:pb-8">
                {active.category ? (
                  <p className="text-sm font-medium text-mint">{active.category}</p>
                ) : null}
                <h3 className="text-display text-2xl leading-10 text-white xl:text-3xl">
                  {active.title}
                </h3>
                <p className="max-w-md text-sm leading-7 text-white/75 xl:text-base xl:leading-8">
                  {active.description}
                </p>
                {active.location ? (
                  <p className="inline-flex items-center gap-1.5 text-sm text-white/60">
                    <MapPin className="size-3.5" aria-hidden />
                    {active.location}
                  </p>
                ) : null}
                <Link
                  href="/about/timeline"
                  className="group mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-mint"
                >
                  جزئیات این دوره
                  <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </div>

            {/* Path + stepping stones */}
            <div className="relative flex flex-col justify-center">
              <div className="relative">
                {/* SVG journey path */}
                <svg
                  className="pointer-events-none absolute inset-x-4 top-[2.65rem] h-3 w-[calc(100%-2rem)]"
                  viewBox="0 0 1000 12"
                  fill="none"
                  aria-hidden
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6 H1000"
                    stroke="rgb(var(--ink) / 0.12)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 6 H1000"
                    stroke="url(#journeyGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="1000"
                    strokeDashoffset={1000 - ((activeIndex + 1) / items.length) * 1000}
                    className="transition-[stroke-dashoffset] duration-500 ease-out"
                  />
                  <defs>
                    <linearGradient id="journeyGrad" x1="0" y1="0" x2="1000" y2="0">
                      <stop stopColor="rgb(var(--pine))" />
                      <stop offset="0.5" stopColor="rgb(var(--bronze))" />
                      <stop offset="1" stopColor="rgb(var(--pine-dark))" />
                    </linearGradient>
                  </defs>
                </svg>

                <ol
                  className="relative grid grid-cols-5 gap-3"
                  role="listbox"
                  aria-label="انتخاب دورهٔ مسیر زندگی"
                >
                  {items.map((item, index) => {
                    const Icon = categoryIcons[item.category ?? ""] ?? Sparkles;
                    const selected = item.id === active.id;

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          id={item.id}
                          onClick={() => setActiveId(item.id)}
                          onMouseEnter={() => setActiveId(item.id)}
                          className={cn(
                            "group relative flex w-full flex-col items-center pt-1 text-center transition",
                            selected ? "opacity-100" : "opacity-80 hover:opacity-100",
                          )}
                        >
                          <span
                            className={cn(
                              "relative z-10 mb-5 flex size-12 items-center justify-center rounded-full border-2 transition duration-300",
                              selected
                                ? "scale-110 border-pine bg-pine text-white shadow-[0_12px_28px_-10px_rgb(var(--pine)/0.7)]"
                                : "border-ink/15 bg-surface text-pine shadow-sm group-hover:border-pine/40 group-hover:bg-mint-soft",
                            )}
                          >
                            <Icon className="size-4" strokeWidth={1.85} aria-hidden />
                          </span>

                          <span
                            className={cn(
                              "mb-1.5 block text-display text-xl leading-none transition",
                              selected ? "text-pine" : "text-ink/35 group-hover:text-ink/60",
                            )}
                          >
                            {toPersianIndex(index + 1)}
                          </span>
                          <span
                            className={cn(
                              "mb-2 block text-[0.7rem] font-semibold",
                              selected ? "text-bronze" : "text-ink-muted",
                            )}
                          >
                            {item.year}
                          </span>
                          <span
                            className={cn(
                              "line-clamp-2 text-xs leading-5 transition",
                              selected
                                ? "font-semibold text-ink"
                                : "text-ink-muted group-hover:text-ink",
                            )}
                          >
                            {item.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
                <p className="text-sm leading-7 text-ink-muted">
                  برای روایت کامل، اسناد و افراد مرتبط، خط زمان تعاملی را باز کنید.
                </p>
                <Link
                  href="/about/timeline"
                  className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pine-dark"
                >
                  مشاهدهٔ کامل
                  <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile / tablet vertical journey */}
          <div className="lg:hidden">
            <ol className="relative space-y-0">
              <div
                className="absolute start-[1.35rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-pine via-bronze to-pine-dark"
                aria-hidden
              />
              {items.map((item, index) => {
                const Icon = categoryIcons[item.category ?? ""] ?? Sparkles;
                const selected = item.id === active.id;

                return (
                  <li key={item.id} className="relative pb-4 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className="flex w-full gap-4 text-start"
                      aria-pressed={selected}
                    >
                      <span
                        className={cn(
                          "relative z-10 mt-4 flex size-11 shrink-0 items-center justify-center rounded-full transition",
                          selected
                            ? "bg-pine text-white shadow-md ring-4 ring-cream"
                            : "bg-surface text-pine ring-4 ring-cream border border-ink/10",
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.85} aria-hidden />
                      </span>

                      <span
                        className={cn(
                          "min-w-0 flex-1 overflow-hidden rounded-2xl border transition",
                          selected
                            ? "border-pine/30 bg-surface shadow-card"
                            : "border-ink/10 bg-surface/80",
                        )}
                      >
                        <span
                          className={cn(
                            "block h-1.5 bg-gradient-to-l transition",
                            selected
                              ? "from-pine via-bronze to-pine-dark"
                              : "from-ink/10 to-ink/5",
                          )}
                        />
                        <span className="block space-y-2 p-4">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-display text-lg text-pine">
                              {toPersianIndex(index + 1)}
                            </span>
                            <span className="text-xs font-semibold text-bronze">
                              {item.year}
                            </span>
                            {item.category ? (
                              <span className="text-xs text-ink-muted">{item.category}</span>
                            ) : null}
                          </span>
                          <span className="block font-semibold text-ink">{item.title}</span>
                          {selected ? (
                            <span className="block text-sm leading-7 text-ink-muted">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <Link
              href="/about/timeline"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pine px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-pine-dark sm:w-auto"
            >
              مشاهدهٔ کامل خط زمان
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
