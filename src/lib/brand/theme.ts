import {
  buildBrandThemeCss,
  resolveBrandColorsFromPalette,
  type BrandColors,
} from "@/lib/brand/colors";

export function brandThemeStyleTag(colors?: Partial<BrandColors> | null): string {
  return buildBrandThemeCss(colors);
}

export function resolveBrandColors(
  paletteId?: string | null,
  override?: Partial<BrandColors> | null,
): BrandColors {
  return resolveBrandColorsFromPalette(paletteId, override);
}
