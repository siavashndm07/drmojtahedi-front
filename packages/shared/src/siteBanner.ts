export type SiteBannerMode = "text" | "image";

export type SiteBanner = {
  enabled: boolean;
  mode: SiteBannerMode;
  message: string;
  imageUrl: string;
  imageId: string;
  link: string;
  linkLabel: string;
};

export const DEFAULT_SITE_BANNER: SiteBanner = {
  enabled: false,
  mode: "text",
  message: "",
  imageUrl: "",
  imageId: "",
  link: "",
  linkLabel: "اطلاعات بیشتر",
};

export function mergeSiteBanner(raw?: Partial<SiteBanner> | null): SiteBanner {
  const base = { ...DEFAULT_SITE_BANNER };
  if (!raw || typeof raw !== "object") return base;
  return {
    enabled: Boolean(raw.enabled),
    mode: raw.mode === "image" ? "image" : "text",
    message: String(raw.message ?? ""),
    imageUrl: String(raw.imageUrl ?? ""),
    imageId: String(raw.imageId ?? ""),
    link: String(raw.link ?? ""),
    linkLabel: String(raw.linkLabel ?? DEFAULT_SITE_BANNER.linkLabel),
  };
}
