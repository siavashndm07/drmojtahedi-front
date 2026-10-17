import { cache } from "react";
import {
  DEFAULT_BRAND_PALETTE_ID,
  DEFAULT_HOME_SECTION_ORDER,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_SITE_BANNER,
  mergeBrandColors,
  mergeHomeSections,
  mergeSiteBanner,
  normalizeHomeSectionOrder,
  type BrandColors,
  type HomeSectionKey,
  type HomeSections,
  type SiteBanner,
} from "@drmojtahedi/shared";
import { siteConfig } from "@/config/site";
import { fetchPublicSiteSettings, type PublicSiteSettings } from "@/lib/api/siteSettings";
import {
  DEFAULT_HERO_AUTOPLAY_DELAY_MS,
  DEFAULT_HERO_TEMPLATE,
  type HeroTemplateId,
} from "@/lib/hero/templates";

export type ResolvedSiteSettings = {
  nameFa: string;
  nameEn: string;
  tagline: string;
  taglineFa: string;
  brandPaletteId: string;
  brandColors: BrandColors;
  siteBanner: SiteBanner;
  logo: string;
  logoDark: string;
  favicon: string;
  url: string;
  email: string;
  phone: string;
  phoneSecondary: string;
  address: string;
  social: Partial<Record<string, string>>;
  heroTemplate: HeroTemplateId;
  heroAutoplayDelay: number;
  homeSections: HomeSections;
  homeSectionOrder: HomeSectionKey[];
};

/** Static fallbacks when API is unavailable (also used by client default context). */
export const siteSettings: ResolvedSiteSettings = {
  nameFa: siteConfig.name,
  nameEn: "Dr. Mojtahedi Foundation",
  tagline: siteConfig.tagline,
  taglineFa: siteConfig.tagline,
  brandPaletteId: DEFAULT_BRAND_PALETTE_ID,
  brandColors: mergeBrandColors(null),
  siteBanner: { ...DEFAULT_SITE_BANNER },
  logo: "",
  logoDark: "",
  favicon: "",
  url: siteConfig.url,
  email: siteConfig.email,
  phone: siteConfig.phone,
  phoneSecondary: siteConfig.mobile,
  address: siteConfig.address,
  social: { ...siteConfig.social },
  heroTemplate: DEFAULT_HERO_TEMPLATE,
  heroAutoplayDelay: DEFAULT_HERO_AUTOPLAY_DELAY_MS,
  homeSections: { ...DEFAULT_HOME_SECTIONS },
  homeSectionOrder: [...DEFAULT_HOME_SECTION_ORDER],
};

export function resolveSiteSettings(
  remote: PublicSiteSettings | null | undefined,
): ResolvedSiteSettings {
  const base = siteSettings;
  if (!remote) return base;

  const tagline =
    remote.taglineFa?.trim() ||
    remote.tagline?.trim() ||
    base.tagline;

  return {
    ...base,
    nameFa: remote.nameFa?.trim() || base.nameFa,
    nameEn: remote.nameEn?.trim() || base.nameEn,
    tagline,
    taglineFa: remote.taglineFa?.trim() || remote.tagline?.trim() || base.taglineFa,
    brandColors: mergeBrandColors(remote.brandColors ?? base.brandColors),
    siteBanner: mergeSiteBanner(remote.siteBanner ?? base.siteBanner),
    logo: remote.logo?.trim() || base.logo,
    logoDark: remote.logoDark?.trim() || base.logoDark,
    favicon: remote.favicon?.trim() || base.favicon,
    url: remote.url?.trim() || base.url,
    email: remote.email?.trim() || base.email,
    phone: remote.phone?.trim() || base.phone,
    phoneSecondary: remote.phoneSecondary?.trim() || base.phoneSecondary,
    address: remote.address?.trim() || base.address,
    social: {
      ...base.social,
      ...(remote.social ?? {}),
    },
    homeSections: mergeHomeSections(remote.homeSections ?? base.homeSections),
    homeSectionOrder: normalizeHomeSectionOrder(
      remote.homeSectionOrder ?? base.homeSectionOrder,
    ),
  };
}

export const loadSiteSettings = cache(async function loadSiteSettings(): Promise<ResolvedSiteSettings> {
  const remote = await fetchPublicSiteSettings();
  return resolveSiteSettings(remote);
});
