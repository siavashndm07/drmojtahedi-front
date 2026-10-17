"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Trash2, Users } from "lucide-react";
import { createPortal } from "react-dom";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import { Field, Input, Select } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  apiDeleteMember,
  apiListMembers,
  apiListMembershipTiers,
  apiPatchMember,
  type MemberRow,
  type MembershipTierRow,
} from "@/lib/api/resources";
import { formatFaDateTime, toPersianDigits } from "@/lib/digits";

function displayName(row: MemberRow) {
  const first = row.firstName || row.first_name || "";
  const last = row.lastName || row.last_name || "";
  const full = `${first} ${last}`.trim();
  return full || "بدون نام";
}

function tierIdOf(row: MemberRow): string {
  const id = row.membershipTierId ?? row.membership_tier;
  return id == null || id === "" ? "" : String(id);
}

function feeOf(row: MemberRow) {
  return Number(row.annualFeeRials ?? row.annual_fee_rials ?? 0);
}

function feeOfTier(row: MembershipTierRow) {
  return Number(row.annualFeeRials ?? row.annual_fee_rials ?? 0);
}

export default function MembersListClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [tiers, setTiers] = useState<MembershipTierRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MemberRow | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    education: "",
    city: "",
    membershipTierId: "",
  });
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MemberRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [members, membershipTiers] = await Promise.all([
        apiListMembers(accessToken),
        apiListMembershipTiers(accessToken),
      ]);
      setRows(members);
      setTiers(
        membershipTiers.filter((t) => t.isActive ?? t.is_active ?? true),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "بارگذاری ناموفق");
      setRows([]);
      setTiers([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = displayName(r);
      const type = r.membershipType || r.membership_type || "";
      return `${name} ${r.phone} ${r.city ?? ""} ${type}`.toLowerCase().includes(q);
    });
  }, [rows, query]);

  function openEdit(row: MemberRow) {
    setEditing(row);
    setForm({
      firstName: row.firstName || row.first_name || "",
      lastName: row.lastName || row.last_name || "",
      education: row.education || "",
      city: row.city || "",
      membershipTierId: tierIdOf(row),
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken || !editing) return;
    setBusy(true);
    try {
      await apiPatchMember(accessToken, editing.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        education: form.education,
        city: form.city,
        membershipTierId: form.membershipTierId
          ? Number(form.membershipTierId)
          : null,
      });
      toast.success("ذخیره شد");
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!accessToken || !deleteTarget) return;
    setDeleting(true);
    try {
      await apiDeleteMember(accessToken, deleteTarget.id);
      toast.success("حذف شد");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeleting(false);
    }
  }

  const selectedTierFee = useMemo(() => {
    if (!form.membershipTierId) return null;
    const tier = tiers.find((t) => String(t.id) === form.membershipTierId);
    return tier ? feeOfTier(tier) : null;
  }, [form.membershipTierId, tiers]);

  const dialog =
    editing && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="بستن"
              onClick={() => {
                if (!busy) setEditing(null);
              }}
            />
            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-lg rounded-2xl border border-ink/10 bg-surface p-5 shadow-xl sm:p-6"
            >
              <h2 className="text-base font-bold text-ink">ویرایش عضو</h2>
              <p className="mt-1 text-xs text-ink-muted" dir="ltr">
                {editing.phone}
              </p>
              <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
                <Field label="نام" htmlFor="member-first">
                  <Input
                    id="member-first"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  />
                </Field>
                <Field label="نام خانوادگی" htmlFor="member-last">
                  <Input
                    id="member-last"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  />
                </Field>
                <Field label="تحصیلات" htmlFor="member-edu">
                  <Input
                    id="member-edu"
                    value={form.education}
                    onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))}
                  />
                </Field>
                <Field label="شهر" htmlFor="member-city">
                  <Input
                    id="member-city"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </Field>
                <Field label="ارکان / نوع عضویت" htmlFor="member-tier">
                  <Select
                    id="member-tier"
                    value={form.membershipTierId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, membershipTierId: e.target.value }))
                    }
                  >
                    <option value="">— انتخاب نشده —</option>
                    {tiers.map((tier) => (
                      <option key={String(tier.id)} value={String(tier.id)}>
                        {tier.title}
                        {" — "}
                        {feeOfTier(tier).toLocaleString("en-US")} ریال
                      </option>
                    ))}
                  </Select>
                </Field>
                {selectedTierFee != null ? (
                  <p className="text-xs text-ink-muted">
                    حق عضویت سالانه این ارکان:{" "}
                    <span className="font-medium text-ink" dir="ltr">
                      {toPersianDigits(selectedTierFee.toLocaleString("en-US"))} ریال
                    </span>
                  </p>
                ) : null}
                <div className="flex justify-end gap-2 border-t border-ink/10 pt-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => setEditing(null)}
                  >
                    انصراف
                  </button>
                  <button type="submit" className="btn-primary" disabled={busy}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    ذخیره
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div>
      <PageHeader
        title="اعضا"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} عضو${isApiEnabled() ? "" : " (دمو)"}`
        }
      />
      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-white">
            <Users className="h-5 w-5" />
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            ارکان هر عضو را از{" "}
            <a href="/membership-tiers" className="font-medium text-pine hover:underline">
              انواع عضویت
            </a>{" "}
            انتخاب کنید؛ حق عضویت سالانه از همان ارکان گرفته می‌شود.
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در نام، تلفن یا ارکان…"
        />
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            عضوی نیست
          </li>
        ) : (
          filtered.map((r) => {
            const type = r.membershipType || r.membership_type || "—";
            const fee = feeOf(r);
            return (
              <li key={String(r.id)} className="rounded-2xl border border-ink/10 bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-ink">{displayName(r)}</h2>
                    <p className="mt-1 text-sm text-ink-muted" dir="ltr">
                      {r.phone}
                    </p>
                    <p className="mt-2 text-xs text-ink-muted">
                      {type}
                      {fee > 0
                        ? ` · ${toPersianDigits(fee.toLocaleString("en-US"))} ریال/سال`
                        : " · بدون حق عضویت"}
                      {r.city ? ` · ${r.city}` : ""}
                      {r.education ? ` · ${r.education}` : ""}
                      {" · "}
                      {formatFaDateTime(r.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn-secondary" onClick={() => openEdit(r)}>
                      ویرایش
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteTarget(r)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      حذف
                    </button>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {dialog}

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف عضو؟"
        description="پروفایل این عضو حذف می‌شود."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
