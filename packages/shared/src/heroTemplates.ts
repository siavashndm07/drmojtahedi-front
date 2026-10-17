export type HeroTemplateId = "fullBleed" | "splitText" | "minimalCta";

export type HeroTemplateDef = {
  id: HeroTemplateId;
  label: string;
  description: string;
  preview: string[];
};

export const HERO_TEMPLATES: HeroTemplateDef[] = [
  {
    id: "fullBleed",
    label: "تمام‌عرض",
    description: "اسلایدر محو با تصویر بزرگ و دکمه‌های CTA",
    preview: ["تصویر تمام‌صفحه", "CTA پایین", "نقطه‌چین + فلش"],
  },
  {
    id: "splitText",
    label: "تصویر + متن",
    description: "eyebrow، عنوان و توضیح روی اسلاید تمام‌عرض",
    preview: ["متن قابل‌خواندن", "CTA", "مناسب بدون متن روی تصویر"],
  },
  {
    id: "minimalCta",
    label: "کاروسل بنر",
    description: "اسلاید گرد با پیش‌نمایش اسلاید بعدی",
    preview: ["گوشه گرد", "پیش‌نمایش اسلاید", "نقطه‌چین"],
  },
];

export const DEFAULT_HERO_TEMPLATE: HeroTemplateId = "fullBleed";

export const DEFAULT_HERO_AUTOPLAY_DELAY_MS = 5600;
export const HERO_AUTOPLAY_DELAY_MIN_MS = 2000;
export const HERO_AUTOPLAY_DELAY_MAX_MS = 30000;

const TEMPLATE_IDS = new Set<string>(HERO_TEMPLATES.map((item) => item.id));

export function normalizeHeroTemplateId(raw?: string | null): HeroTemplateId {
  const id = String(raw ?? "").trim();
  if (TEMPLATE_IDS.has(id)) return id as HeroTemplateId;
  return DEFAULT_HERO_TEMPLATE;
}

export function normalizeHeroAutoplayDelay(raw?: number | null): number {
  const value = Number(raw);
  if (!Number.isFinite(value)) return DEFAULT_HERO_AUTOPLAY_DELAY_MS;
  return Math.min(
    HERO_AUTOPLAY_DELAY_MAX_MS,
    Math.max(HERO_AUTOPLAY_DELAY_MIN_MS, Math.round(value)),
  );
}
