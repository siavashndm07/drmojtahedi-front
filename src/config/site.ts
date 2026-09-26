export const siteConfig = {
  name: "بنیاد فرهنگی دکتر مجتهدی",
  shortName: "دکتر مجتهدی",
  legalName: "موسسه فرهنگی هنری بنیاد دکترمحمدعلی مجتهدی گیلانی",
  personName: "محمدعلی مجتهدی گیلانی",
  personTitle: "دکتر محمدعلی مجتهدی گیلانی",
  personRoles: [
    "معلم و رئیس دبیرستان البرز",
    "بنیان‌گذار دانشگاه صنعتی شریف",
    "استاد دانشکدهٔ فنی دانشگاه تهران",
  ] as const,
  birthYear: "۱۲۸۷",
  deathYear: "۱۳۷۶",
  tagline: "به مملکت‌تان خدمت کنید",
  description:
    "پلتفرم دیجیتال میراث دکتر محمدعلی مجتهدی گیلانی — معلم البرز، بنیان‌گذار دانشگاه صنعتی شریف؛ آرشیو، موزه، آموزش و رویدادها.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  locale: "fa_IR",
  language: "fa",
  direction: "rtl" as const,
  email: "info@drmojtahedi.com",
  emailAlt: "mhm4255@gmail.com",
  phone: "02122769571",
  mobile: "09122964459",
  fax: "02128421963",
  address:
    "تهران، خیابان شهید کلاهدوز (دولت)، چهارراه قنات، خیابان شهید برادران رحمانی، شماره ۱۳",
  postalCode: "1951733164",
  registrationNumber: "36982",
  nationalId: "14005292410",
  social: {
    telegram: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
