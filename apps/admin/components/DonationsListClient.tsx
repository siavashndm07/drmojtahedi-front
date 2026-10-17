"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Clock3,
  HandHeart,
  LayoutGrid,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterPills from "@/components/FilterPills";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  apiDeleteDonation,
  apiListDonations,
  apiPatchDonation,
  type DonationRow,
} from "@/lib/api/resources";
import { formatFaDateTime, toPersianDigits } from "@/lib/digits";

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

const STATUS_LABEL: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تأییدشده",
  cancelled: "لغوشده",
};

function formatAmount(amount: number) {
  return `${toPersianDigits(amount.toLocaleString("en-US"))} ریال`;
}

export default function DonationsListClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<DonationRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DonationRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      setRows(await apiListDonations(accessToken));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "بارگذاری ناموفق");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const statusCounts = useMemo(() => {
    const counts = { all: rows.length, pending: 0, confirmed: 0, cancelled: 0 };
    for (const r of rows) {
      const s = (r.status || "pending") as keyof typeof counts;
      if (s in counts && s !== "all") counts[s] += 1;
    }
    return counts;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && (r.status || "pending") !== statusFilter) return false;
      if (!q) return true;
      const name = r.donorName || r.donor_name || "";
      return `${name} ${r.phone ?? ""} ${r.goal ?? ""}`.toLowerCase().includes(q);
    });
  }, [rows, query, statusFilter]);

  async function setStatus(row: DonationRow, status: string) {
    if (!accessToken) return;
    setBusyId(row.id);
    try {
      await apiPatchDonation(accessToken, row.id, { status });
      toast.success("وضعیت به‌روز شد");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "به‌روزرسانی ناموفق");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!accessToken || !deleteTarget) return;
    setDeleting(true);
    try {
      await apiDeleteDonation(accessToken, deleteTarget.id);
      toast.success("حذف شد");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="کمک‌ها"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} رکورد${isApiEnabled() ? "" : " (دمو)"}`
        }
      />
      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-white">
            <HandHeart className="h-5 w-5" />
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            سوابق کمک بلاعوض ثبت‌شده از پرتال اعضا — وضعیت را تأیید یا لغو کنید.
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در نام، تلفن یا هدف…"
        />
        <FilterPills<StatusFilter>
          label="وضعیت"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "همه", count: statusCounts.all, icon: LayoutGrid },
            {
              value: "pending",
              label: "در انتظار",
              count: statusCounts.pending,
              icon: Clock3,
            },
            {
              value: "confirmed",
              label: "تأییدشده",
              count: statusCounts.confirmed,
              icon: CheckCircle2,
            },
            {
              value: "cancelled",
              label: "لغوشده",
              count: statusCounts.cancelled,
              icon: XCircle,
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
          filtered.map((r) => {
            const name = r.donorName || r.donor_name || "بدون نام";
            const status = r.status || "pending";
            const busy = busyId === r.id;
            return (
              <li key={String(r.id)} className="rounded-2xl border border-ink/10 bg-surface p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  <span
                    className={`rounded-full px-2.5 py-0.5 ${
                      status === "confirmed"
                        ? "bg-mint-soft text-pine"
                        : status === "cancelled"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {STATUS_LABEL[status] ?? status}
                  </span>
                  <span>{formatFaDateTime(r.created_at)}</span>
                  {r.goal ? <span className="rounded-full bg-cream px-2.5 py-0.5">{r.goal}</span> : null}
                </div>
                <h2 className="mt-2 font-semibold text-ink">{formatAmount(r.amount)}</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {name}
                  {r.phone ? ` · ${r.phone}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {status !== "confirmed" ? (
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={busy}
                      onClick={() => void setStatus(r, "confirmed")}
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      تأیید
                    </button>
                  ) : null}
                  {status !== "cancelled" ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={busy}
                      onClick={() => void setStatus(r, "cancelled")}
                    >
                      لغو
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteTarget(r)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    حذف
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف رکورد کمک؟"
        description="این سابقه از فهرست حذف می‌شود."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
