import {
  DEFAULT_BRAND_PALETTE_ID,
  type BrandColors,
} from "@/lib/brand/colors";
import {
  DEFAULT_HERO_AUTOPLAY_DELAY_MS,
  DEFAULT_HERO_TEMPLATE,
  type HeroTemplateId,
} from "@/lib/hero/templates";

/**
 * Site-level UI settings (mock until Django / admin API).
 *
 * Admin panel (future, like SensibleCool):
 * - `brandPaletteId` → pick from BRAND_COLOR_PALETTES
 * - `brandColors` → optional per-token override
 * - `heroTemplate` → fullBleed | splitText | minimalCta
 */
export const siteSettings = {
  /** Active brand palette — default SensibleCool mint. */
  brandPaletteId: DEFAULT_BRAND_PALETTE_ID,
  /** Optional custom hex overrides (from admin color picker). */
  brandColors: null as Partial<BrandColors> | null,

  heroTemplate: DEFAULT_HERO_TEMPLATE as HeroTemplateId,
  heroAutoplayDelay: DEFAULT_HERO_AUTOPLAY_DELAY_MS,
};
