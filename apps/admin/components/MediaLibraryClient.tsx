"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Image as ImageIcon, Loader2, SearchX, Trash2, Upload } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState, { NO_MATCH_DESCRIPTION, NO_MATCH_TITLE } from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { Field, Input } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import { uploadMedia } from "@/lib/api/media";
import {
  apiDeleteMedia,
  apiListMedia,
  apiPatchMedia,
  type MediaAssetRow,
} from "@/lib/api/resources";
import { formatFaDateTime, toPersianDigits } from "@/lib/digits";
import { mediaAssetUrl } from "@/lib/mediaAssetUrl";

export default function MediaLibraryClient() {
  const { accessToken } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<MediaAssetRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaAssetRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      setRows(await apiListMedia(accessToken));
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
    return rows.filter((r) =>
      `${r.kind} ${r.altText ?? ""} ${r.id}`.toLowerCase().includes(q),
    );
  }, [rows, query]);

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, "archive");
      }
      toast.success("آپلود شد");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "آپلود ناموفق");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function saveAlt(event: FormEvent) {
    event.preventDefault();
    if (!accessToken || !editingId) return;
    setSavingAlt(true);
    try {
      await apiPatchMedia(accessToken, editingId, { altText: altDraft });
      toast.success("ذخیره شد");
      setEditingId(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setSavingAlt(false);
    }
  }

  async function confirmDelete() {
    if (!accessToken || !deleteTarget) return;
    setDeleting(true);
    try {
      await apiDeleteMedia(accessToken, deleteTarget.id);
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
        title="رسانه"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} فایل${isApiEnabled() ? "" : " (دمو)"}`
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در نوع یا متن جایگزین…"
          className="min-w-[12rem] flex-1"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => void onUpload(e.target.files)}
        />
        <button
          type="button"
          className="btn-primary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          آپلود تصویر
        </button>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {filtered.length === 0 ? (
          <li className="col-span-full list-none">
            <EmptyState
              icon={query.trim() ? SearchX : ImageIcon}
              title={query.trim() ? NO_MATCH_TITLE : "هنوز فایلی در کتابخانه نیست"}
              description={
                query.trim()
                  ? NO_MATCH_DESCRIPTION
                  : "تصویرها را بارگذاری کنید تا در خبر، گالری و بقیه بخش‌ها قابل انتخاب باشند."
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
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    آپلود تصویر
                  </button>
                )
              }
            />
          </li>
        ) : (
          filtered.map((row) => {
            const src = mediaAssetUrl(row.url || row.src || "");
            const editing = editingId === row.id;
            return (
              <li
                key={row.id}
                className="overflow-hidden rounded-2xl border border-ink/10 bg-surface"
              >
                <div className="relative aspect-[6/3] bg-mint-soft">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={row.altText || ""} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-pine">
                      <ImageIcon className="h-8 w-8" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-ink-muted">
                    <span className="rounded-full bg-cream px-2.5 py-0.5">{row.kind}</span>
                    <span>{formatFaDateTime(row.createdAt)}</span>
                  </div>
                  {editing ? (
                    <form onSubmit={saveAlt} className="space-y-2">
                      <Field label="متن جایگزین" htmlFor={`alt-${row.id}`}>
                        <Input
                          id={`alt-${row.id}`}
                          value={altDraft}
                          onChange={(e) => setAltDraft(e.target.value)}
                        />
                      </Field>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn-secondary"
                          disabled={savingAlt}
                          onClick={() => setEditingId(null)}
                        >
                          انصراف
                        </button>
                        <button type="submit" className="btn-primary" disabled={savingAlt}>
                          {savingAlt ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          ) : null}
                          ذخیره
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="line-clamp-2 text-sm text-ink-muted">
                        {row.altText || "بدون متن جایگزین"}
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            setEditingId(row.id);
                            setAltDraft(row.altText ?? "");
                          }}
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(row)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                          حذف
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف فایل؟"
        description="این فایل رسانه حذف می‌شود و ممکن است از محتواهای وابسته جدا شود."
        confirmLabel="حذف"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
