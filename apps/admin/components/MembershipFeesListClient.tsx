"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  LayoutGrid,
  SearchX,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState, { NO_MATCH_DESCRIPTION, NO_MATCH_TITLE } from "@/components/EmptyState";
import FilterPills from "@/components/FilterPills";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  apiDeleteMembershipFee,
  apiListMembershipFees,
  apiPatchMembershipFee,
  type MembershipFeeRow,
} from "@/lib/api/resources";
import { formatFaDateTime, toPersianDigits } from "@/lib/digits";

type StatusFilter =
  | "all"
  | "awaiting_transfer"
  | "redirected"
  | "paid"
  | "cancelled"
  | "failed"
  | "pending";

const STATUS_LABEL: Record<string, string> = {
  pending: "در انتظار",
  redirected: "هدایت به درگاه",
  awaiting_transfer: "در انتظار واریز",
  paid: "پرداخت‌شده",
  cancelled: "لغوشده",
  failed: "ناموفق",
};

function formatAmount(amount: number) {
  return `${toPersianDigits(amount.toLocaleString("en-US"))} ریال`;
}

export default function MembershipFeesListClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<MembershipFeeRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MembershipFeeRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      setRows(await apiListMembershipFees(accessToken));
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
    const counts: Record<StatusFilter, number> = {
      all: rows.length,
      pending: 0,
      redirected: 0,
      awaiting_transfer: 0,
      paid: 0,
      cancelled: 0,
      failed: 0,
    };
    for (const r of rows) {
      const s = (r.status || "pending") as StatusFilter;
      if (s in counts && s !== "all") counts[s] += 1;
    }
    return counts;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && (r.status || "pending") !== statusFilter) {
        return false;
      }
      if (!q) return true;
      const name = r.memberName || "";
      const phone = r.memberPhone || "";
      const tier = r.tierTitle || r.tier_title || "";
      return `${name} ${phone} ${tier}`.toLowerCase().includes(q);
    });
  }, [rows, query, statusFilter]);

  async function setStatus(row: MembershipFeeRow, status: string) {
    if (!accessToken) return;
    setBusyId(row.id);
    try {
      await apiPatchMembershipFee(accessToken, row.id, { status });
      toast.success(
        status === "paid"
          ? "تأیید شد — عضویت عضو فعال شد"
          : "وضعیت به‌روز شد",
      );
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
      await apiDeleteMembershipFee(accessToken, deleteTarget.id);
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
        title="حق عضویت"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} رکورد${isApiEnabled() ? "" : " (دمو)"}`
        }
      />
      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-white">
            <CreditCard className="h-5 w-5" />
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            سوابق پرداخت حق عضویت سالانه. با تأیید، وضعیت عضو به «فعال» و اعتبار تا
            پایان سال بعد تنظیم می‌شود.
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در نام، تلفن یا ارکان…"
        />
        <FilterPills<StatusFilter>
          label="وضعیت"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "همه", count: statusCounts.all, icon: LayoutGrid },
            {
              value: "awaiting_transfer",
              label: "در انتظار واریز",
              count: statusCounts.awaiting_transfer,
              icon: Clock3,
            },
            {
              value: "redirected",
              label: "درگاه",
              count: statusCounts.redirected,
              icon: Clock3,
            },
            {
              value: "paid",
              label: "پرداخت‌شده",
              count: statusCounts.paid,
              icon: CheckCircle2,
            },
            {
              value: "cancelled",
              label: "لغو",
              count: statusCounts.cancelled,
              icon: XCircle,
            },
          ]}
        />
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="list-none">
            <EmptyState
              icon={query.trim() || statusFilter !== "all" ? SearchX : CreditCard}
              title={
                query.trim() || statusFilter !== "all"
                  ? NO_MATCH_TITLE
                  : "هنوز حق عضویتی ثبت نشده"
              }
              description={
                query.trim() || statusFilter !== "all"
                  ? NO_MATCH_DESCRIPTION
                  : "پرداخت‌های حق عضویت اعضا، پس از شروع فرایند پرداخت، اینجا دیده می‌شوند."
              }
              action={
                query.trim() || statusFilter !== "all" ? (
                  <button
                    type="button"
                    className="btn-secondary !py-2 text-xs"
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    پاک کردن فیلتر
                  </button>
                ) : undefined
              }
            />
          </li>
        ) : (
          filtered.map((r) => {
            const status = r.status || "pending";
            const busy = busyId === r.id;
            const name = r.memberName || "بدون نام";
            const tier = r.tierTitle || r.tier_title || "—";
            return (
              <li
                key={String(r.id)}
                className="rounded-2xl border border-ink/10 bg-surface p-5"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  <span
                    className={`rounded-full px-2.5 py-0.5 ${
                      status === "paid"
                        ? "bg-mint-soft text-pine"
                        : status === "cancelled" || status === "failed"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {STATUS_LABEL[status] ?? status}
                  </span>
                  <span>{formatFaDateTime(r.createdAt || r.created_at)}</span>
                  <span className="rounded-full bg-cream px-2.5 py-0.5">{tier}</span>
                  {r.periodYear || r.period_year ? (
                    <span>
                      دوره {toPersianDigits(String(r.periodYear || r.period_year))}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 font-semibold text-ink">
                  {formatAmount(r.amount)}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {name}
                  {r.memberPhone ? (
                    <span dir="ltr"> · {r.memberPhone}</span>
                  ) : null}
                  {" · "}
                  {r.gatewayLabel ||
                    (r.method === "card_to_card" ? "کارت‌به‌کارت" : r.gateway || "—")}
                </p>
                {(r.transactionId || r.transaction_id) && (
                  <p className="mt-1 text-xs text-ink-muted" dir="ltr">
                    {r.transactionId || r.transaction_id}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {status !== "paid" ? (
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={busy}
                      onClick={() => void setStatus(r, "paid")}
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      تأیید پرداخت
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
        title="حذف رکورد حق عضویت؟"
        description="این سابقه از فهرست حذف می‌شود."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
