"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { uploadMedia } from "@/lib/api/media";
import { mediaAssetUrl } from "@/lib/mediaAssetUrl";

type ImageAssetFieldProps = {
  label: string;
  hint?: string;
  kind?:
    | "news"
    | "articles"
    | "archive"
    | "people"
    | "sponsors"
    | "hero"
    | "logo"
    | "gallery";
  imageId: string | null;
  imageUrl: string;
  aspectClass?: string;
  /** Constrain preview width (e.g. max-w-xs for compact covers). */
  previewClassName?: string;
  objectFit?: "cover" | "contain";
  removeDescription?: string;
  error?: string | null;
  onChange: (next: { id: string | null; url: string }) => void;
};

export default function ImageAssetField({
  label,
  hint,
  kind = "news",
  imageId: _imageId,
  imageUrl,
  aspectClass = "aspect-[16/9]",
  previewClassName = "",
  objectFit = "cover",
  removeDescription = "این تصویر از خبر برداشته می‌شود.",
  error,
  onChange,
}: ImageAssetFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const preview = mediaAssetUrl(imageUrl);
  const fit = kind === "logo" ? "contain" : objectFit;

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const asset = await uploadMedia(file, kind);
      onChange({ id: asset.id, url: asset.url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "آپلود ناموفق");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          {hint ? <p className="mt-0.5 text-xs text-ink-muted">{hint}</p> : null}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 px-3 py-1.5 text-xs font-medium text-pine transition hover:bg-mint-soft/40 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-3.5 w-3.5" aria-hidden />
            )}
            آپلود
          </button>
          {preview ? (
            <button
              type="button"
              onClick={() => setConfirmRemove(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-ink/10 text-red-500 transition hover:bg-red-50"
              aria-label="حذف تصویر"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files)}
      />

      <div
        className={`relative overflow-hidden rounded-2xl border border-dashed bg-cream/50 ${
          error ? "border-red-500 ring-2 ring-red-400/50" : "border-ink/15"
        } ${aspectClass} ${previewClassName}`.trim()}
      >
        {preview ? (
          <Image
            src={preview}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className={fit === "contain" ? "object-contain p-3" : "object-cover"}
            unoptimized
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted"
          >
            <ImagePlus className="h-8 w-8" aria-hidden />
            <span className="text-xs">تصویر را انتخاب کنید</span>
          </button>
        )}
      </div>
      {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={confirmRemove}
        title="حذف تصویر"
        description={removeDescription}
        confirmLabel="حذف"
        onConfirm={() => {
          onChange({ id: null, url: "" });
          setConfirmRemove(false);
        }}
        onClose={() => setConfirmRemove(false)}
      />
    </div>
  );
}
