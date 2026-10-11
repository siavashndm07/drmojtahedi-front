"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import { apiListNewsletter, type NewsletterRow } from "@/lib/api/resources";
import { formatFaDateTime, toPersianDigits } from "@/lib/digits";

export default function NewsletterAdminPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<NewsletterRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await apiListNewsletter(accessToken);
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.email.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div>
      <PageHeader
        title="خبرنامه"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} مشترک${isApiEnabled() ? "" : " (دمو)"}`
        }
      />
      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4 dark:bg-mint/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-white">
            <Mail className="h-5 w-5" />
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            ایمیل‌های ثبت‌شده از فرم خبرنامهٔ سایت عمومی — همان الگوی فهرست CRM
            خبرنامه در پنل بینا.
          </p>
        </div>
      </div>
      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="mb-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی ایمیل…"
          dir="ltr"
          className="text-start"
        />
      </div>
      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            مشترکی نیست
          </li>
        ) : (
          filtered.map((r) => (
            <li
              key={String(r.id)}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-surface p-4"
            >
              <p className="font-medium text-ink" dir="ltr">
                {r.email}
              </p>
              <p className="text-xs text-ink-muted">{formatFaDateTime(r.created_at)}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
