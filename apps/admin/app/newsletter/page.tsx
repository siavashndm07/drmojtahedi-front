"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";
import { apiListNewsletter, type NewsletterRow } from "@/lib/api/resources";

export default function NewsletterAdminPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<NewsletterRow[]>([]);
  useEffect(() => {
    if (!accessToken) return;
    apiListNewsletter(accessToken).then(setRows).catch(() => setRows([]));
  }, [accessToken]);
  return (
    <div>
      <PageHeader title="خبرنامه" description="ایمیل‌های ثبت‌شده برای اطلاع‌رسانی." />
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-mint-soft/60 text-xs text-ink-muted">
            <tr>
              <th className="px-4 py-3 text-start font-medium">ایمیل</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-ink-muted">موردی نیست</td></tr>
            ) : rows.map((r) => (
              <tr key={String(r.id)} className="border-t border-ink/5">
                <td className="px-4 py-3" dir="ltr">{r.email}</td>
                <td className="px-4 py-3 text-ink-muted">{r.created_at?.slice(0, 10) ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
