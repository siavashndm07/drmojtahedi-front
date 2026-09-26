export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Primary / desktop visual */
  image: string;
  /** Secondary / mobile visual (or stacked companion image) */
  mobileImage?: string;
  imageAlt: string;
  tone: "pine" | "ink" | "bronze";
  isConceptual?: boolean;
};

/**
 * Hero slides — copy grounded in Dr. Mojtahedi's documented roles.
 * Images remain conceptual until archival photography is ready.
 */
export const mockHeroSlides: HeroSlide[] = [
  {
    id: "hero-legacy",
    eyebrow: "بنیاد فرهنگی دکتر مجتهدی",
    title: "دکتر محمدعلی مجتهدی گیلانی",
    subtitle: "معلم دبیرستان البرز · بنیان‌گذار دانشگاه صنعتی شریف",
    description:
      "استاد دانشکدهٔ فنی دانشگاه تهران، رئیس ده‌هاسالهٔ البرز، و بنیان‌گذار دانشگاهی که امروز شریف نام دارد — میراث یک عمر آموزش و انسان‌سازی.",
    ctaLabel: "زندگی‌نامه",
    ctaHref: "/about/biography",
    secondaryCtaLabel: "خط زمان",
    secondaryCtaHref: "/about/timeline",
    image: "/images/header.png",
    mobileImage: "/images/header.png",
    imageAlt: "لوگوی بنیاد فرهنگی دکتر مجتهدی",
    tone: "pine",
    isConceptual: true,
  },
  {
    id: "hero-alborz",
    eyebrow: "دبیرستان البرز",
    title: "۳۴ سال ریاست البرز",
    subtitle: "از ۱۳۲۳ تا ۱۳۵۷ — مدرسهٔ مرجع نسل نخبگان",
    description:
      "مجتهدی البرز را به یکی از برجسته‌ترین دبیرستان‌های ایران بدل کرد؛ انضباط علمی و پرورش شخصیت، امضای مدیریت او بود.",
    ctaLabel: "بیشتر بدانید",
    ctaHref: "/about/biography",
    secondaryCtaLabel: "میراث آموزشی",
    secondaryCtaHref: "/about/legacy",
    image: "/images/header.png",
    mobileImage: "/images/header.png",
    imageAlt: "نماد دبیرستان البرز · تصویر مفهومی",
    tone: "ink",
    isConceptual: true,
  },
  {
    id: "hero-sharif",
    eyebrow: "دانشگاه صنعتی شریف",
    title: "بنیان‌گذار دانشگاه شریف",
    subtitle: "دانشگاه صنعتی آریامهر · ۱۳۴۴–۱۳۴۵",
    description:
      "در آبان ۱۳۴۴ مأمور تأسیس شد و در مهر ۱۳۴۵ دانشگاه را راه‌اندازی کرد — نخستین نایب‌التولیهٔ آنچه امروز شریف است.",
    ctaLabel: "خط زمان نهادها",
    ctaHref: "/about/timeline",
    secondaryCtaLabel: "مقالهٔ بنیان‌گذاری",
    secondaryCtaHref: "/magazine/bonyangozari-sharif",
    image: "/images/header.png",
    mobileImage: "/images/header.png",
    imageAlt: "نماد دانشگاه شریف · تصویر مفهومی",
    tone: "bronze",
    isConceptual: true,
  },
  {
    id: "hero-archive",
    eyebrow: "آرشیو و موزه",
    title: "اسناد، خاطرات و روایت شفاهی",
    subtitle: "از خاطرات چاپ‌شده تا مجموعهٔ در حال شکل‌گیری",
    description:
      "خاطرات، مصاحبه‌های تاریخ شفاهی و اسناد مرتبط با البرز و شریف — دروازهٔ پژوهش برای نسل جدید.",
    ctaLabel: "ورود به آرشیو",
    ctaHref: "/archive",
    secondaryCtaLabel: "تاریخ شفاهی",
    secondaryCtaHref: "/oral-history",
    image: "/images/header.png",
    mobileImage: "/images/header.png",
    imageAlt: "آرشیو دیجیتال · تصویر مفهومی",
    tone: "pine",
    isConceptual: true,
  },
];
