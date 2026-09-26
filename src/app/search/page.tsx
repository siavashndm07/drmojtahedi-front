import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  BookOpen,
  CalendarDays,
  Landmark,
  Library,
  MapPin,
  Newspaper,
  Search,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { search } from "@/lib/api/search";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { SearchResultCategory } from "@/lib/types";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "جستجو",
  description: "جستجو در افراد، آرشیو، موزه، رویدادها و مقالات.",
  path: "/search",
});

const categories: {
  id: SearchResultCategory;
  label: string;
  icon: typeof Search;
}[] = [
  { id: "all", label: "همه", icon: Search },
  { id: "people", label: "افراد", icon: Users },
  { id: "archive", label: "آرشیو", icon: Archive },
  { id: "museum", label: "موزه", icon: Landmark },
  { id: "events", label: "رویدادها", icon: CalendarDays },
  { id: "news", label: "اخبار", icon: Newspaper },
  { id: "articles", label: "مقالات", icon: BookOpen },
  { id: "library", label: "کتابخانه", icon: Library },
  { id: "places", label: "مکان‌ها", icon: MapPin },
];

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category =
    typeof params.category === "string"
      ? (params.category as SearchResultCategory)
      : "all";

  const results = await search(q, { category });

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "جستجو" }]}
        title="جستجو"
        description="رابط جستجو آماده اتصال به جستجوی معنایی بک‌اند است."
      />
      <div className="content-shell section-pad !pt-8">
        <form className="flex flex-col gap-3 sm:flex-row" action="/search" method="get">
          <label className="sr-only" htmlFor="q">
            عبارت جستجو
          </label>
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 end-3 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="جستجو…"
              className="w-full rounded-xl border border-ink/10 bg-surface py-3 pe-10 ps-4 text-sm shadow-sm focus:border-pine focus:outline-none focus:ring-2 focus:ring-mint-deep/30"
            />
          </div>
          <input type="hidden" name="category" value={category} />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark"
          >
            <Search className="size-4" aria-hidden />
            جستجو
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((item) => {
            const href = `/search?q=${encodeURIComponent(q)}&category=${item.id}`;
            const active = category === item.id;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={href}
                className={
                  active
                    ? "inline-flex items-center gap-1.5 rounded-full bg-pine px-3 py-1.5 text-sm text-white"
                    : "inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-sm text-ink-muted hover:border-pine/40 hover:text-pine"
                }
              >
                <Icon className="size-3.5" strokeWidth={1.8} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          {toPersianDigits(results.length)} نتیجه
        </p>

        <div className="mt-4 space-y-3">
          {results.length === 0 ? (
            <EmptyState
              title="نتیجه‌ای یافت نشد"
              description="عبارت دیگری را امتحان کنید یا دسته‌بندی را تغییر دهید."
            />
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-surface px-5 py-4 shadow-sm transition hover:border-pine/40"
              >
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-pine">
                  <BookOpen className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <p className="text-xs text-bronze">{item.category}</p>
                  <h2 className="mt-1 text-lg font-medium">{item.title}</h2>
                  {item.excerpt ? (
                    <p className="mt-1 text-sm text-ink-muted">{item.excerpt}</p>
                  ) : null}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
