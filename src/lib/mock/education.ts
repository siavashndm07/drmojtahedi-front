import type { SelectOption } from "@/components/forms/SelectListbox";

/** Standard Iranian education levels for profile / membership forms. */
export const EDUCATION_OPTIONS: SelectOption[] = [
  { value: "below-diploma", label: "زیر دیپلم", hint: "پایین‌تر از دیپلم متوسطه" },
  { value: "diploma", label: "دیپلم", hint: "دیپلم متوسطه" },
  { value: "associate", label: "کاردانی", hint: "فوق‌دیپلم / کاردانی" },
  { value: "bachelor", label: "کارشناسی", hint: "لیسانس" },
  { value: "master", label: "کارشناسی ارشد", hint: "فوق‌لیسانس" },
  { value: "doctorate", label: "دکتری", hint: "دکتری تخصصی یا حرفه‌ای" },
  { value: "seminary", label: "حوزوی", hint: "تحصیلات حوزوی" },
  { value: "other", label: "سایر", hint: "سایر مدارک یا مسیرها" },
];

export function educationLabel(value: string): string {
  return EDUCATION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/** Map free-text / legacy values onto option ids when possible. */
export function normalizeEducationValue(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (EDUCATION_OPTIONS.some((o) => o.value === trimmed)) return trimmed;
  const byLabel = EDUCATION_OPTIONS.find((o) => o.label === trimmed);
  if (byLabel) return byLabel.value;
  const lower = trimmed.toLowerCase();
  const aliases: Record<string, string> = {
    لیسانس: "bachelor",
    فوق‌لیسانس: "master",
    "فوق لیسانس": "master",
    فوق‌دیپلم: "associate",
    "فوق دیپلم": "associate",
    phd: "doctorate",
    PhD: "doctorate",
  };
  return aliases[trimmed] ?? aliases[lower] ?? "";
}
