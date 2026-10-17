"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import {
  Checkbox,
  Field,
  Input,
  NumberInput,
  Textarea,
  formDialogClassName,
  formDialogFieldsClassName,
  formDialogFullClassName,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import {
  apiDeleteMembershipTier,
  apiListMembershipTiers,
  apiSaveMembershipTier,
  type MembershipTierRow,
} from "@/lib/api/resources";
import { toPersianDigits } from "@/lib/digits";

function feeOf(row: MembershipTierRow) {
  return Number(row.annualFeeRials ?? row.annual_fee_rials ?? 0);
}

function activeOf(row: MembershipTierRow) {
  return row.isActive ?? row.is_active ?? true;
}

function sortOf(row: MembershipTierRow) {
  return Number(row.sortOrder ?? row.sort_order ?? 0);
}

export default function MembershipTiersClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<MembershipTierRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<MembershipTierRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    annualFeeRials: 0,
    description: "",
    sortOrder: 0,
    isActive: true,
  });
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MembershipTierRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const list = await apiListMembershipTiers(accessToken);
      list.sort((a, b) => sortOf(a) - sortOf(b) || Number(a.id) - Number(b.id));
      setRows(list);
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.title.toLowerCase().includes(q));
  }, [rows, query]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setForm({
      title: "",
      annualFeeRials: 0,
      description: "",
      sortOrder: rows.length + 1,
      isActive: true,
    });
  }

  function openEdit(row: MembershipTierRow) {
    setCreating(false);
    setEditing(row);
    setForm({
      title: row.title,
      annualFeeRials: feeOf(row),
      description: row.description || "",
      sortOrder: sortOf(row),
      isActive: activeOf(row),
    });
  }

  function closeForm() {
    if (busy) return;
    setCreating(false);
    setEditing(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    if (!form.title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }
    setBusy(true);
    try {
      await apiSaveMembershipTier(
        accessToken,
        {
          title: form.title.trim(),
          annualFeeRials: form.annualFeeRials,
          description: form.description.trim(),
          sortOrder: form.sortOrder,
          isActive: form.isActive,
        },
        editing?.id,
      );
      toast.success("ذخیره شد");
      closeForm();
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
      await apiDeleteMembershipTier(accessToken, deleteTarget.id);
      toast.success("حذف شد");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeleting(false);
    }
  }

  const formOpen = creating || !!editing;
  const dialog =
    formOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="بستن"
              onClick={closeForm}
            />
            <div
              role="dialog"
              aria-modal="true"
              className={formDialogClassName}
            >
              <h2 className="text-base font-bold text-ink">
                {editing ? "ویرایش نوع عضویت" : "نوع عضویت جدید"}
              </h2>
              <form onSubmit={onSubmit} noValidate className={`mt-4 ${formDialogFieldsClassName}`}>
                <Field label="عنوان ارکان / نوع عضویت" htmlFor="tier-title">
                  <Input
                    id="tier-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="مثلاً عضو پیوسته"
                  />
                </Field>
                <Field label="حق عضویت سالانه (ریال)" htmlFor="tier-fee">
                  <NumberInput
                    id="tier-fee"
                    value={form.annualFeeRials}
                    min={0}
                    step={1000}
                    onChange={(value) =>
                      setForm((f) => ({ ...f, annualFeeRials: value ?? 0 }))
                    }
                  />
                </Field>
                <Field label="ترتیب نمایش" htmlFor="tier-sort">
                  <NumberInput
                    id="tier-sort"
                    value={form.sortOrder}
                    min={0}
                    step={1}
                    onChange={(value) =>
                      setForm((f) => ({ ...f, sortOrder: value ?? 0 }))
                    }
                  />
                </Field>
                <Field label="توضیح" htmlFor="tier-desc" className={formDialogFullClassName}>
                  <Textarea
                    id="tier-desc"
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                  />
                </Field>
                <Checkbox
                  className={formDialogFullClassName}
                  id="tier-active"
                  label="فعال"
                  description="در انتخاب عضو و پرداخت نمایش داده شود."
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                />
                <div className={`${formDialogFullClassName} flex justify-end gap-2 border-t border-ink/10 pt-4`}>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={closeForm}
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
        title="انواع عضویت (ارکان)"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} نوع — حق عضویت سالانه برای هر ارکان`
        }
        action={
          <button type="button" className="btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            افزودن
          </button>
        }
      />

      <div className="mb-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در عنوان…"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-cream/60 text-start text-xs text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">عنوان</th>
              <th className="px-4 py-3 font-medium">حق عضویت سالانه</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-ink-muted"
                >
                  موردی نیست
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => (
                <tr key={String(row.id)} className="border-t border-ink/8">
                  <td className="px-4 py-3 text-ink-muted">
                    {toPersianDigits(sortOf(row) || index + 1)}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{row.title}</td>
                  <td className="px-4 py-3 tabular-nums text-ink" dir="ltr">
                    {toPersianDigits(feeOf(row).toLocaleString("en-US"))}
                    <span className="ms-1 text-xs text-ink-muted">ریال</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] ${
                        activeOf(row)
                          ? "bg-mint-soft text-pine"
                          : "bg-cream text-ink-muted"
                      }`}
                    >
                      {activeOf(row) ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => openEdit(row)}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        ویرایش
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteTarget(row)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {dialog}

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف نوع عضویت؟"
        description="اعضای متصل به این نوع بدون ارکان می‌مانند."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
