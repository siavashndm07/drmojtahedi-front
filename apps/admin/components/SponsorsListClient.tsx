"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  LayoutGrid,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  Rocket,
  Trash2,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import ActionIconButton from "@/components/ActionIconButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterPills from "@/components/FilterPills";
import ImageAssetField from "@/components/ImageAssetField";
import OptionPills from "@/components/OptionPills";
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
import {
  apiDeleteSponsor,
  apiListSponsors,
  apiSaveSponsor,
  type ContentStatus,
  type Sponsor,
} from "@/lib/api/resources";
import { toPersianDigits } from "@/lib/digits";
import { REQUIRED_FIELD, requireTrimmed } from "@/lib/formValidation";
import { mediaAssetUrl } from "@/lib/mediaAssetUrl";
import { PUBLISH_STATUS_OPTIONS, SPONSOR_KIND_OPTIONS } from "@/lib/optionSets";

type FormState = {
  title: string;
  slug: string;
  kind: string;
  logo_label: string;
  status: ContentStatus;
  description: string;
  cover: string;
  coverImageId: string | null;
  logo: string;
  logoImageId: string | null;
};

type StatusFilter = "all" | "published" | "draft" | "coming-soon";

const emptyForm: FormState = {
  title: "",
  slug: "",
  kind: "individual",
  logo_label: "",
  status: "published",
  description: "",
  cover: "",
  coverImageId: null,
  logo: "",
  logoImageId: null,
};

