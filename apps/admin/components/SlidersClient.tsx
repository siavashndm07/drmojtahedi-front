"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Image as ImageIcon,
  Images,
  Pencil,
  Plus,
  SearchX,
  Trash2,
} from "lucide-react";
import {
  DEFAULT_HERO_TEMPLATE,
  HERO_AUTOPLAY_DELAY_MAX_MS,
  HERO_AUTOPLAY_DELAY_MIN_MS,
  normalizeHeroAutoplayDelay,
  normalizeHeroTemplateId,
  type HeroTemplateId,
  ports,
} from "@drmojtahedi/shared";
import ActionIconButton from "@/components/ActionIconButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState, { NO_MATCH_DESCRIPTION, NO_MATCH_TITLE } from "@/components/EmptyState";
import FilterPills from "@/components/FilterPills";
import HeroTemplatePicker from "@/components/HeroTemplatePicker";
import PageHeader from "@/components/PageHeader";
import SliderFormDialog from "@/components/SliderFormDialog";
import SortableHandle from "@/components/SortableHandle";
import { Field, Input, NumberInput } from "@/components/form";
import { useAuth } from "@/lib/auth";
import { isApiEnabled } from "@/lib/api/client";
import {
  createHeroSlide,
  deactivateHeroSlide,
  formatHeroWeekdays,
  getHeroSlides,
  updateHeroSlide,
  type AdminHeroSlide,
  type HeroSlidePayload,
} from "@/lib/api/sliders";
import { getSiteSettings, updateSiteSettings } from "@/lib/api/settings";
import { toPersianDigits } from "@/lib/digits";
import { mediaAssetUrl } from "@/lib/mediaAssetUrl";
import { arrayMove, useListReorder } from "@/lib/reorder";

type StatusFilter = "all" | "active" | "inactive";

