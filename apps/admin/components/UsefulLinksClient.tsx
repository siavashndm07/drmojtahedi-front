"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ExternalLink, Link2, Loader2, Pencil, Plus, SearchX, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState, { NO_MATCH_DESCRIPTION, NO_MATCH_TITLE } from "@/components/EmptyState";
import ImageAssetField from "@/components/ImageAssetField";
import PageHeader from "@/components/PageHeader";
import {
  Checkbox,
  Field,
  Input,
  NumberInput,
  formDialogClassName,
  formDialogFieldsClassName,
  formDialogFullClassName,
} from "@/components/form";
import { useAuth } from "@/lib/auth";
import {
  apiDeleteUsefulLink,
  apiListUsefulLinks,
  apiSaveUsefulLink,
  type UsefulLink,
} from "@/lib/api/resources";
import { toPersianDigits } from "@/lib/digits";
import { mediaAssetUrl } from "@/lib/mediaAssetUrl";

function sortOf(row: UsefulLink) {
  return Number(row.sortOrder ?? row.sort_order ?? 0);
}

function activeOf(row: UsefulLink) {
  return row.isActive ?? row.is_active ?? true;
}

export default function UsefulLinksClient() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<UsefulLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UsefulLink | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    sortOrder: 0,
    isActive: true,
    logo: "",
    logoId: null as string | null,
  });
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UsefulLink | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const list = await apiListUsefulLinks(accessToken);
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
        r.title.toLowerCase().includes(q) || r.url.toLowerCase().includes(q),
    );
  }, [rows, query]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setForm({
      title: "",
      url: "https://",
      sortOrder: rows.length + 1,
      isActive: true,
      logo: "",
      logoId: null,
    });
  }

  function openEdit(row: UsefulLink) {
    setCreating(false);
    setEditing(row);
    setForm({
      title: row.title,
      url: row.url,
      sortOrder: sortOf(row),
      isActive: activeOf(row),
      logo: row.logoImage?.src ?? "",
      logoId: row.logoId ?? row.logoImage?.id ?? null,
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
      toast.error("عنوان پیوند الزامی است");
      return;
    }
    if (!form.url.trim() || !/^https?:\/\//i.test(form.url.trim())) {
      toast.error("آدرس باید با http:// یا https:// شروع شود");
      return;
    }
    setBusy(true);
    try {
      await apiSaveUsefulLink(
        accessToken,
        {
          title: form.title.trim(),
          url: form.url.trim(),
          sortOrder: form.sortOrder,
          isActive: form.isActive,
          logoId: form.logoId,
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
      await apiDeleteUsefulLink(accessToken, deleteTarget.id);
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
                {editing ? "ویرایش پیوند" : "پیوند جدید"}
              </h2>
              <form onSubmit={onSubmit} noValidate className={`mt-4 ${formDialogFieldsClassName}`}>
                <Field label="عنوان پیوند" htmlFor="link-title">
                  <Input
                    id="link-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </Field>
                <Field label="آدرس پیوند" htmlFor="link-url">
                  <Input
                    id="link-url"
                    dir="ltr"
                    className="text-start"
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </Field>
                <Field label="ترتیب نمایش" htmlFor="link-sort">
                  <NumberInput
                    id="link-sort"
                    value={form.sortOrder}
                    min={0}
                    step={1}
                    onChange={(value) =>
                      setForm((f) => ({ ...f, sortOrder: value ?? 0 }))
                    }
                  />
                </Field>
                <div className={formDialogFullClassName}>
                <ImageAssetField
                  label="لوگو"
                  kind="logo"
                  imageId={form.logoId}
                  imageUrl={form.logo}
                  aspectClass="aspect-[3/2]"
                  previewClassName="max-w-xs"
                  objectFit="contain"
                  removeDescription="لوگو از این پیوند برداشته می‌شود."
                  onChange={({ id, url }) =>
                    setForm((f) => ({ ...f, logoId: id, logo: url }))
                  }
                />
                </div>
                <Checkbox
                  className={formDialogFullClassName}
                  id="link-active"
                  label="فعال"
                  description="در صفحه پیوندهای مفید سایت نمایش داده شود."
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
        title="پیوندهای مفید"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} پیوند برای نمایش در سایت`
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
          placeholder="جستجو در عنوان یا آدرس…"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-cream/60 text-start text-xs text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">لوگو</th>
              <th className="px-4 py-3 font-medium">عنوان پیوند</th>
              <th className="px-4 py-3 font-medium">آدرس</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-2">
                  <EmptyState
                    bare
                    icon={query.trim() ? SearchX : Link2}
                    title={query.trim() ? NO_MATCH_TITLE : "هنوز پیوندی ثبت نشده"}
                    description={
                      query.trim()
                        ? NO_MATCH_DESCRIPTION
                        : "وب‌سایت‌ها و انجمن‌های مرتبط را برای صفحه پیوندهای مفید اضافه کنید."
                    }
                    action={
                      query.trim() ? (
                        <button
                          type="button"
                          className="btn-secondary !py-2 text-xs"
                          onClick={() => setQuery("")}
                        >
                          پاک کردن جستجو
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-primary !gap-1.5 !py-2 text-xs"
                          onClick={openCreate}
                        >
                          <Plus className="h-4 w-4" />
                          افزودن پیوند
                        </button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => {
                const logoSrc = mediaAssetUrl(row.logoImage?.src ?? "");
                return (
                  <tr key={String(row.id)} className="border-t border-ink/8">
                    <td className="px-4 py-3 text-ink-muted">
                      {toPersianDigits(sortOf(row) || index + 1)}
                    </td>
                    <td className="px-4 py-3">
                      {logoSrc ? (
                        <Image
                          src={logoSrc}
                          alt=""
                          width={48}
                          height={32}
                          className="h-8 w-12 object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{row.title}</td>
                    <td className="px-4 py-3">
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-[220px] items-center gap-1 truncate text-pine hover:underline"
                        dir="ltr"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        {row.url}
                      </a>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {dialog}

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف پیوند؟"
        description="این پیوند از سایت حذف می‌شود."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