export default function SponsorsListClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      setRows(await apiListSponsors(accessToken));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const statusCounts = useMemo(() => {
    const counts = { all: rows.length, published: 0, draft: 0, "coming-soon": 0 };
    for (const row of rows) {
      if (row.status === "published") counts.published += 1;
      else if (row.status === "draft") counts.draft += 1;
      else if (row.status === "coming-soon") counts["coming-soon"] += 1;
    }
    return counts;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      return `${row.title} ${row.slug} ${row.kind}`.toLowerCase().includes(q);
    });
  }, [rows, query, statusFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setFormOpen(true);
  }

  function openEdit(row: Sponsor) {
    setEditingId(row.id);
    setForm({
      title: row.title ?? "",
      slug: row.slug ?? "",
      kind: row.kind ?? "individual",
      logo_label: row.logoLabel ?? row.logo_label ?? "",
      status: row.status ?? "published",
      description: row.description ?? "",
      cover: row.coverImage?.src ?? "",
      coverImageId: row.coverImageId ?? row.coverImage?.id ?? null,
      logo: row.logoImage?.src ?? "",
      logoImageId: row.logoImageId ?? row.logoImage?.id ?? null,
    });
    setFieldErrors({});
    setFormOpen(true);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    const nextErrors: Record<string, string> = {};
    const titleErr = requireTrimmed(form.title, REQUIRED_FIELD);
    const slugErr = requireTrimmed(form.slug, REQUIRED_FIELD);
    if (titleErr) nextErrors.title = titleErr;
    if (slugErr) nextErrors.slug = slugErr;
    if (!form.coverImageId) nextErrors.cover = "تصویر حامی الزامی است";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      await apiSaveSponsor(
        accessToken,
        {
          title: form.title.trim(),
          slug: form.slug.trim(),
          kind: form.kind,
          logo_label: form.logo_label.trim(),
          status: form.status,
          description: form.description.trim(),
          coverImageId: form.coverImageId,
          logoImageId: form.logoImageId,
        },
        editingId ?? undefined,
      );
      toast.success(editingId ? "ویرایش شد" : "ایجاد شد");
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);
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
      await apiDeleteSponsor(accessToken, deleteTarget.id);
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
                    {editingId ? "ویرایش حامی" : "حامی جدید"}
                  </h2>
                  <p className="mt-1 text-xs text-ink-muted">
                    تصویر کاور و لوگوی اختیاری — آپلود WebP و تغییر اندازه در سرور
                  </p>
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
                <Field label="نام" htmlFor="sponsor-title" error={fieldErrors.title}>
                  <Input
                    id="sponsor-title"
                    value={form.title}
                    error={!!fieldErrors.title}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, title: e.target.value }));
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.title;
                        return next;
                      });
                    }}
                  />
                </Field>
                <Field label="اسلاگ" htmlFor="sponsor-slug" error={fieldErrors.slug}>
                  <Input
                    id="sponsor-slug"
                    value={form.slug}
                    error={!!fieldErrors.slug}
                    dir="ltr"
                    onChange={(e) => {
                      setForm((f) => ({ ...f, slug: e.target.value }));
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.slug;
                        return next;
                      });
                    }}
                  />
                </Field>
                <OptionPills
                  className={formDialogFullClassName}
                  label="نوع"
                  value={form.kind}
                  options={SPONSOR_KIND_OPTIONS}
                  columns={2}
                  onChange={(next) => setForm((f) => ({ ...f, kind: next }))}
                />
                <Field label="برچسب لوگو" htmlFor="sponsor-logo-label">
                  <Input
                    id="sponsor-logo-label"
                    value={form.logo_label}
                    onChange={(e) => setForm((f) => ({ ...f, logo_label: e.target.value }))}
                  />
                </Field>
                <OptionPills
                  className={formDialogFullClassName}
                  label="وضعیت انتشار"
                  value={form.status}
                  options={PUBLISH_STATUS_OPTIONS.filter((o) => o.value !== "coming-soon")}
                  columns={2}
                  onChange={(next) =>
                    setForm((f) => ({ ...f, status: next as ContentStatus }))
                  }
                />
                <ImageAssetField
                  label="تصویر کاور"
                  hint="در صفحه و پیش‌نمایش حامیان نمایش داده می‌شود"
                  kind="sponsors"
                  imageId={form.coverImageId}
                  imageUrl={form.cover}
                  aspectClass="aspect-[16/10]"
                  previewClassName="max-w-xs"
                  error={fieldErrors.cover}
                  removeDescription="تصویر کاور از این حامی برداشته می‌شود."
                  onChange={({ id, url }) => {
                    setForm((f) => ({ ...f, coverImageId: id, cover: url }));
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.cover;
                      return next;
                    });
                  }}
                />
                <ImageAssetField
                  label="لوگو (اختیاری)"
                  hint="با پس‌زمینه شفاف ذخیره می‌شود"
                  kind="logo"
                  imageId={form.logoImageId}
                  imageUrl={form.logo}
                  aspectClass="aspect-square"
                  previewClassName="max-w-[10rem]"
                  objectFit="contain"
                  removeDescription="لوگو از این حامی برداشته می‌شود."
                  onChange={({ id, url }) =>
                    setForm((f) => ({ ...f, logoImageId: id, logo: url }))
                  }
                />
                <Field label="توضیح" htmlFor="sponsor-desc" className={formDialogFullClassName}>
                  <Textarea
                    id="sponsor-desc"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </Field>
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
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
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
        title="حامیان"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} مورد${isApiEnabled() ? "" : " (دمو)"}`
        }
        action={
          <button type="button" onClick={openCreate} className="btn-primary !gap-1.5 !py-2 text-xs">
            <Plus className="h-4 w-4" />
            حامی جدید
          </button>
        }
      />

      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4 text-sm leading-7 text-ink-muted">
        حامیان فردی و سازمانی — تصویر کاور برای کارت‌های سایت الزامی است.
      </div>

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
            { value: "all", label: "همه", count: statusCounts.all, icon: LayoutGrid },
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
          ]}
        />
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            موردی یافت نشد
          </li>
        ) : (
          filtered.map((row) => {
            const coverSrc = mediaAssetUrl(row.coverImage?.src || "");
            return (
              <li
                key={String(row.id)}
                className="rounded-2xl border border-ink/10 bg-surface p-4 transition hover:border-pine/25"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-mint-soft">
                    {coverSrc ? (
                      <Image
                        src={coverSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-ink-muted">
                        بدون تصویر
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                          row.status === "published"
                            ? "bg-mint-soft text-pine"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {row.status === "published" ? "منتشر" : "پیش‌نویس"}
                      </span>
                      <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] text-ink-muted">
                        {row.kind === "organization" ? "سازمانی" : "فردی"}
                      </span>
                    </div>
                    <h2 className="mt-2 font-semibold text-ink">{row.title}</h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ActionIconButton
                      label="ویرایش"
                      onClick={() => openEdit(row)}
                      variant="primary"
                    >
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
            );
          })
        )}
      </ul>

      {formDialog}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="حذف این حامی؟"
        description={
          deleteTarget
            ? `«${deleteTarget.title}» حذف می‌شود و قابل بازگشت نیست.`
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
