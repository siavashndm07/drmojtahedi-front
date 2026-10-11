"use client";

import { useMemo } from "react";
import type {
  BodyBackground,
  BodyBackgroundMode,
  BrandColorKey,
  BrandColors,
} from "@drmojtahedi/shared";
import {
  BRAND_COLOR_PALETTES,
  BRAND_PALETTE_COLOR_KEYS,
  DEFAULT_BODY_BACKGROUND,
  DEFAULT_BRAND_COLORS,
  bodyBackgroundCssValue,
  brandColorsScopeCss,
  isSameBrandColors,
  mergeBodyBackground,
  mergeBrandColors,
  normalizeHex,
} from "@drmojtahedi/shared";
import { BRAND_COLOR_LABELS } from "@/lib/api/settings";
import { Field, Input } from "@/components/form";

type Props = {
  value: BrandColors;
  onChange: (next: BrandColors) => void;
};

export default function BrandColorsEditor({ value, onChange }: Props) {
  const colors = useMemo(() => mergeBrandColors(value), [value]);
  const bodyBg = mergeBodyBackground(colors.bodyBackground);

  const previewCss = useMemo(
    () => brandColorsScopeCss(".brand-colors-preview", colors),
    [colors],
  );

  const activePaletteId =
    BRAND_COLOR_PALETTES.find((palette) =>
      isSameBrandColors(palette.colors, colors),
    )?.id ?? null;

  function patchColor(key: BrandColorKey, raw: string) {
    if (key === "bodyBackground") return;
    const normalized = normalizeHex(raw);
    if (!normalized) return;
    onChange({ ...colors, [key]: normalized });
  }

  function patchBody(partial: Partial<BodyBackground>) {
    onChange({
      ...colors,
      bodyBackground: mergeBodyBackground({ ...bodyBg, ...partial }),
    });
  }

  function applyPalette(paletteColors: BrandColors) {
    onChange({
      ...mergeBrandColors(paletteColors),
      bodyBackground: bodyBg,
      ...(colors.accent ? { accent: colors.accent } : {}),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 text-sm font-semibold text-ink">پالت‌های آماده</p>
        <p className="mb-3 text-xs leading-6 text-ink-muted">
          یک پالت را انتخاب کنید؛ بعداً هر رنگ را جداگانه هم می‌توانید تنظیم کنید.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {BRAND_COLOR_PALETTES.map((palette) => {
            const active = activePaletteId === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => applyPalette(palette.colors)}
                className={`rounded-2xl border p-3 text-start transition ${
                  active
                    ? "border-pine bg-mint-soft/60 ring-2 ring-pine/25 dark:bg-mint/30"
                    : "border-ink/10 bg-surface hover:border-pine/30 hover:shadow-sm"
                }`}
              >
                <div className="mb-2 flex h-8 overflow-hidden rounded-xl border border-ink/5">
                  {BRAND_PALETTE_COLOR_KEYS.map((key) => (
                    <span
                      key={key}
                      className="flex-1"
                      style={{ backgroundColor: palette.colors[key] }}
                      title={BRAND_COLOR_LABELS[key]}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-ink">{palette.label}</p>
                <p className="mt-0.5 text-[11px] leading-5 text-ink-muted">
                  {palette.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {BRAND_PALETTE_COLOR_KEYS.map((key) => (
          <Field key={key} label={BRAND_COLOR_LABELS[key] ?? key}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => patchColor(key, e.target.value)}
                className="h-11 w-12 shrink-0 cursor-pointer rounded-xl border border-ink/10 bg-surface p-1"
                aria-label={BRAND_COLOR_LABELS[key]}
              />
              <Input
                value={colors[key]}
                dir="ltr"
                className="text-start font-mono text-sm"
                onChange={(e) => patchColor(key, e.target.value)}
              />
            </div>
          </Field>
        ))}
        <Field
          label={BRAND_COLOR_LABELS.accent ?? "accent"}
          hint="اختیاری — برای نشان‌ها و هایلایت"
        >
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={colors.accent ?? colors.pine}
              onChange={(e) => patchColor("accent", e.target.value)}
              className="h-11 w-12 shrink-0 cursor-pointer rounded-xl border border-ink/10 bg-surface p-1"
              aria-label="accent"
            />
            <Input
              value={colors.accent ?? ""}
              dir="ltr"
              className="text-start font-mono text-sm"
              placeholder="#E07A5F"
              onChange={(e) => patchColor("accent", e.target.value)}
            />
          </div>
        </Field>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-cream/30 p-4 dark:bg-mint/15 sm:p-5">
        <p className="text-sm font-semibold text-ink">پس‌زمینه صفحه سایت</p>
        <p className="mt-1 text-xs leading-6 text-ink-muted">
          رنگ زمینهٔ اصلی <span className="font-mono" dir="ltr">body / html</span>{" "}
          — یکدست یا گرادیان.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              { id: "solid", label: "یکدست" },
              { id: "gradient", label: "گرادیان" },
            ] as { id: BodyBackgroundMode; label: string }[]
          ).map((opt) => {
            const active = bodyBg.mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => patchBody({ mode: opt.id })}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-pine text-white"
                    : "border border-ink/10 bg-surface text-ink-muted hover:border-pine/30 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field
            label={bodyBg.mode === "gradient" ? "رنگ شروع" : "رنگ پس‌زمینه"}
          >
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bodyBg.color}
                onChange={(e) => {
                  const hex = normalizeHex(e.target.value);
                  if (hex) patchBody({ color: hex });
                }}
                className="h-11 w-12 shrink-0 cursor-pointer rounded-xl border border-ink/10 bg-surface p-1"
                aria-label="رنگ پس‌زمینه"
              />
              <Input
                value={bodyBg.color}
                dir="ltr"
                className="text-start font-mono text-sm"
                onChange={(e) => {
                  const hex = normalizeHex(e.target.value);
                  if (hex) patchBody({ color: hex });
                }}
              />
            </div>
          </Field>

          {bodyBg.mode === "gradient" ? (
            <Field label="رنگ پایان">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bodyBg.colorEnd}
                  onChange={(e) => {
                    const hex = normalizeHex(e.target.value);
                    if (hex) patchBody({ colorEnd: hex });
                  }}
                  className="h-11 w-12 shrink-0 cursor-pointer rounded-xl border border-ink/10 bg-surface p-1"
                  aria-label="رنگ پایان گرادیان"
                />
                <Input
                  value={bodyBg.colorEnd}
                  dir="ltr"
                  className="text-start font-mono text-sm"
                  onChange={(e) => {
                    const hex = normalizeHex(e.target.value);
                    if (hex) patchBody({ colorEnd: hex });
                  }}
                />
              </div>
            </Field>
          ) : null}

          {bodyBg.mode === "gradient" ? (
            <Field
              label="زاویه گرادیان"
              hint={`${bodyBg.angle} درجه`}
              className="sm:col-span-2"
            >
              <input
                type="range"
                min={0}
                max={360}
                step={5}
                value={bodyBg.angle}
                onChange={(e) => patchBody({ angle: Number(e.target.value) })}
                className="w-full accent-[rgb(var(--pine))]"
              />
            </Field>
          ) : null}
        </div>

        <div
          className="mt-4 h-16 overflow-hidden rounded-xl border border-ink/10"
          style={{ background: bodyBackgroundCssValue(bodyBg) }}
          aria-hidden
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
        <p className="border-b border-ink/10 px-4 py-2 text-xs font-medium text-ink-muted">
          پیش‌نمایش
        </p>
        <div className="brand-colors-preview p-4">
          <style>{previewCss}</style>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary pointer-events-none">
              دکمه اصلی
            </button>
            <button type="button" className="btn-secondary pointer-events-none">
              دکمه ثانویه
            </button>
            <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-medium text-pine">
              برچسب
            </span>
            <span className="text-sm font-semibold text-mint-deep">متن تاکید</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-secondary !px-4 !py-2 text-xs"
        onClick={() =>
          onChange({
            ...DEFAULT_BRAND_COLORS,
            bodyBackground: { ...DEFAULT_BODY_BACKGROUND },
          })
        }
      >
        بازنشانی به پیش‌فرض
      </button>
    </div>
  );
}
