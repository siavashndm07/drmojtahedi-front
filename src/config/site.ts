export const siteConfig = {
  name: "بنیاد فرهنگی دکتر مجتهدی",
  shortName: "دکتر مجتهدی",
  personName: "محمدعلی مجتهدی گیلانی",
  personTitle: "دکتر محمدعلی مجتهدی گیلانی",
  personRoles: [
    "معلم و رئیس دبیرستان البرز",
    "بنیان‌گذار دانشگاه صنعتی شریف",
    "استاد دانشکدهٔ فنی دانشگاه تهران",
  ] as const,
  birthYear: "۱۲۸۷",
  deathYear: "۱۳۷۶",
  description:
    "پلتفرم دیجیتال میراث دکتر محمدعلی مجتهدی گیلانی — معلم البرز، بنیان‌گذار دانشگاه صنعتی شریف؛ آرشیو، موزه، آموزش و رویدادها.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  locale: "fa_IR",
  language: "fa",
  direction: "rtl" as const,
  email: "info@example.com",
  phone: null as string | null,
  social: {
    telegram: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
