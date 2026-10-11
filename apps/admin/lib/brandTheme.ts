import { buildBrandThemeCss, mergeBrandColors, type BrandColors } from "@drmojtahedi/shared";

export const BRAND_COLORS_UPDATED_EVENT = "drmojtahedi-brand-colors-updated";

export function applyBrandColorsToDocument(colors?: Partial<BrandColors> | null) {
  if (typeof document === "undefined") return;
  const css = buildBrandThemeCss(colors ?? mergeBrandColors(null));
  let node = document.getElementById("brand-theme") as HTMLStyleElement | null;
  if (!node) {
    node = document.createElement("style");
    node.id = "brand-theme";
    document.head.appendChild(node);
  }
  node.textContent = css;
}

export function notifyBrandColorsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BRAND_COLORS_UPDATED_EVENT));
}
