"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  countEventsBySchedule,
  filterEvents,
  resolveEventSchedule,
  type EventFilter,
} from "@/lib/events/schedule";
import { mockEvents } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";
import { toPersianDigits } from "@/lib/utils/digits";

export function EventsPreview() {
  const [filter, setFilter] = useState<EventFilter>("upcoming");
  const counts = useMemo(() => {
    const bySchedule = countEventsBySchedule(mockEvents);
    return {
      all: mockEvents.length,
      upcoming: bySchedule.upcoming,
      past: bySchedule.past,
    };
  }, []);
  const visible = useMemo(
    () => filterEvents(mockEvents, filter).slice(0, 4),
    [filter],
  );

  const pills: { id: EventFilter; label: string; count: number }[] = [
    { id: "all", label: "همه", count: counts.all },
    { id: "upcoming", label: "پیش‌رو", count: counts.upcoming },
    { id: "past", label: "گذشته", count: counts.past },
  ];

  return (
    <FadeIn>
      <section className="content-shell section-pad">
        <SectionHeading
          eyebrow="تقویم فرهنگی"
          title="رویدادهای بنیاد"
          description="برنامه‌های فرهنگی، آموزشی و یادبود — رویدادهای پیش‌رو و گذشته را فیلتر کنید."
          action={
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-pine hover:underline"
            >
              <CalendarDays className="size-4" aria-hidden />
              همه رویدادها
            </Link>
          }
        />

        <div
          className="mb-6 inline-flex flex-wrap gap-2 rounded-full border border-ink/10 bg-surface p-1.5 shadow-sm"
          role="tablist"
          aria-label="فیلتر رویدادها"
        >
          {pills.map((pill) => {
            const active = filter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(pill.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                  active
                    ? "bg-pine text-white shadow-sm"
                    : "text-ink-muted hover:bg-mint-soft hover:text-pine",
                )}
              >
                {pill.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    active ? "bg-white/20 text-white" : "bg-ink/5 text-ink-muted",
                  )}
                >
                  {toPersianDigits(pill.count)}
                </span>
              </button>
            );
          })}
        </div>

        {visible.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {visible.map((event) => {
              const schedule = resolveEventSchedule(event);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group grid gap-0 overflow-hidden rounded-2xl border border-ink/10 shadow-sm transition-colors hover:border-pine/40 md:grid-cols-[0.8fr_1.2fr]"
                >
                  <div className="flex min-h-36 flex-col justify-between bg-pine-dark/90 p-5 text-white md:min-h-full">
                    <CalendarDays className="size-5 text-white/70" aria-hidden />
                    <div>
                      <p className="text-xs text-white/60">{event.category}</p>
                      {event.venue ? (
                        <p className="mt-2 inline-flex items-center gap-1 text-sm text-white/70">
                          <MapPin className="size-3.5 shrink-0" aria-hidden />
                          {event.venue}
                        </p>
                      ) : null}
                      {event.dateLabel ? (
                        <p className="mt-1 text-xs text-white/55">{event.dateLabel}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="bg-surface p-5 md:p-6">
                    <Badge tone={schedule === "upcoming" ? "pine" : "bronze"}>
                      {schedule === "upcoming" ? "پیش‌رو" : "گذشته"}
                    </Badge>
                    <h3 className="mt-3 text-xl font-medium group-hover:text-pine">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-ink-muted">
                      {event.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-surface px-6 py-10 text-center text-sm text-ink-muted">
            در این دسته رویدادی نیست.{" "}
            <button
              type="button"
              className="font-semibold text-pine hover:underline"
              onClick={() => setFilter("all")}
            >
              همه را ببینید
            </button>
          </div>
        )}
      </section>
    </FadeIn>
  );
}
