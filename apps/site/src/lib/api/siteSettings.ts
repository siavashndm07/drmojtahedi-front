import {
  mergeBrandColors,
  mergeHomeSections,
  mergeSiteBanner,
  normalizeHeroAutoplayDelay,
  normalizeHeroTemplateId,
  normalizeHomeSectionOrder,
  type BrandColors,
  type HeroTemplateId,
  type HomeSectionKey,
  type HomeSections,
  type SiteBanner,
} from "@drmojtahedi/shared";
import { getServerApiUrl, isApiEnabled, rewritePublicMediaUrl } from "@/lib/api/config";

export type PublicSiteSettings = {
  nameFa?: string;
  nameEn?: string;
  tagline?: string;
  taglineFa?: string;
  brandColors?: Partial<BrandColors> | null;
  siteBanner?: Partial<SiteBanner> | null;
  logo?: string;
  logoDark?: string;
  favicon?: string;
  url?: string;
  email?: string;
  phone?: string;
  phoneSecondary?: string;
  address?: string;
  social?: Partial<Record<string, string>> | null;
  homeSections?: Partial<HomeSections> | null;
  homeSectionOrder?: HomeSectionKey[] | null;
  heroTemplate?: HeroTemplateId | null;
  heroAutoplayDelay?: number | null;
};

export async function fetchPublicSiteSettings(): Promise<PublicSiteSettings | null> {
  if (!isApiEnabled()) return null;
  const base = getServerApiUrl();
  if (!base) return null;
  try {
    const response = await fetch(`${base}/site/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as PublicSiteSettings;
    return {
      ...data,
      brandColors: mergeBrandColors(data.brandColors),
      siteBanner: mergeSiteBanner(data.siteBanner),
      logo: rewritePublicMediaUrl(data.logo ?? ""),
      logoDark: rewritePublicMediaUrl(data.logoDark ?? ""),
      favicon: rewritePublicMediaUrl(data.favicon ?? ""),
      social: data.social ?? {},
      homeSections: mergeHomeSections(data.homeSections),
      homeSectionOrder: normalizeHomeSectionOrder(data.homeSectionOrder),
      heroTemplate: normalizeHeroTemplateId(data.heroTemplate),
      heroAutoplayDelay: normalizeHeroAutoplayDelay(data.heroAutoplayDelay),
    };
  } catch {
    return null;
  }
}
