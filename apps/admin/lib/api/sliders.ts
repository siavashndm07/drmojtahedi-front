import { apiFetch } from "@/lib/api/client";

export type AdminHeroSlide = {
  id: string;
  slug: string;
  image: string;
  imageId?: string | null;
  mobileImage?: string;
  mobileImageId?: string | null;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sortOrder?: number;
  isActive?: boolean;
  weekdays?: number[];
};

export type HeroSlidePayload = {
  slug: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageId?: string | null;
  mobileImageId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  weekdays?: number[];
};

/** Iranian week order. ISO: Mon=1 … Sun=7. */
export const HERO_WEEKDAYS = [
  { iso: 6, label: "شنبه" },
  { iso: 7, label: "یکشنبه" },
  { iso: 1, label: "دوشنبه" },
  { iso: 2, label: "سه‌شنبه" },
  { iso: 3, label: "چهارشنبه" },
  { iso: 4, label: "پنجشنبه" },
  { iso: 5, label: "جمعه" },
] as const;

export function formatHeroWeekdays(weekdays?: number[] | null): string {
  const days = weekdays ?? [];
  if (days.length === 0 || days.length >= 7) return "همه روزها";
  const selected = new Set(days);
  return HERO_WEEKDAYS.filter((day) => selected.has(day.iso))
    .map((day) => day.label)
    .join("، ");
}

export async function getHeroSlides(token: string) {
  return apiFetch<AdminHeroSlide[]>("/admin/hero-slides/", { token });
}

export async function createHeroSlide(token: string, payload: HeroSlidePayload) {
  return apiFetch<AdminHeroSlide>("/admin/hero-slides/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateHeroSlide(
  token: string,
  slug: string,
  payload: Partial<HeroSlidePayload>,
) {
  return apiFetch<AdminHeroSlide>(`/admin/hero-slides/${encodeURIComponent(slug)}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deactivateHeroSlide(token: string, slug: string) {
  await apiFetch(`/admin/hero-slides/${encodeURIComponent(slug)}/`, {
    method: "DELETE",
    token,
  });
}
