"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Clock3,
  Inbox,
  LayoutGrid,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  Rocket,
  SearchX,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { createPortal } from "react-dom";
import ActionIconButton from "@/components/ActionIconButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState, { NO_MATCH_DESCRIPTION, NO_MATCH_TITLE } from "@/components/EmptyState";
import FilterPills from "@/components/FilterPills";
import OptionPills, { type OptionPill } from "@/components/OptionPills";
import PageHeader from "@/components/PageHeader";
import {
  Field,
  Input,
  Textarea,
  formDialogClassName,
  formDialogFieldsClassName,
  formDialogFullClassName,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import { toPersianDigits } from "@/lib/digits";
import { REQUIRED_FIELD, requireTrimmed } from "@/lib/formValidation";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "pills";
  options?: OptionPill[];
  required?: boolean;
  columns?: 2 | 3 | "auto";
};

type StatusFilter = "all" | "published" | "draft" | "coming-soon";

const STATUS_LABEL: Record<string, string> = {
  published: "منتشر",
  draft: "پیش‌نویس",
  placeholder: "جایگزین",
  "coming-soon": "به‌زودی",
};

const STATUS_ICON: Record<string, LucideIcon> = {
  published: Rocket,
  draft: PencilLine,
  "coming-soon": Clock3,
};

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICON[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] ${
        status === "published"
          ? "bg-mint-soft text-pine"
          : status === "draft"
            ? "bg-amber-50 text-amber-700"
            : "bg-cream text-ink-muted"
      }`}
    >
      {Icon ? <Icon className="h-3 w-3" aria-hidden /> : null}
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function ResourceCrud<
  T extends { id: string | number; title?: string; name?: string; status?: string },
>({
  title,
  description,
  fields,
  list,
  save,
  remove,
  emptyForm,
  emptyIcon: EmptyIcon = Inbox,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description?: string;
  fields: FieldDef[];
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  list: (token: string) => Promise<T[]>;
  save: (
    token: string,
    payload: Record<string, string>,
    id?: string | number,
  ) => Promise<unknown>;
  remove: (token: string, id: string | number) => Promise<unknown>;
  emptyForm: Record<string, string>;
}) {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      setRows(await list(accessToken));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  }, [accessToken, list]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const statusCounts = useMemo(() => {
    const counts = {
      all: rows.length,
      published: 0,
      draft: 0,
      "coming-soon": 0,
    };
    for (const row of rows) {
      const s = row.status;
      if (s === "published") counts.published += 1;
      else if (s === "draft") counts.draft += 1;
      else if (s === "coming-soon") counts["coming-soon"] += 1;
    }
    return counts;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      const hay = `${row.title ?? ""} ${row.name ?? ""} ${row.status ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, statusFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setFormOpen(true);
  }

  function openEdit(row: T) {
    setEditingId(row.id);
    const next = { ...emptyForm };
    for (const key of Object.keys(emptyForm)) {
      const value = (row as Record<string, unknown>)[key];
      next[key] = value == null ? "" : String(value);
    }
    setForm(next);
    setFieldErrors({});
    setFormOpen(true);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      if (!field.required) continue;
      const message = requireTrimmed(form[field.key], REQUIRED_FIELD);
      if (message) nextErrors[field.key] = message;
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      await save(accessToken, form, editingId ?? undefined);
      toast.success(editingId ? "ویرایش شد" : "ایجاد شد");
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setFieldErrors({});
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
      await remove(accessToken, deleteTarget.id);
      toast.success("حذف شد");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeleting(false);
    }
  }

  const formDialog =
    formOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
            <button
              type="button"
              className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
              aria-label="بستن"
              onClick={() => {
                if (!busy) setFormOpen(false);
              }}
            />
            <div
              role="dialog"
              aria-modal="true"
              className={formDialogClassName}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-ink">
                    {editingId ? "ویرایش" : "مورد جدید"}
                  </h2>
                  <p className="mt-1 text-xs text-ink-muted">{title}</p>
                </div>
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-cream hover:text-ink"
                  onClick={() => setFormOpen(false)}
                  aria-label="بستن"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={onSubmit} noValidate className={formDialogFieldsClassName}>
                {fields.map((field) =>
                  field.type === "pills" ? (
                    <OptionPills
                      key={field.key}
                      className={formDialogFullClassName}
                      label={field.label}
                      value={(form[field.key] as string) || (field.options?.[0]?.value ?? "")}
                      options={field.options ?? []}
                      columns={field.columns ?? "auto"}
                      error={fieldErrors[field.key]}
                      onChange={(next) => {
                        setForm((f) => ({ ...f, [field.key]: next }));
                        setFieldErrors((prev) => {
                          const copy = { ...prev };
                          delete copy[field.key];
                          return copy;
                        });
                      }}
                    />
                  ) : (
                    <Field
                      key={field.key}
                      label={field.label}
                      htmlFor={`field-${field.key}`}
                      error={fieldErrors[field.key]}
                      className={field.type === "textarea" ? formDialogFullClassName : undefined}
                    >
                      {field.type === "textarea" ? (
                        <Textarea
                          id={`field-${field.key}`}
                          value={form[field.key] ?? ""}
                          error={!!fieldErrors[field.key]}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, [field.key]: e.target.value }));
                            setFieldErrors((prev) => {
                              const copy = { ...prev };
                              delete copy[field.key];
                              return copy;
                            });
                          }}
                        />
                      ) : (
                        <Input
                          id={`field-${field.key}`}
                          value={form[field.key] ?? ""}
                          error={!!fieldErrors[field.key]}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, [field.key]: e.target.value }));
                            setFieldErrors((prev) => {
                              const copy = { ...prev };
                              delete copy[field.key];
                              return copy;
                            });
                          }}
                        />
                      )}
                    </Field>
                  ),
                )}
                <div className={`${formDialogFullClassName} flex flex-wrap justify-end gap-2 border-t border-ink/10 pt-4`}>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => setFormOpen(false)}
                  >
                    انصراف
                  </button>
                  <button type="submit" disabled={busy} className="btn-primary">
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : null}
                    {editingId ? "ذخیره" : "ایجاد"}
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
        title={title}
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} مورد${isApiEnabled() ? "" : " (دمو)"}`
        }
        action={
          <button type="button" onClick={openCreate} className="btn-primary !gap-1.5 !py-2 text-xs">
            <Plus className="h-4 w-4" />
            مورد جدید
          </button>
        }
      />

      {description ? (
        <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4 text-sm leading-7 text-ink-muted dark:bg-mint/20">
          {description}
        </div>
      ) : null}

      <div className="mb-4 space-y-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در عنوان…"
        />
        <FilterPills<StatusFilter>
          label="وضعیت انتشار"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            {
              value: "all",
              label: "همه",
              count: statusCounts.all,
              icon: LayoutGrid,
            },
            {
              value: "published",
              label: "منتشر",
              count: statusCounts.published,
              icon: Rocket,
            },
            {
              value: "draft",
              label: "پیش‌نویس",
              count: statusCounts.draft,
              icon: PencilLine,
            },
            {
              value: "coming-soon",
              label: "به‌زودی",
              count: statusCounts["coming-soon"],
              icon: Clock3,
            },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={query.trim() || statusFilter !== "all" ? SearchX : EmptyIcon}
          title={query.trim() || statusFilter !== "all" ? NO_MATCH_TITLE : (emptyTitle ?? `هنوز موردی در ${title} نیست`)}
          description={
            query.trim() || statusFilter !== "all"
              ? NO_MATCH_DESCRIPTION
              : (emptyDescription ?? "با «مورد جدید» اولین رکورد را بسازید.")
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
            ) : (
              <button type="button" onClick={openCreate} className="btn-primary !gap-1.5 !py-2 text-xs">
                <Plus className="h-4 w-4" />
                مورد جدید
              </button>
            )
          }
        />
      ) : (
      <ul className="space-y-3">
        {filtered.map((row) => (
            <li
              key={String(row.id)}
              className="rounded-2xl border border-ink/10 bg-surface p-4 transition hover:border-pine/25"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {row.status ? (
                      <StatusBadge status={row.status} />
                    ) : null}
                    <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] text-ink-muted">
                      #{toPersianDigits(row.id)}
                    </span>
                  </div>
                  <h2 className="mt-2 font-semibold text-ink">
                    {row.title || row.name || String(row.id)}
                  </h2>
                  {row.name && row.title && row.name !== row.title ? (
                    <p className="mt-1 text-sm text-ink-muted">{row.name}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5">
                  <ActionIconButton label="ویرایش" onClick={() => openEdit(row)} variant="primary">
                    <Pencil className="h-4 w-4" />
                  </ActionIconButton>
                  <ActionIconButton
                    label="حذف"
                    onClick={() => setDeleteTarget(row)}
                    variant="default"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </ActionIconButton>
                </div>
              </div>
            </li>
          ))}
      </ul>
      )}

      {formDialog}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="حذف این مورد؟"
        description={
          deleteTarget
            ? `«${deleteTarget.title || deleteTarget.name || deleteTarget.id}» حذف می‌شود و قابل بازگشت نیست.`
            : undefined
        }
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
