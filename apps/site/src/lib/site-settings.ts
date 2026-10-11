import {
  DEFAULT_BRAND_PALETTE_ID,
  type BrandColors,
} from "@/lib/brand/colors";
import {
  DEFAULT_HERO_AUTOPLAY_DELAY_MS,
  DEFAULT_HERO_TEMPLATE,
  type HeroTemplateId,
} from "@/lib/hero/templates";
import {
  DEFAULT_SITE_BANNER,
  type SiteBanner,
} from "@drmojtahedi/shared";

/**
 * Site-level UI settings (fallback when API is unavailable).
 *
 * Admin panel:
 * - `brandPaletteId` / `brandColors`
 * - `siteBanner` → top-of-header announcement on all pages
 * - `heroTemplate`
 */
export const siteSettings = {
  /** Active brand palette — default SensibleCool mint. */
  brandPaletteId: DEFAULT_BRAND_PALETTE_ID,
  /** Optional custom hex overrides (from admin color picker). */
  brandColors: null as Partial<BrandColors> | null,
  /** Top announcement banner above the site header. */
  siteBanner: { ...DEFAULT_SITE_BANNER } as SiteBanner,

  heroTemplate: DEFAULT_HERO_TEMPLATE as HeroTemplateId,
  heroAutoplayDelay: DEFAULT_HERO_AUTOPLAY_DELAY_MS,
};
