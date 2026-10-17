"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Clock3,
  FolderOpen,
  ImageIcon,
  LayoutGrid,
  Pencil,
  PencilLine,
  Plus,
  Rocket,
} from "lucide-react";
import ActionIconButton from "@/components/ActionIconButton";
import FilterPills from "@/components/FilterPills";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import { apiListArticles, type AdminArticle } from "@/lib/api/articles";
import { toPersianDigits } from "@/lib/digits";
import { mediaAssetUrl } from "@/lib/mediaAssetUrl";
import { ports } from "@drmojtahedi/shared";

type StatusFilter = "all" | "published" | "draft" | "coming-soon";

export default function ArticlesListClient() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<AdminArticle[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await apiListArticles(accessToken);
        if (!cancelled) {
          setItems(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "بارگذاری ناموفق");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.category?.trim()) set.add(item.category.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fa"));
  }, [items]);

  const statusCounts = useMemo(() => {
    const counts = { all: items.length, published: 0, draft: 0, "coming-soon": 0 };
    for (const item of items) {
      if (item.status === "published") counts.published += 1;
      else if (item.status === "draft") counts.draft += 1;
      else if (item.status === "coming-soon") counts["coming-soon"] += 1;
    }
    return counts;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (!q) return true;
      return `${item.title} ${item.category ?? ""} ${item.slug}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter, categoryFilter]);

  return (
    <div>
      <PageHeader
        title="مقالات"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} مقاله${isApiEnabled() ? "" : " (دمو)"}`
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/articles/categories" className="btn-secondary !gap-1.5 !py-2 text-xs">
              <FolderOpen className="h-4 w-4" />
              دسته‌ها
            </Link>
            <Link href="/articles/new" className="btn-primary !gap-1.5 !py-2 text-xs">
              <Plus className="h-4 w-4" />
              مقاله جدید
            </Link>
          </div>
        }
      />

      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4 dark:bg-mint/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            همان رویکرد مقالات بینا: فهرست + صفحهٔ ویرایش جدا، بدنهٔ بلوکی، دستهٔ
            انتخابی و تاریخ انتشار.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mb-4 space-y-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو عنوان، دسته یا اسلاگ…"
        />
        <FilterPills<StatusFilter>
          label="وضعیت انتشار"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "همه", count: statusCounts.all, icon: LayoutGrid },
            {
              value: "published",
              label: "منتشر",
              count: statusCounts.published,
              icon: Rocket,
            },
            { value: "draft", label: "پیش‌نویس", count: statusCounts.draft, icon: PencilLine },
            {
              value: "coming-soon",
              label: "به‌زودی",
              count: statusCounts["coming-soon"],
              icon: Clock3,
            },
          ]}
        />
        {categories.length ? (
          <FilterPills
            label="دسته"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: "all", label: "همه دسته‌ها", count: items.length },
              ...categories.map((c) => ({
                value: c,
                label: c,
                count: items.filter((i) => i.category === c).length,
              })),
            ]}
          />
        ) : null}
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            مقاله‌ای نیست — یک مقاله جدید بسازید.
          </li>
        ) : (
          filtered.map((item) => {
            const coverSrc = mediaAssetUrl(item.cover || item.heroImage?.src || "");
            return (
            <li
              key={String(item.id)}
              className="rounded-2xl border border-ink/10 bg-surface p-4 transition hover:border-pine/25"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-cream/60">
                    {coverSrc ? (
                      <Image
                        src={coverSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-muted/50">
                        <ImageIcon className="h-5 w-5" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.category ? (
                      <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] text-ink-muted">
                        {item.category}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                        item.status === "published"
                          ? "bg-mint-soft text-pine"
                          : item.status === "draft"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-cream text-ink-muted"
                      }`}
                    >
                      {item.status === "published"
                        ? "منتشر"
                        : item.status === "draft"
                          ? "پیش‌نویس"
                          : "به‌زودی"}
                    </span>
                    {(item.dateLabel || item.date_label) && (
                      <span className="text-[11px] text-ink-muted">
                        {item.dateLabel || item.date_label}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-semibold text-ink">{item.title}</h2>
                  {item.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                      {item.description}
                    </p>
                  ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <ActionIconButton
                    label="مشاهده در سایت"
                    href={`http://localhost:${ports.site}/magazine/${item.slug}`}
                    external
                  >
                    <BookOpen className="h-4 w-4" />
                  </ActionIconButton>
                  <ActionIconButton
                    label="ویرایش"
                    href={`/articles/${item.id}`}
                    variant="primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </ActionIconButton>
                </div>
              </div>
            </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
