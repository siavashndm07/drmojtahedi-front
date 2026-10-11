"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, CheckCircle2, FileHeart, LayoutGrid, Sparkles } from "lucide-react";
import FilterPills from "@/components/FilterPills";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import { apiListContributions, type ContributionRow } from "@/lib/api/resources";
import { formatFaDateTime, toPersianDigits } from "@/lib/digits";

type StatusFilter = "all" | "new" | "reviewed" | "archived";

const TYPE_LABEL: Record<string, string> = {
  memory: "خاطره",
  photo: "عکس",
  document: "سند",
  book: "کتاب",
  artifact: "اثر",
  other: "سایر",
};

export default function ContributionsAdminPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<ContributionRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await apiListContributions(accessToken);
        if (!cancelled) {
          setRows(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "بارگذاری ناموفق");
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const statusCounts = useMemo(() => {
    const counts = { all: rows.length, new: 0, reviewed: 0, archived: 0 };
    for (const r of rows) {
      const s = (r.status || "new") as keyof typeof counts;
      if (s in counts && s !== "all") counts[s] += 1;
    }
    return counts;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && (r.status || "new") !== statusFilter) return false;
      if (!q) return true;
      return `${r.title} ${r.name} ${r.body}`.toLowerCase().includes(q);
    });
  }, [rows, query, statusFilter]);

  return (
    <div>
      <PageHeader
        title="ارسال خاطره و سند"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} درخواست${isApiEnabled() ? "" : " (دمو)"}`
        }
      />
      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4 dark:bg-mint/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-white">
            <FileHeart className="h-5 w-5" />
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            ارسال‌های فرم «خاطره و سند» سایت — فهرست و فیلتر مشابه پیام‌های تماس
            در پنل بینا.
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
          placeholder="جستجو در عنوان یا نام…"
        />
        <FilterPills<StatusFilter>
          label="وضعیت"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "همه", count: statusCounts.all, icon: LayoutGrid },
            { value: "new", label: "جدید", count: statusCounts.new, icon: Sparkles },
            {
              value: "reviewed",
              label: "بررسی‌شده",
              count: statusCounts.reviewed,
              icon: CheckCircle2,
            },
            {
              value: "archived",
              label: "بایگانی",
              count: statusCounts.archived,
              icon: Archive,
            },
          ]}
        />
      </div>
      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            موردی نیست
          </li>
        ) : (
          filtered.map((r) => (
            <li key={String(r.id)} className="rounded-2xl border border-ink/10 bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                <span className="rounded-full bg-cream px-2.5 py-0.5">
                  {TYPE_LABEL[r.type] ?? r.type}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 ${
                    (r.status || "new") === "new"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-mint-soft text-pine"
                  }`}
                >
                  {r.status || "new"}
                </span>
                <span>{formatFaDateTime(r.created_at)}</span>
              </div>
              <h2 className="mt-2 font-semibold text-ink">{r.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {r.name}
                {r.phone || r.email ? ` · ${r.phone || r.email}` : ""}
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{r.body}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