export default function SlidersClient() {
  const { accessToken } = useAuth();
  const [slides, setSlides] = useState<AdminHeroSlide[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminHeroSlide | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminHeroSlide | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [heroTemplate, setHeroTemplate] = useState<HeroTemplateId>(DEFAULT_HERO_TEMPLATE);
  const [heroAutoplaySeconds, setHeroAutoplaySeconds] = useState(5.6);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [list, settings] = await Promise.all([
          getHeroSlides(accessToken!),
          getSiteSettings(accessToken!).catch(() => null),
        ]);
        if (!cancelled) {
          setSlides(list);
          if (settings?.heroTemplate) {
            setHeroTemplate(normalizeHeroTemplateId(settings.heroTemplate));
          }
          if (settings?.heroAutoplayDelay) {
            setHeroAutoplaySeconds(
              normalizeHeroAutoplayDelay(settings.heroAutoplayDelay) / 1000,
            );
          }
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "بارگذاری ناموفق");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const statusCounts = useMemo(
    () => ({
      all: slides.length,
      active: slides.filter((s) => s.isActive !== false).length,
      inactive: slides.filter((s) => s.isActive === false).length,
    }),
    [slides],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return slides.filter((slide) => {
      if (statusFilter === "active" && slide.isActive === false) return false;
      if (statusFilter === "inactive" && slide.isActive !== false) return false;
      if (!q) return true;
      return (
        slide.title.toLowerCase().includes(q) ||
        slide.slug.toLowerCase().includes(q) ||
        (slide.eyebrow || "").toLowerCase().includes(q)
      );
    });
  }, [slides, query, statusFilter]);

  const filteredOut = Boolean(query.trim()) || statusFilter !== "all";
  const canDragReorder = !filteredOut && !reordering && filtered.length > 1;

  async function persistOrder(next: AdminHeroSlide[]) {
    if (!accessToken) return;
    const previous = slides;
    const numbered = next.map((slide, index) => ({ ...slide, sortOrder: index }));
    setSlides(numbered);
    setReordering(true);
    try {
      await Promise.all(
        numbered.map((slide) =>
          updateHeroSlide(accessToken, slide.slug, { sortOrder: slide.sortOrder }),
        ),
      );
    } catch (err) {
      setSlides(previous);
      toast.error(err instanceof Error ? err.message : "جابه‌جایی ناموفق");
    } finally {
      setReordering(false);
    }
  }

  const reorder = useListReorder({
    enabled: canDragReorder,
    onMove: (from, to) => {
      void persistOrder(arrayMove(slides, from, to));
    },
  });

  async function handleSubmit(payload: HeroSlidePayload) {
    if (!accessToken) throw new Error("وارد پنل نشده‌اید.");
    if (editing) {
      const updated = await updateHeroSlide(accessToken, editing.slug, payload);
      setSlides((prev) => prev.map((item) => (item.slug === editing.slug ? updated : item)));
      toast.success("اسلاید ذخیره شد");
      return;
    }
    const created = await createHeroSlide(accessToken, payload);
    setSlides((prev) => [...prev, created]);
    toast.success("اسلاید ایجاد شد");
  }

  async function move(index: number, direction: -1 | 1) {
    if (!accessToken || reordering) return;
    const target = index + direction;
    if (target < 0 || target >= filtered.length) return;
    if (!filteredOut) {
      await persistOrder(arrayMove(slides, index, target));
      return;
    }
    const a = filtered[index];
    const b = filtered[target];
    const orderA = a.sortOrder ?? index;
    const orderB = b.sortOrder ?? target;
    try {
      const [updatedA, updatedB] = await Promise.all([
        updateHeroSlide(accessToken, a.slug, { sortOrder: orderB }),
        updateHeroSlide(accessToken, b.slug, { sortOrder: orderA }),
      ]);
      setSlides((prev) =>
        prev
          .map((item) => {
            if (item.slug === a.slug) return updatedA;
            if (item.slug === b.slug) return updatedB;
            return item;
          })
          .sort((x, y) => (x.sortOrder ?? 0) - (y.sortOrder ?? 0)),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "جابه‌جایی ناموفق");
    }
  }

  async function confirmDeactivate() {
    if (!deactivateTarget || !accessToken) return;
    setDeactivating(true);
    try {
      await deactivateHeroSlide(accessToken, deactivateTarget.slug);
      setSlides((prev) =>
        prev.map((item) =>
          item.slug === deactivateTarget.slug ? { ...item, isActive: false } : item,
        ),
      );
      toast.success("اسلاید از صفحه اصلی برداشته شد");
      setDeactivateTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "عملیات ناموفق");
    } finally {
      setDeactivating(false);
    }
  }

  async function handleTemplateChange(next: HeroTemplateId) {
    if (!accessToken) return;
    setHeroTemplate(next);
    setTemplateSaving(true);
    try {
      const saved = await updateSiteSettings(accessToken, { heroTemplate: next });
      setHeroTemplate(normalizeHeroTemplateId(saved.heroTemplate));
      toast.success("قالب اسلایدر ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره قالب ناموفق");
    } finally {
      setTemplateSaving(false);
    }
  }

  async function handleAutoplayDelaySave() {
    if (!accessToken) return;
    const delayMs = normalizeHeroAutoplayDelay(Math.round(heroAutoplaySeconds * 1000));
    setTemplateSaving(true);
    try {
      const saved = await updateSiteSettings(accessToken, { heroAutoplayDelay: delayMs });
      setHeroAutoplaySeconds(normalizeHeroAutoplayDelay(saved.heroAutoplayDelay) / 1000);
      toast.success("فاصله بین اسلایدها ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق");
    } finally {
      setTemplateSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="اسلایدر صفحه اصلی"
        description={
          loading
            ? "در حال بارگذاری…"
            : `${toPersianDigits(filtered.length)} اسلاید${isApiEnabled() ? "" : " (دمو)"}`
        }
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="btn-primary !gap-1.5 !py-2 text-xs"
          >
            <Plus className="h-4 w-4" aria-hidden />
            اسلاید جدید
          </button>
        }
      />

      <div className="mb-4 space-y-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <HeroTemplatePicker
          value={heroTemplate}
          saving={templateSaving}
          onChange={(next) => void handleTemplateChange(next)}
        />
        <div className="flex flex-col gap-3 border-t border-ink/10 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <Field
            label="فاصله بین اسلایدها (ثانیه)"
            htmlFor="hero-autoplay-delay"
            hint={`بین ${HERO_AUTOPLAY_DELAY_MIN_MS / 1000} تا ${HERO_AUTOPLAY_DELAY_MAX_MS / 1000} ثانیه`}
            className="max-w-xs"
          >
            <NumberInput
              id="hero-autoplay-delay"
              value={heroAutoplaySeconds}
              min={HERO_AUTOPLAY_DELAY_MIN_MS / 1000}
              max={HERO_AUTOPLAY_DELAY_MAX_MS / 1000}
              step={0.5}
              disabled={templateSaving}
              onChange={(value) => {
                if (value !== undefined) setHeroAutoplaySeconds(value);
              }}
            />
          </Field>
          <button
            type="button"
            disabled={templateSaving}
            onClick={() => void handleAutoplayDelaySave()}
            className="btn-secondary shrink-0 disabled:opacity-60"
          >
            ذخیره فاصله اسلایدها
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-ink/10 bg-mint-soft/30 p-4 dark:bg-mint/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-white">
            <ImageIcon className="h-5 w-5" aria-hidden />
          </div>
          <p className="text-sm leading-7 text-ink-muted">
            با دستگیره بکشید تا ترتیب چرخش هیرو در صفحه اصلی عوض شود. تصویر عریض و دکمه
            CTA همان چیزی است که بازدیدکننده می‌بیند.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mb-4 space-y-4 rounded-2xl border border-ink/10 bg-surface p-4">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو عنوان یا اسلاگ…"
        />
        <FilterPills<StatusFilter>
          label="وضعیت"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "همه", count: statusCounts.all },
            { value: "active", label: "فعال", count: statusCounts.active },
            { value: "inactive", label: "غیرفعال", count: statusCounts.inactive },
          ]}
        />
        {filteredOut ? (
          <p className="text-xs text-ink-muted">
            برای کشیدن و رها کردن ترتیب، جستجو را خالی و وضعیت را روی «همه» بگذارید.
          </p>
        ) : null}
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState
          icon={filteredOut ? SearchX : Images}
          title={filteredOut ? NO_MATCH_TITLE : "هنوز اسلایدی ساخته نشده"}
          description={
            filteredOut
              ? NO_MATCH_DESCRIPTION
              : "تصویر عریض، عنوان و دکمه را اضافه کنید تا در هیروی صفحه اصلی بچرخد. تا آن زمان، اسلایدهای پیش‌فرض سایت دیده می‌شوند."
          }
          action={
            filteredOut ? (
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
              <button
                type="button"
                className="btn-primary !gap-1.5 !py-2 text-xs"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                اسلاید جدید
              </button>
            )
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((slide, index) => {
            const src = mediaAssetUrl(slide.image);
            return (
              <li
                key={slide.slug}
                {...reorder.itemProps(index)}
                className={reorder.itemClassName(
                  index,
                  "overflow-hidden rounded-2xl border border-ink/10 bg-surface",
                )}
              >
                <div className="grid gap-0 sm:grid-cols-[auto_minmax(0,220px)_minmax(0,1fr)]">
                  <div className="flex items-start p-3 sm:items-center">
                    <SortableHandle
                      disabled={!canDragReorder}
                      label={`جابه‌جایی اسلاید ${slide.title}`}
                    />
                  </div>
                  <div className="relative aspect-[16/7] bg-cream sm:aspect-auto sm:min-h-[7.5rem]">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="220px"
                        className="pointer-events-none object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full min-h-[7.5rem] items-center justify-center text-ink-muted">
                        <ImageIcon className="h-6 w-6" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between gap-3 p-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink">{slide.title}</p>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            slide.isActive === false
                              ? "bg-red-50 text-red-600"
                              : "bg-mint-soft text-pine dark:bg-mint"
                          }`}
                        >
                          {slide.isActive === false ? "غیرفعال" : "فعال"}
                        </span>
                        {slide.weekdays && slide.weekdays.length > 0 ? (
                          <span className="inline-flex rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
                            {formatHeroWeekdays(slide.weekdays)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">
                        {slide.subtitle || slide.description || "—"}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-ink-muted" dir="ltr">
                        {slide.ctaLabel} → {slide.ctaHref}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <ActionIconButton
                        label="بالاتر"
                        variant="muted"
                        onClick={() => void move(index, -1)}
                      >
                        <ArrowUp className="h-4 w-4" aria-hidden />
                      </ActionIconButton>
                      <ActionIconButton
                        label="پایین‌تر"
                        variant="muted"
                        onClick={() => void move(index, 1)}
                      >
                        <ArrowDown className="h-4 w-4" aria-hidden />
                      </ActionIconButton>
                      <ActionIconButton
                        label="ویرایش"
                        variant="primary"
                        onClick={() => {
                          setEditing(slide);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </ActionIconButton>
                      <ActionIconButton
                        label="مشاهده در سایت"
                        variant="muted"
                        href={`http://localhost:${ports.site}/`}
                        external
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </ActionIconButton>
                      {slide.isActive !== false ? (
                        <ActionIconButton
                          label="غیرفعال‌سازی"
                          variant="muted"
                          onClick={() => setDeactivateTarget(slide)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" aria-hidden />
                        </ActionIconButton>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <SliderFormDialog
        open={formOpen}
        slide={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        title="غیرفعال‌سازی اسلاید"
        description={
          deactivateTarget
            ? `اسلاید «${deactivateTarget.title}» دیگر در صفحه اصلی دیده نمی‌شود.`
            : undefined
        }
        confirmLabel="بله، غیرفعال شود"
        loading={deactivating}
        onConfirm={() => void confirmDeactivate()}
        onClose={() => {
          if (!deactivating) setDeactivateTarget(null);
        }}
      />
    </div>
  );
}
