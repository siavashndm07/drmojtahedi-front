import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  BookOpen,
  FolderKanban,
  MapPin,
  Newspaper,
  Search,
  SearchX,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { search, searchCategoryLabels } from "@/lib/api/search";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { SearchResultCategory } from "@/lib/types";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "جستجو",
  description: "جستجو در افراد، مکان‌ها، آرشیو، اخبار، مقالات، کتاب‌ها و پروژه‌ها.",
  path: "/search",
});

const categories: {
  id: SearchResultCategory;
  label: string;
  icon: typeof Search;
}[] = [
  { id: "all", label: "همه", icon: Search },
  { id: "people", label: "افراد", icon: Users },
  { id: "places", label: "مکان‌ها", icon: MapPin },
  { id: "archive", label: "آرشیو", icon: Archive },
  { id: "news", label: "اخبار", icon: Newspaper },
  { id: "articles", label: "مقالات", icon: BookOpen },
  { id: "library", label: "کتابخانه و پروژه", icon: FolderKanban },
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
        eyebrow="جستجو"
        title="جستجو در محتوای بنیاد"
        description="افراد، مکان‌ها، اخبار، مقالات، آرشیو، کتاب‌ها و پروژه‌ها."
      />
      <div className="content-shell section-pad !pt-8 space-y-8">
        <form className="flex flex-col gap-3 sm:flex-row" action="/search" method="get">
          <label className="sr-only" htmlFor="q">
            عبارت جستجو
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="مثلاً البرز، مجتهدی، محجوبی…"
            className="w-full rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm shadow-sm focus:border-pine/40 focus:outline-none focus:ring-2 focus:ring-pine/20"
          />
          <input type="hidden" name="category" value={category} />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark"
          >
            <Search className="size-4" aria-hidden />
            جستجو
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id;
            const href = q
              ? `/search?q=${encodeURIComponent(q)}&category=${cat.id}`
              : `/search?category=${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                className={
                  active
                    ? "inline-flex items-center gap-1.5 rounded-full bg-pine px-3.5 py-1.5 text-xs font-semibold text-white"
                    : "inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink-muted hover:border-pine/40 hover:text-pine"
                }
              >
                <Icon className="size-3.5" aria-hidden />
                {cat.label}
              </Link>
            );
          })}
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="نتیجه‌ای یافت نشد"
            description="عبارت دیگری را امتحان کنید یا از دسته‌بندی‌ها استفاده کنید."
            actionHref="/news"
            actionLabel="اخبار بنیاد"
          />
        ) : (
          <ul className="space-y-3">
            <p className="text-sm text-ink-muted">
              {toPersianDigits(results.length)} نتیجه
              {q ? ` برای «${q}»` : ""}
            </p>
            {results.map((item) => (
              <li key={`${item.category}-${item.id}`}>
                <Link
                  href={item.href}
                  className="block rounded-2xl border border-ink/10 bg-surface px-5 py-4 transition hover:border-pine/40"
                >
                  <p className="text-xs text-bronze">
                    {searchCategoryLabels[item.category] ?? item.category}
                  </p>
                  <h2 className="mt-1 text-lg font-medium text-ink">{item.title}</h2>
                  {item.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-ink-muted">
                      {item.excerpt}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
