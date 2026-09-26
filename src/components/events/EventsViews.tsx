"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, CalendarDays, MapPin } from "lucide-react";
import { ArticleCover } from "@/components/magazine/ArticleCover";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/shared/PageHero";
import {
  countEventsBySchedule,
  filterEvents,
  resolveEventSchedule,
  type EventFilter,
} from "@/lib/events/schedule";
import type { Article, EventItem } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { toPersianDigits } from "@/lib/utils/digits";

function eventAsArticle(event: EventItem): Article {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    status: event.status,
    category: event.category,
    coverTone: event.coverTone,
    heroImage: event.image,
  };
}

function EventFilterPills({
  value,
  onChange,
  counts,
}: {
  value: EventFilter;
  onChange: (next: EventFilter) => void;
  counts: { all: number; upcoming: number; past: number };
}) {
  const pills: { id: EventFilter; label: string; count: number }[] = [
    { id: "all", label: "همه", count: counts.all },
    { id: "upcoming", label: "پیش‌رو", count: counts.upcoming },
    { id: "past", label: "گذشته", count: counts.past },
  ];

  return (
    <div
      className="inline-flex flex-wrap gap-2 rounded-full border border-ink/10 bg-surface p-1.5 shadow-sm"
      role="tablist"
      aria-label="فیلتر رویدادها"
    >
      {pills.map((pill) => {
        const active = value === pill.id;
        return (
          <button
            key={pill.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(pill.id)}
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
  );
}

function EventCard({ event }: { event: EventItem }) {
  const schedule = resolveEventSchedule(event);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
    >
      <ArticleCover
        article={eventAsArticle(event)}
        className="aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
          <Badge tone={schedule === "upcoming" ? "pine" : "bronze"}>
            {schedule === "upcoming" ? "پیش‌رو" : "گذشته"}
          </Badge>
          {event.category ? (
            <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-ink-muted dark:bg-mint">
              {event.category}
            </span>
          ) : null}
          {event.dateLabel ? (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" aria-hidden />
              {event.dateLabel}
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 text-lg font-bold leading-8 text-ink transition group-hover:text-mint-deep">
          {event.title}
        </h2>
        {event.venue ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin className="size-3.5" aria-hidden />
            {event.venue}
          </p>
        ) : null}
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
          {event.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mint-deep">
          جزئیات رویداد
          <ArrowLeft className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function EventsIndex({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState<EventFilter>("upcoming");
  const counts = useMemo(() => {
    const bySchedule = countEventsBySchedule(events);
    return {
      all: events.length,
      upcoming: bySchedule.upcoming,
      past: bySchedule.past,
    };
  }, [events]);
  const visible = useMemo(() => filterEvents(events, filter), [events, filter]);

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "رویدادها" }]}
        eyebrow="تقویم فرهنگی"
        title="رویدادها"
        description="برنامه‌های فرهنگی، آموزشی و یادبود مرتبط با میراث دکتر مجتهدی — پیش‌رو و گذشته."
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium">
              <CalendarDays className="size-3.5 text-mint-deep" aria-hidden />
              {toPersianDigits(events.length)} رویداد
            </span>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-5 py-2.5 text-sm font-semibold transition hover:border-pine/35 hover:text-pine"
            >
              اخبار
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          </>
        }
      />
      <section className="content-wide section-pad !pt-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <EventFilterPills value={filter} onChange={setFilter} counts={counts} />
          <p className="text-xs text-ink-muted">
            نمایش {toPersianDigits(visible.length)} از {toPersianDigits(events.length)}
          </p>
        </div>

        {visible.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-surface px-6 py-12 text-center">
            <p className="text-sm text-ink-muted">
              در این دسته رویدادی ثبت نشده است.
            </p>
            <button
              type="button"
              className="mt-4 text-sm font-semibold text-pine hover:underline"
              onClick={() => setFilter("all")}
            >
              مشاهده همه رویدادها
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function EventDetail({ event }: { event: EventItem }) {
  const schedule = resolveEventSchedule(event);

  return (
    <div>
      <header className="relative isolate min-h-[18rem] overflow-hidden bg-pine sm:min-h-[22rem]">
        <ArticleCover
          article={eventAsArticle(event)}
          priority
          className="absolute inset-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/15" aria-hidden />
        <div className="content-wide relative flex min-h-[18rem] flex-col justify-end pb-8 pt-6 sm:min-h-[22rem] sm:pb-10">
          <nav aria-label="مسیر" className="mb-5 text-xs text-white/75">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  خانه
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/events" className="hover:text-white">
                  رویدادها
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="line-clamp-1 text-white/90">{event.title}</li>
            </ol>
          </nav>
          <div className="flex flex-wrap gap-2 text-xs text-white/85">
            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              {schedule === "upcoming" ? "پیش‌رو" : "گذشته"}
            </span>
            {event.category ? (
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                {event.category}
              </span>
            ) : null}
            {event.dateLabel ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden />
                {event.dateLabel}
              </span>
            ) : null}
          </div>
          <h1 className="text-display mt-4 max-w-3xl text-3xl text-white sm:text-4xl">
            {event.title}
          </h1>
          {event.venue ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="size-4" aria-hidden />
              {event.venue}
            </p>
          ) : null}
        </div>
      </header>

      <article className="content-wide section-pad !pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            <p className="text-base leading-9 text-ink-muted md:text-lg">{event.description}</p>
            {event.body ? (
              <p className="mt-6 text-justify text-sm leading-8 text-ink-muted sm:text-base sm:leading-9">
                {event.body}
              </p>
            ) : null}
            {event.speakers?.length ? (
              <div className="mt-8 rounded-2xl border border-ink/10 bg-mint-soft/50 p-5">
                <p className="text-xs font-semibold text-pine">سخنرانان / مهمانان</p>
                <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                  {event.speakers.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold hover:border-pine/35 hover:text-pine"
              >
                <ArrowLeft className="size-4 rotate-180" aria-hidden />
                همه رویدادها
              </Link>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
              >
                اخبار مرتبط
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-ink/10 bg-surface p-5 text-sm">
              <p className="text-xs font-semibold text-ink">اطلاعات</p>
              <dl className="mt-3 space-y-2.5 text-xs text-ink-muted">
                <div className="flex justify-between gap-3">
                  <dt>وضعیت</dt>
                  <dd className="font-medium text-ink">
                    {schedule === "upcoming" ? "پیش‌رو" : "گذشته"}
                  </dd>
                </div>
                {event.dateLabel ? (
                  <div className="flex justify-between gap-3">
                    <dt>زمان</dt>
                    <dd className="font-medium text-ink">{event.dateLabel}</dd>
                  </div>
                ) : null}
                {event.venue ? (
                  <div className="flex justify-between gap-3">
                    <dt>مکان</dt>
                    <dd className="text-end font-medium text-ink">{event.venue}</dd>
                  </div>
                ) : null}
                {event.category ? (
                  <div className="flex justify-between gap-3">
                    <dt>نوع</dt>
                    <dd className="font-medium text-ink">{event.category}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
