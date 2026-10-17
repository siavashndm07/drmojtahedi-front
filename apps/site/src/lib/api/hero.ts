import { isApiEnabled, rewritePublicMediaUrl } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import type { HeroSlide } from "@/lib/mock/hero";

type ApiHeroSlide = {
  slug?: string;
  id?: string;
  image?: string;
  mobileImage?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const TONES = ["pine", "ink", "bronze"] as const;

export async function listHeroSlides(): Promise<HeroSlide[]> {
  if (!isApiEnabled()) return [];
  try {
    const data = await apiGet<ApiHeroSlide[] | { results: ApiHeroSlide[] }>("/hero-slides/");
    const slides = await unwrapList(data);
    return slides
      .map((slide, index) => {
        const image = rewritePublicMediaUrl(slide.image || "");
        if (!image || !slide.title) return null;
        const mobile = rewritePublicMediaUrl(slide.mobileImage || "");
        return {
          id: slide.slug || slide.id || String(index),
          eyebrow: slide.eyebrow || "",
          title: slide.title,
          subtitle: slide.subtitle || "",
          description: slide.description || "",
          ctaLabel: slide.ctaLabel || "بیشتر بدانید",
          ctaHref: slide.ctaHref || "/",
          image,
          mobileImage: mobile || image,
          imageAlt: slide.title,
          tone: TONES[index % TONES.length],
        } satisfies HeroSlide;
      })
      .filter((slide): slide is HeroSlide => slide !== null);
  } catch {
    return [];
  }
}
