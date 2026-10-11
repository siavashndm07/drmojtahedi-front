/**
 * Re-export brand color system from shared (admin + site).
 */
export {
  BRAND_COLOR_KEYS,
  BRAND_COLOR_PALETTES,
  BRAND_PALETTE_COLOR_KEYS,
  DEFAULT_BODY_BACKGROUND,
  DEFAULT_BRAND_COLORS,
  DEFAULT_BRAND_PALETTE_ID,
  DEFAULT_DARK_BRAND_COLORS,
  bodyBackgroundCssValue,
  brandColorsScopeCss,
  buildBrandThemeCss,
  deriveDarkBrandColors,
  getBrandPalette,
  hexToRgbTriplet,
  isSameBrandColors,
  mergeBodyBackground,
  mergeBrandColors,
  normalizeHex,
  resolveBrandColorsFromPalette,
  type BodyBackground,
  type BodyBackgroundMode,
  type BrandColorKey,
  type BrandColorPalette,
  type BrandColors,
} from "@drmojtahedi/shared";
