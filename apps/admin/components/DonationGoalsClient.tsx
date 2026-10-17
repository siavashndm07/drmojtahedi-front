"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import { Checkbox, Field, Input, NumberInput, Textarea } from "@/components/form";
import { useAuth } from "@/lib/auth";
import {
  apiDeleteDonationGoal,
  apiListDonationGoals,
  apiSaveDonationGoal,
  type DonationGoalRow,
} from "@/lib/api/resources";
import { toPersianDigits } from "@/lib/digits";

function sortOf(row: DonationGoalRow) {
  return Number(row.sortOrder ?? row.sort_order ?? 0);
}

function activeOf(row: DonationGoalRow) {
  return row.isActive ?? row.is_active ?? true;
}

export default function DonationGoalsClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<DonationGoalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<DonationGoalRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    sortOrder: 0,
    isActive: true,
  });
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DonationGoalRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const list = await apiListDonationGoals(accessToken);
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
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q),
    );
  }, [rows, query]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setForm({
      title: "",
      description: "",
      sortOrder: rows.length + 1,
      isActive: true,
    });
  }

  function openEdit(row: DonationGoalRow) {
    setCreating(false);
    setEditing(row);
    setForm({
      title: row.title,
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
      toast.error("عنوان هدف الزامی است");
      return;
    }
    setBusy(true);
    try {
      await apiSaveDonationGoal(
        accessToken,
        {
          title: form.title.trim(),
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
      await apiDeleteDonationGoal(accessToken, deleteTarget.id);
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
              className="relative w-full max-w-lg rounded-2xl border border-ink/10 bg-surface p-5 shadow-xl sm:p-6"
            >
              <h2 className="text-base font-bold text-ink">
                {editing ? "ویرایش هدف کمک" : "هدف کمک جدید"}
              </h2>
              <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
                <Field label="عنوان" htmlFor="goal-title">
                  <Input
                    id="goal-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </Field>
                <Field label="توضیح کوتاه" htmlFor="goal-desc">
                  <Textarea
                    id="goal-desc"
                    value={form.description}
                    rows={3}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </Field>
                <Field label="ترتیب نمایش" htmlFor="goal-sort">
                  <NumberInput
                    id="goal-sort"
                    value={form.sortOrder}
                    min={0}
                    step={1}
                    onChange={(value) =>
                      setForm((f) => ({ ...f, sortOrder: value ?? 0 }))
                    }
                  />
                </Field>
                <Checkbox
                  id="goal-active"
                  label="فعال"
                  description="در فرم کمک سایت نمایش داده شود."
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                />
                <div className="flex justify-end gap-2 border-t border-ink/10 pt-4">
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
        title="اهداف کمک"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} هدف برای انتخاب در صفحه کمک`
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

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            موردی نیست
          </li>
        ) : (
          filtered.map((row, index) => (
            <li
              key={String(row.id)}
              className="rounded-2xl border border-ink/10 bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-ink-muted">
                      {toPersianDigits(sortOf(row) || index + 1)}
                    </span>
                    <h2 className="font-semibold text-ink">{row.title}</h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                        activeOf(row)
                          ? "bg-mint-soft text-pine"
                          : "bg-cream text-ink-muted"
                      }`}
                    >
                      {activeOf(row) ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                  {row.description ? (
                    <p className="mt-2 text-sm text-ink-muted">{row.description}</p>
                  ) : null}
                </div>
                <div className="flex gap-2">
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
              </div>
            </li>
          ))
        )}
      </ul>

      {dialog}

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف هدف کمک؟"
        description="این هدف از فرم کمک سایت حذف می‌شود."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
