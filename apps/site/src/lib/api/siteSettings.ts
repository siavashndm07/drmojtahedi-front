import { mergeBrandColors, mergeSiteBanner, type BrandColors, type SiteBanner } from "@drmojtahedi/shared";
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
    };
  } catch {
    return null;
  }
}
