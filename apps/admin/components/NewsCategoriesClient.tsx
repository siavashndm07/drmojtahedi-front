"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowRight, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import ActionIconButton from "@/components/ActionIconButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import { Field, Input, Textarea } from "@/components/form";
import { useAuth } from "@/lib/auth";
import {
  apiDeleteNewsCategory,
  apiListNewsCategories,
  apiSaveNewsCategory,
  type AdminNewsCategory,
} from "@/lib/api/news";
import { slugifyFa } from "@/lib/newsBlocks";
import { toPersianDigits } from "@/lib/digits";
import { requireTrimmed } from "@/lib/formValidation";

export default function NewsCategoriesClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<AdminNewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminNewsCategory | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminNewsCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    slug?: string;
  }>({});

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      setRows(await apiListNewsCategories(accessToken));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "بارگذاری ناموفق");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void reload();
  }, [reload]);

  function openCreate() {
    setEditing(null);
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setFieldErrors({});
    setFormOpen(true);
  }

  function openEdit(row: AdminNewsCategory) {
    setEditing(row);
    setTitle(row.title);
    setSlug(row.slug);
    setSlugTouched(true);
    setDescription(row.description ?? "");
    setFieldErrors({});
    setFormOpen(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    const next = {
      title: requireTrimmed(title),
      slug: requireTrimmed(slug),
    };
    setFieldErrors(next);
    if (next.title || next.slug) return;
    setBusy(true);
    try {
      await apiSaveNewsCategory(
        accessToken,
        {
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          isActive: true,
        },
        editing?.id,
      );
      toast.success(editing ? "دسته ذخیره شد" : "دسته ایجاد شد");
      setFormOpen(false);
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
      await apiDeleteNewsCategory(accessToken, deleteTarget.id);
      toast.success("حذف شد");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeleting(false);
    }
  }

  const dialog =
    formOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="بستن"
              onClick={() => {
                if (!busy) setFormOpen(false);
              }}
            />
            <div className="relative w-full max-w-md rounded-2xl border border-ink/10 bg-surface p-5 shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="font-bold text-ink">
                  {editing ? "ویرایش دسته" : "دسته جدید"}
                </h2>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-cream"
                  aria-label="بستن"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <Field label="عنوان" htmlFor="cat-title" error={fieldErrors.title}>
                  <Input
                    id="cat-title"
                    value={title}
                    error={!!fieldErrors.title}
                    onChange={(e) => {
                      const next = e.target.value;
                      setTitle(next);
                      if (!slugTouched) setSlug(slugifyFa(next));
                      setFieldErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                  />
                </Field>
                <Field label="اسلاگ" htmlFor="cat-slug" error={fieldErrors.slug}>
                  <Input
                    id="cat-slug"
                    value={slug}
                    error={!!fieldErrors.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, slug: undefined }));
                    }}
                    dir="ltr"
                    className="text-start"
                  />
                </Field>
                <Field label="توضیح" htmlFor="cat-desc">
                  <Textarea
                    id="cat-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </Field>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => setFormOpen(false)}
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
        title="دسته‌های خبر"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(rows.length)} دسته — در فرم خبر به‌صورت pill انتخاب می‌شوند`
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/news" className="btn-secondary !gap-1.5 !py-2 text-xs">
              <ArrowRight className="h-3.5 w-3.5" />
              اخبار
            </Link>
            <button
              type="button"
              onClick={openCreate}
              className="btn-primary !gap-1.5 !py-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              دسته جدید
            </button>
          </div>
        }
      />

      <ul className="space-y-3">
        {rows.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-ink/15 bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            دسته‌ای نیست
          </li>
        ) : (
          rows.map((row) => (
            <li
              key={String(row.id)}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-surface p-4"
            >
              <div>
                <p className="font-semibold text-ink">{row.title}</p>
                <p className="mt-1 text-xs text-ink-muted" dir="ltr">
                  {row.slug}
                </p>
              </div>
              <div className="flex gap-1.5">
                <ActionIconButton label="ویرایش" onClick={() => openEdit(row)} variant="primary">
                  <Pencil className="h-4 w-4" />
                </ActionIconButton>
                <ActionIconButton label="حذف" onClick={() => setDeleteTarget(row)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </ActionIconButton>
              </div>
            </li>
          ))
        )}
      </ul>

      {dialog}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="حذف دسته؟"
        description={
          deleteTarget
            ? `«${deleteTarget.title}» حذف می‌شود. اخبار موجود این برچسب را نگه می‌دارند.`
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
