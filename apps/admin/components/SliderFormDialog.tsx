"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";
import ImageAssetField from "@/components/ImageAssetField";
import {
  Checkbox,
  Field,
  Input,
  Textarea,
  formDialogClassName,
  formDialogFieldsClassName,
  formDialogFullClassName,
} from "@/components/form";
import {
  formatHeroWeekdays,
  HERO_WEEKDAYS,
  type AdminHeroSlide,
  type HeroSlidePayload,
} from "@/lib/api/sliders";
import { slugifyFa } from "@/lib/newsBlocks";

type SliderFormDialogProps = {
  open: boolean;
  slide?: AdminHeroSlide | null;
  onClose: () => void;
  onSubmit: (payload: HeroSlidePayload) => Promise<void>;
};

export default function SliderFormDialog({
  open,
  slide,
  onClose,
  onSubmit,
}: SliderFormDialogProps) {
  const isEdit = Boolean(slide);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [title, setTitle] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaLabel, setCtaLabel] = useState("بیشتر بدانید");
  const [ctaHref, setCtaHref] = useState("/about/biography");
  const [imageId, setImageId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [mobileImageId, setMobileImageId] = useState<string | null>(null);
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [restrictWeekdays, setRestrictWeekdays] = useState(false);
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSlug(slide?.slug ?? "");
    setSlugTouched(Boolean(slide));
    setTitle(slide?.title ?? "");
    setEyebrow(slide?.eyebrow ?? "");
    setSubtitle(slide?.subtitle ?? "");
    setDescription(slide?.description ?? "");
    setCtaLabel(slide?.ctaLabel ?? "بیشتر بدانید");
    setCtaHref(slide?.ctaHref ?? "/about/biography");
    setImageId(slide?.imageId ?? null);
    setImageUrl(slide?.image ?? "");
    setMobileImageId(slide?.mobileImageId ?? null);
    setMobileImageUrl(slide?.mobileImage ?? "");
    setIsActive(slide?.isActive !== false);
    const savedDays = (slide?.weekdays ?? []).filter((day) => day >= 1 && day <= 7);
    setRestrictWeekdays(savedDays.length > 0 && savedDays.length < 7);
    setWeekdays(savedDays);
    setError(null);
  }, [open, slide]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, saving]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextSlug = slug.trim() || slugifyFa(title);
    if (!nextSlug || !title.trim()) {
      setError("اسلاگ و عنوان الزامی است.");
      return;
    }
    if (!imageId && !imageUrl.trim()) {
      setError("تصویر دسکتاپ الزامی است.");
      return;
    }
    if (restrictWeekdays && weekdays.length === 0) {
      setError("حداقل یک روز هفته را انتخاب کنید.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        slug: nextSlug,
        title: title.trim(),
        eyebrow: eyebrow.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        ctaLabel: ctaLabel.trim() || "بیشتر بدانید",
        ctaHref: ctaHref.trim() || "/",
        imageId,
        mobileImageId,
        isActive,
        weekdays: restrictWeekdays ? weekdays : [],
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setSaving(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
        onClick={() => {
          if (!saving) onClose();
        }}
        aria-label="بستن"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="slider-form-title"
        className={formDialogClassName}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="slider-form-title" className="text-base font-bold text-ink">
            {isEdit ? "ویرایش اسلاید" : "اسلاید جدید"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-muted transition hover:bg-cream"
            aria-label="بستن"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={formDialogFieldsClassName}>
          <div className={formDialogFullClassName}>
            <ImageAssetField
              label="تصویر دسکتاپ"
              hint="نسبت عریض (~۴:۱، مثلاً ۱۷۷۴×۴۴۱). این تصویر از تبلت به بالا دیده می‌شود."
              kind="hero"
              imageId={imageId}
              imageUrl={imageUrl}
              aspectClass="aspect-[1774/441] min-h-[8rem]"
              objectFit="contain"
              onChange={({ id, url }) => {
                setImageId(id);
                setImageUrl(url);
              }}
            />
          </div>

          <div className={formDialogFullClassName}>
            <ImageAssetField
              label="تصویر موبایل (اختیاری)"
              hint="نسبت حدود ۴:۵ (مثلاً ۱۰۸۰×۱۳۵۰). اگر خالی باشد همان تصویر دسکتاپ روی موبایل برش می‌خورد."
              kind="hero"
              imageId={mobileImageId}
              imageUrl={mobileImageUrl}
              aspectClass="aspect-[4/5] min-h-[10rem] max-w-xs"
              previewClassName="max-w-xs"
              objectFit="contain"
              removeDescription="تصویر موبایل برداشته می‌شود و اسلاید روی گوشی از نسخه دسکتاپ استفاده می‌کند."
              onChange={({ id, url }) => {
                setMobileImageId(id);
                setMobileImageUrl(url);
              }}
            />
          </div>

          <Field label="عنوان" htmlFor="slide-title">
            <Input
              id="slide-title"
              value={title}
              onChange={(e) => {
                const next = e.target.value;
                setTitle(next);
                if (!slugTouched) setSlug(slugifyFa(next));
              }}
              required
            />
          </Field>

          <Field label="اسلاگ" htmlFor="slide-slug" hint="در آدرس API استفاده می‌شود">
            <Input
              id="slide-slug"
              value={slug}
              dir="ltr"
              className="text-start font-mono"
              disabled={isEdit}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
            />
          </Field>

          <Field label="خط بالای عنوان" htmlFor="slide-eyebrow">
            <Input
              id="slide-eyebrow"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
            />
          </Field>
          <Field label="زیرعنوان" htmlFor="slide-subtitle">
            <Input
              id="slide-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </Field>

          <div className={formDialogFullClassName}>
            <Field label="توضیح" htmlFor="slide-desc">
              <Textarea
                id="slide-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </div>

          <Field label="متن دکمه" htmlFor="slide-cta-label">
            <Input
              id="slide-cta-label"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
            />
          </Field>
          <Field label="لینک دکمه" htmlFor="slide-cta-href">
            <Input
              id="slide-cta-href"
              value={ctaHref}
              dir="ltr"
              className="text-start font-mono"
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="/about/biography"
            />
          </Field>

          <div className={formDialogFullClassName}>
            <Checkbox
              id="slide-active"
              label="نمایش در صفحه اصلی"
              description="فقط اسلایدهای فعال در سایت دیده می‌شوند."
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </div>

          <div className={formDialogFullClassName}>
            <Checkbox
              id="slide-restrict-weekdays"
              label="فقط در روزهای مشخص"
              description="خاموش = هر روز هفته. روشن = فقط روزهایی که انتخاب می‌کنید (به وقت تهران)."
              checked={restrictWeekdays}
              onChange={(e) => {
                const next = e.target.checked;
                setRestrictWeekdays(next);
                if (!next) setWeekdays([]);
              }}
            />
          </div>

          {restrictWeekdays ? (
            <div className={formDialogFullClassName}>
              <Field
                label="روزهای نمایش"
                hint={
                  weekdays.length ? formatHeroWeekdays(weekdays) : "حداقل یک روز را انتخاب کنید"
                }
              >
                <div className="flex flex-wrap gap-2">
                  {HERO_WEEKDAYS.map((day) => {
                    const selected = weekdays.includes(day.iso);
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        onClick={() => {
                          setWeekdays((current) =>
                            current.includes(day.iso)
                              ? current.filter((value) => value !== day.iso)
                              : [...current, day.iso],
                          );
                        }}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          selected
                            ? "bg-pine text-white"
                            : "border border-ink/15 bg-surface text-ink hover:border-pine/40"
                        }`}
                        aria-pressed={selected}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          ) : null}

          {error ? <p className={`${formDialogFullClassName} text-sm text-red-600`}>{error}</p> : null}

          <div className={`${formDialogFullClassName} flex flex-col-reverse gap-2 border-t border-ink/10 pt-4 sm:flex-row sm:justify-end`}>
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="btn-secondary disabled:opacity-60"
            >
              انصراف
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  در حال ذخیره…
                </>
              ) : isEdit ? (
                "ذخیره"
              ) : (
                "ایجاد اسلاید"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
