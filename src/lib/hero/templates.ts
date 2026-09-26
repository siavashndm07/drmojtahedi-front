export type HeroTemplateId = "fullBleed" | "splitText" | "minimalCta";

export type HeroTemplateDef = {
  id: HeroTemplateId;
  label: string;
  description: string;
};

export const HERO_TEMPLATES: HeroTemplateDef[] = [
  {
    id: "fullBleed",
    label: "تمام‌عرض",
    description: "اسلایدر محو با تصویر بزرگ و دکمه‌های CTA",
  },
  {
    id: "splitText",
    label: "تصویر + متن",
    description: "eyebrow، عنوان و توضیح روی اسلاید تمام‌عرض",
  },
  {
    id: "minimalCta",
    label: "کاروسل بنر",
    description: "اسلاید گرد با پیش‌نمایش اسلاید بعدی — سبک بومی‌ژا",
  },
];

/** Default matches SensibleCool store setting. */
export const DEFAULT_HERO_TEMPLATE: HeroTemplateId = "fullBleed";

export const DEFAULT_HERO_AUTOPLAY_DELAY_MS = 5600;

const TEMPLATE_IDS = new Set<string>(HERO_TEMPLATES.map((item) => item.id));

export function normalizeHeroTemplateId(raw?: string | null): HeroTemplateId {
  const id = String(raw ?? "").trim();
  if (TEMPLATE_IDS.has(id)) return id as HeroTemplateId;
  return DEFAULT_HERO_TEMPLATE;
}
