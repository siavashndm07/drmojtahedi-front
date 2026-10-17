"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Clapperboard, Images, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { createPortal } from "react-dom";
import ConfirmDialog from "@/components/ConfirmDialog";
import ImageAssetField from "@/components/ImageAssetField";
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
  apiDeleteGallery,
  apiDeleteGalleryItem,
  apiListGalleries,
  apiSaveGallery,
  apiUploadGalleryItem,
  type GalleryItemRow,
  type GalleryKind,
  type GalleryRow,
} from "@/lib/api/galleries";
import { toPersianDigits } from "@/lib/digits";

const KIND_LABEL: Record<GalleryKind, string> = {
  images: "تصاویر",
  videos: "ویدئو",
};

function sortOf(row: GalleryRow) {
  return Number(row.sortOrder ?? 0);
}

export default function GalleriesClient() {
  const { accessToken } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<GalleryRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    kind: "images" as GalleryKind,
    sortOrder: 0,
    isActive: true,
    coverId: null as string | null,
    coverUrl: "",
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [itemTarget, setItemTarget] = useState<GalleryItemRow | null>(null);
  const [deletingItem, setDeletingItem] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const list = await apiListGalleries(accessToken);
      list.sort((a, b) => sortOf(a) - sortOf(b) || Number(b.id) - Number(a.id));
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
      (row) =>
        row.title.toLowerCase().includes(q) ||
        (row.description || "").toLowerCase().includes(q),
    );
  }, [rows, query]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setForm({
      title: "",
      description: "",
      kind: "images",
      sortOrder: rows.length + 1,
      isActive: true,
      coverId: null,
      coverUrl: "",
    });
  }

  function openEdit(row: GalleryRow) {
    setCreating(false);
    setEditing(row);
    setForm({
      title: row.title,
      description: row.description || "",
      kind: row.kind,
      sortOrder: sortOf(row),
      isActive: row.isActive,
      coverId: row.coverId,
      coverUrl: row.coverUrl || "",
    });
  }

  function applySaved(saved: GalleryRow) {
    setRows((current) => {
      const next = current.some((row) => row.id === saved.id)
        ? current.map((row) => (row.id === saved.id ? saved : row))
        : [saved, ...current];
      next.sort((a, b) => sortOf(a) - sortOf(b) || Number(b.id) - Number(a.id));
      return next;
    });
    setCreating(false);
    setEditing(saved);
    setForm((current) => ({
      ...current,
      title: saved.title,
      description: saved.description || "",
      kind: saved.kind,
      sortOrder: sortOf(saved),
      isActive: saved.isActive,
      coverId: saved.coverId,
      coverUrl: saved.coverUrl || "",
    }));
  }

  function closeForm() {
    if (busy || uploading) return;
    setCreating(false);
    setEditing(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    if (!form.title.trim()) {
      toast.error("عنوان گالری الزامی است");
      return;
    }
    setBusy(true);
    try {
      const saved = await apiSaveGallery(
        accessToken,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          kind: form.kind,
          sortOrder: form.sortOrder,
          isActive: form.isActive,
          coverId: form.coverId,
        },
        editing?.id,
      );
      applySaved(saved);
      toast.success(editing ? "ذخیره شد" : "گالری ساخته شد. حالا رسانه اضافه کنید.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setBusy(false);
    }
  }

  async function onFiles(fileList: FileList | null) {
    if (!editing || !fileList?.length) return;
    const files = Array.from(fileList);
    setUploading(true);
    try {
      let latest = editing;
      for (const file of files) {
        latest = await apiUploadGalleryItem(editing.id, file);
      }
      applySaved(latest);
      toast.success(
        files.length === 1 ? "رسانه اضافه شد" : `${toPersianDigits(files.length)} فایل اضافه شد`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "آپلود ناموفق");
      await reload();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function confirmDelete() {
    if (!accessToken || !deleteTarget) return;
    setDeleting(true);
    try {
      await apiDeleteGallery(accessToken, deleteTarget.id);
      toast.success("حذف شد");
      if (editing?.id === deleteTarget.id) {
        setEditing(null);
        setCreating(false);
      }
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeleting(false);
    }
  }

  async function confirmDeleteItem() {
    if (!accessToken || !editing || !itemTarget) return;
    setDeletingItem(true);
    try {
      const saved = await apiDeleteGalleryItem(accessToken, editing.id, itemTarget.id);
      applySaved(saved);
      toast.success("رسانه حذف شد");
      setItemTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق");
    } finally {
      setDeletingItem(false);
    }
  }

  const formOpen = creating || !!editing;
  const kindLocked = Boolean(editing && editing.itemCount > 0);
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
                {editing ? "ویرایش گالری" : "گالری جدید"}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                هر گالری یک عنوان دارد و یا تصاویر است یا ویدئو. مثلاً «تصاویر همایش» یا
                «ویدئوهای احداث مجموعه جدید».
              </p>
              <form onSubmit={onSubmit} noValidate className={`mt-4 ${formDialogFieldsClassName}`}>
                <Field label="عنوان" htmlFor="gallery-title">
                  <Input
                    id="gallery-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="تصاویر همایش"
                  />
                </Field>
                <Field label="ترتیب نمایش" htmlFor="gallery-sort">
                  <NumberInput
                    id="gallery-sort"
                    value={form.sortOrder}
                    min={0}
                    step={1}
                    onChange={(value) => setForm((f) => ({ ...f, sortOrder: value ?? 0 }))}
                  />
                </Field>
                <div className={`${formDialogFullClassName} space-y-2`}>
                  <p className="text-sm font-medium text-ink">نوع</p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["images", "تصاویر", Images],
                        ["videos", "ویدئو", Clapperboard],
                      ] as const
                    ).map(([value, label, Icon]) => {
                      const selected = form.kind === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={kindLocked && !selected}
                          onClick={() => setForm((f) => ({ ...f, kind: value }))}
                          className={`inline-flex min-w-36 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium ${
                            selected
                              ? "border-pine bg-pine text-white"
                              : "border-ink/10 bg-surface text-ink hover:border-pine/40"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          <Icon className="size-4" aria-hidden />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {kindLocked ? (
                    <p className="text-xs text-ink-muted">
                      تا وقتی رسانه‌ای در گالری هست، نوع آن ثابت می‌ماند.
                    </p>
                  ) : null}
                </div>
                <Field label="توضیح کوتاه" htmlFor="gallery-desc" className={formDialogFullClassName}>
                  <Textarea
                    id="gallery-desc"
                    value={form.description}
                    rows={3}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </Field>
                <div className={formDialogFullClassName}>
                <ImageAssetField
                  label={form.kind === "videos" ? "جلد (اختیاری)" : "جلد"}
                  hint={
                    form.kind === "images"
                      ? "اگر جلد نگذارید، اولین تصویر به‌عنوان جلد استفاده می‌شود."
                      : "تصویر پوستر ویدئوها. خود ویدئوها را پایین‌تر بارگذاری کنید."
                  }
                  kind="gallery"
                  imageId={form.coverId}
                  imageUrl={form.coverUrl}
                  onChange={(next) =>
                    setForm((f) => ({ ...f, coverId: next.id, coverUrl: next.url }))
                  }
                />
                </div>
                <Checkbox
                  className={formDialogFullClassName}
                  id="gallery-active"
                  label="نمایش در سایت"
                  description="گالری‌های غیرفعال در صفحه عمومی دیده نمی‌شوند."
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <div className={`${formDialogFullClassName} flex justify-end gap-2 border-t border-ink/10 pt-4`}>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-xl px-4 py-2 text-sm text-ink-muted hover:bg-ink/5"
                  >
                    بستن
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-xl bg-pine px-4 py-2 text-sm font-medium text-white hover:bg-pine-dark disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                    ذخیره
                  </button>
                </div>
              </form>

              {editing ? (
                <div className="mt-6 border-t border-ink/10 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-ink">
                        {editing.kind === "videos" ? "ویدئوها" : "تصاویر"}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        {toPersianDigits(editing.itemCount)} مورد
                        {editing.kind === "videos" ? " · mp4، webm یا mov تا ۲۵۰ مگابایت" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-pine/30 bg-pine/5 px-3 py-2 text-sm font-medium text-pine hover:bg-pine/10 disabled:opacity-60"
                    >
                      {uploading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      بارگذاری
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      accept={
                        editing.kind === "videos"
                          ? "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                          : "image/*"
                      }
                      className="sr-only"
                      onChange={(e) => void onFiles(e.target.files)}
                    />
                  </div>
                  {editing.items.length === 0 ? (
                    <p className="mt-4 rounded-xl border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink-muted">
                      هنوز رسانه‌ای اضافه نشده است.
                    </p>
                  ) : (
                    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {editing.items.map((item) => (
                        <li
                          key={item.id}
                          className="overflow-hidden rounded-xl border border-ink/10 bg-cream/40"
                        >
                          {editing.kind === "videos" ? (
                            <video
                              src={item.url}
                              controls
                              preload="metadata"
                              className="aspect-video w-full bg-ink"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.url}
                              alt={item.caption || editing.title}
                              className="aspect-[4/3] w-full object-cover"
                            />
                          )}
                          <div className="flex justify-end p-2">
                            <button
                              type="button"
                              onClick={() => setItemTarget(item)}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" />
                              حذف
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-ink-muted">
                  بعد از ذخیره، تصاویر یا ویدئوها را به همین گالری اضافه می‌کنید.
                </p>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div>
      <PageHeader
        title="گالری"
        description={
          loading
            ? "در حال بارگذاری…"
            : "آلبوم‌های تصویر و ویدئو با عنوان جدا، مثل تصاویر همایش یا ویدئوهای احداث مجموعه."
        }
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-pine px-4 py-2 text-sm font-medium text-white hover:bg-pine-dark"
          >
            <Plus className="size-4" />
            گالری جدید
          </button>
        }
      />
      <div className="mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در عنوان گالری"
          aria-label="جستجو در عنوان گالری"
        />
      </div>
      {filtered.length === 0 && !loading ? (
        <p className="rounded-2xl border border-dashed border-ink/15 px-4 py-10 text-center text-sm text-ink-muted">
          گالری‌ای نیست. یک عنوان بسازید و تصاویر یا ویدئوها را داخل آن بگذارید.
        </p>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-surface p-3"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-mint-soft">
                {row.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-pine">
                    {row.kind === "videos" ? (
                      <Clapperboard className="size-5" />
                    ) : (
                      <Images className="size-5" />
                    )}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{row.title}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {KIND_LABEL[row.kind]} · {toPersianDigits(row.itemCount)} مورد
                  {row.isActive ? "" : " · مخفی"}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-ink hover:bg-ink/5"
                >
                  <Pencil className="size-4" />
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(row)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {dialog}
      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف گالری"
        description={
          deleteTarget
            ? `«${deleteTarget.title}» و همه رسانه‌های داخل آن حذف می‌شود.`
            : undefined
        }
        confirmLabel="حذف"
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
      <ConfirmDialog
        open={!!itemTarget}
        title="حذف رسانه"
        description="این تصویر یا ویدئو از گالری برداشته می‌شود."
        confirmLabel="حذف"
        loading={deletingItem}
        onConfirm={() => void confirmDeleteItem()}
        onClose={() => {
          if (!deletingItem) setItemTarget(null);
        }}
      />
    </div>
  );
}
