"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";
import { apiListContributions, type ContributionRow } from "@/lib/api/resources";

export default function ContributionsAdminPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<ContributionRow[]>([]);
  useEffect(() => {
    if (!accessToken) return;
    apiListContributions(accessToken).then(setRows).catch(() => setRows([]));
  }, [accessToken]);
  return (
    <div>
      <PageHeader title="ارسال خاطره و سند" description="درخواست‌های ارسالی از سایت." />
      <ul className="space-y-3">
        {rows.length === 0 ? (
          <li className="rounded-2xl border border-ink/10 bg-surface p-6 text-sm text-ink-muted">موردی نیست</li>
        ) : rows.map((r) => (
          <li key={String(r.id)} className="rounded-2xl border border-ink/10 bg-surface p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <span>{r.type}</span>
              <span>{r.status ?? "new"}</span>
              <span>{r.created_at?.slice(0, 10)}</span>
            </div>
            <h2 className="mt-2 font-semibold text-ink">{r.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{r.name} · {r.phone || r.email}</p>
            <p className="mt-3 text-sm leading-7 text-ink-muted">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
