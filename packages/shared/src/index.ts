export const brand = {
  nameFa: "بنیاد فرهنگی دکتر مجتهدی",
  nameEn: "Dr. Mojtahedi Foundation",
  shortName: "دکتر مجتهدی",
  tagline: "به مملکت‌تان خدمت کنید",
} as const;

export const ports = {
  site: 3000,
  admin: 3001,
  api: 8000,
} as const;

export const ADMIN_STORAGE_KEYS = {
  token: "drmojtahedi-admin-token",
  refresh: "drmojtahedi-admin-refresh",
} as const;

export * from "./brandColors";
export * from "./siteBanner";
