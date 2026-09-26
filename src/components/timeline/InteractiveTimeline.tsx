"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { toPersianDigits } from "@/lib/utils/digits";
import { cn } from "@/lib/utils/cn";
import type { TimelineEvent } from "@/lib/types";

const relatedHrefMap: Record<string, string> = {
  "person-jordan": "/heritage/people/samuel-jordan",
  "person-suzanne": "/heritage/people/suzanne-mojtahedi",
  "place-lahijan": "/heritage/places/lahijan",
  "place-alborz": "/heritage/places/alborz-high-school",
  "place-sharif": "/heritage/places/sharif-university",
  "arch-memoir": "/archive/khaterat-mojtahedi",
  "arch-alborz-photo": "/archive/alborz-era-photographs",
  "arch-oral": "/archive/oral-history-interview",
  "article-educator": "/magazine/moalem-alborz",
  "article-sharif": "/magazine/bonyangozari-sharif",
  "event-nekoodasht": "/events/nekoodasht-1397",
  "event-heritage-talk": "/events/gofteman-miras-amoozesh",
};

function relatedLabel(id: string): string {
  const labels: Record<string, string> = {
    "person-jordan": "ساموئل جوردن",
    "person-suzanne": "سوزان مجتهدی",
    "place-lahijan": "لاهیجان",
    "place-alborz": "دبیرستان البرز",
    "place-sharif": "دانشگاه صنعتی شریف",
    "arch-memoir": "خاطرات مجتهدی",
    "arch-alborz-photo": "عکس‌های دورهٔ البرز",
    "arch-oral": "مصاحبهٔ تاریخ شفاهی",
    "article-educator": "معلم البرز",
    "article-sharif": "بنیان‌گذاری شریف",
    "event-nekoodasht": "نکوداشت ۱۳۹۷",
    "event-heritage-talk": "گفت‌وگوی میراث آموزشی",
  };
  return labels[id] ?? "محتوای مرتبط";
}

export function InteractiveTimeline({
  events,
  className,
}: {
  events: TimelineEvent[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState(events[0]?.id ?? "");
  const active = useMemo(
    () => events.find((event) => event.id === activeId) ?? events[0],
    [activeId, events],
  );

  if (!events.length || !active) {
    return (
      <p className="border border-dashed border-ink/10 px-4 py-8 text-ink-muted">
        رویدادی برای نمایش در خط زمان وجود ندارد.
      </p>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Desktop / tablet horizontal scroller */}
      <div className="hidden md:block">
        <div
          className="relative overflow-x-auto pb-4"
          role="listbox"
          aria-label="خط زمان افقی"
          aria-activedescendant={active.id}
        >
          <div className="relative min-w-max px-2 pt-8">
            <div className="absolute inset-x-8 top-[2.85rem] h-px bg-rule" aria-hidden="true" />
            <ol className="flex gap-4">
              {events.map((event, index) => {
                const selected = event.id === active.id;
                return (
                  <li key={event.id} className="w-52 shrink-0">
                    <button
                      type="button"
                      id={event.id}
                      role="option"
                      aria-selected={selected}
                      onClick={() => setActiveId(event.id)}
                      className={cn(
                        "group relative w-full rounded-lg border px-4 pb-4 pt-8 text-start transition-colors",
                        selected
                          ? "border-pine bg-mint-soft/60 shadow-[0_12px_40px_-24px_rgb(var(--accent))]"
                          : "border-ink/10 bg-surface hover:border-pine/40/50",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-1/2 top-0 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-paper",
                          selected ? "border-pine bg-pine" : "border-ink/10",
                        )}
                        aria-hidden="true"
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            selected ? "bg-white" : "bg-rule",
                          )}
                        />
                      </span>
                      <p className="text-xs text-bronze">
                        {toPersianDigits(index + 1)}. {event.year}
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-ink group-hover:text-pine">
                        {event.title}
                      </p>
                      {event.category ? (
                        <p className="mt-2 text-xs text-ink-muted">{event.category}</p>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Mobile vertical */}
      <ol className="space-y-3 md:hidden" aria-label="خط زمان عمودی">
        {events.map((event) => {
          const selected = event.id === active.id;
          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => setActiveId(event.id)}
                className={cn(
                  "flex w-full gap-4 border px-4 py-4 text-start transition-colors",
                  selected
                    ? "border-pine bg-mint-soft/50"
                    : "border-ink/10 bg-surface",
                )}
                aria-pressed={selected}
              >
                <span className="mt-1 flex flex-col items-center">
                  <span
                    className={cn(
                      "size-3 rounded-full",
                      selected ? "bg-pine" : "bg-rule",
                    )}
                  />
                  <span className="mt-2 w-px flex-1 bg-rule" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-xs text-bronze">{event.year}</span>
                  <span className="mt-1 block font-medium text-ink">{event.title}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Detail panel */}
      <article
        className="grid gap-8 border border-ink/10 bg-surface p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8"
        aria-live="polite"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{active.year}</Badge>
            {active.category ? <Badge>{active.category}</Badge> : null}
            {active.status === "placeholder" ? (
              <Badge tone="placeholder">نمونه</Badge>
            ) : null}
          </div>
          <h3 className="text-display mt-4 text-2xl text-ink md:text-3xl">{active.title}</h3>
          {active.location ? (
            <p className="mt-2 text-sm text-ink-muted">مکان: {active.location}</p>
          ) : null}
          <p className="mt-4 text-base leading-8 text-ink-muted">{active.description}</p>
          {active.source ? (
            <p className="mt-4 text-xs text-ink-muted">منبع: {active.source}</p>
          ) : active.status === "placeholder" ? (
            <p className="mt-4 text-xs text-bronze">منبع: هنوز ثبت نشده</p>
          ) : null}
        </div>

        <div className="space-y-4 border-t border-ink/10 pt-6 md:border-s md:border-t-0 md:ps-8 md:pt-0">
          <h4 className="text-sm font-medium text-ink">شبکهٔ محتوا</h4>
          {active.relatedItems?.length ? (
            <ul className="space-y-2">
              {active.relatedItems.map((id) => (
                <li key={id}>
                  <Link
                    href={relatedHrefMap[id] ?? "/archive"}
                    className="flex items-center justify-between border border-ink/10 px-3 py-2 text-sm transition-colors hover:border-pine/40 hover:text-pine"
                  >
                    <span>{relatedLabel(id)}</span>
                    <span className="text-xs text-ink-muted">{id}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-muted">محتوای مرتبطی ثبت نشده است.</p>
          )}
          <div className="pt-2">
            <Link
              href="/about/biography"
              className="text-sm font-medium text-pine hover:underline"
            >
              ادامه در زندگی‌نامه
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
