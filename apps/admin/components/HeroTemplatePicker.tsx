"use client";

import {
  HERO_TEMPLATES,
  normalizeHeroTemplateId,
  type HeroTemplateId,
} from "@drmojtahedi/shared";

type Props = {
  value: HeroTemplateId;
  saving?: boolean;
  onChange: (next: HeroTemplateId) => void;
};

export default function HeroTemplatePicker({ value, saving = false, onChange }: Props) {
  const active = normalizeHeroTemplateId(value);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-ink">قالب اسلایدر</p>
        <p className="mt-1 text-xs leading-6 text-ink-muted">
          نحوه نمایش اسلایدها در صفحه اصلی. محتوای هر اسلاید همان است؛ فقط چیدمان عوض می‌شود.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {HERO_TEMPLATES.map((template) => {
          const selected = active === template.id;
          return (
            <button
              key={template.id}
              type="button"
              disabled={saving}
              onClick={() => onChange(template.id)}
              className={`rounded-2xl border p-4 text-start transition disabled:opacity-60 ${
                selected
                  ? "border-pine bg-mint-soft/60 ring-2 ring-pine/25 dark:bg-mint/30"
                  : "border-ink/10 bg-surface hover:border-pine/30 hover:shadow-sm"
              }`}
            >
              <p className="text-sm font-semibold text-ink">{template.label}</p>
              <p className="mt-1 text-[11px] leading-5 text-ink-muted">{template.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {template.preview.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cream/80 px-2 py-0.5 text-[10px] text-ink-muted dark:bg-mint/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
