"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
};

export function ResourceCrud<T extends { id: string | number; title?: string; name?: string }>({
  title,
  description,
  fields,
  list,
  save,
  remove,
  emptyForm,
}: {
  title: string;
  description?: string;
  fields: Field[];
  list: (token: string) => Promise<T[]>;
  save: (token: string, payload: Record<string, string>, id?: string | number) => Promise<unknown>;
  remove: (token: string, id: string | number) => Promise<unknown>;
  emptyForm: Record<string, string>;
}) {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<T[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    try {
      setRows(await list(accessToken));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در بارگذاری");
    }
  }, [accessToken, list]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    setBusy(true);
    try {
      await save(accessToken, form, editingId ?? undefined);
      toast.success(editingId ? "ویرایش شد" : "ایجاد شد");
      setForm(emptyForm);
      setEditingId(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl border border-ink/10 bg-surface p-5 sm:grid-cols-2"
      >
        {fields.map((field) => (
          <label
            key={field.key}
            className={`block text-sm ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
          >
            <span className="mb-1.5 block font-medium">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                className="min-h-24 w-full rounded-xl border border-ink/10 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-pine/40"
                value={form[field.key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                required={field.required}
              />
            ) : field.type === "select" ? (
              <select
                className="w-full rounded-xl border border-ink/10 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-pine/40"
                value={form[field.key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                required={field.required}
              >
                {(field.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full rounded-xl border border-ink/10 bg-cream/40 px-3 py-2 text-sm outline-none focus:border-pine/40"
                value={form[field.key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                required={field.required}
              />
            )}
          </label>
        ))}
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-pine px-4 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-60"
          >
            {editingId ? "ذخیره تغییرات" : "افزودن"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              انصراف
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-mint-soft/60 text-start text-xs text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">عنوان</th>
              <th className="px-4 py-3 font-medium">وضعیت/شناسه</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-muted">
                  موردی نیست
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)} className="border-t border-ink/5">
                  <td className="px-4 py-3 font-medium">
                    {row.title || row.name || String(row.id)}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {"status" in row ? String((row as { status?: string }).status ?? "") : ""}
                    <span className="ms-2 text-[11px]">#{row.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-ink/10 px-2.5 py-1 text-xs hover:border-pine/40"
                        onClick={() => {
                          setEditingId(row.id);
                          const next = { ...emptyForm };
                          for (const key of Object.keys(emptyForm)) {
                            const value = (row as Record<string, unknown>)[key];
                            next[key] = value == null ? "" : String(value);
                          }
                          setForm(next);
                        }}
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600"
                        onClick={async () => {
                          if (!accessToken) return;
                          if (!confirm("حذف شود؟")) return;
                          try {
                            await remove(accessToken, row.id);
                            toast.success("حذف شد");
                            await reload();
                          } catch (err) {
                            toast.error(err instanceof Error ? err.message : "حذف ناموفق");
                          }
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
