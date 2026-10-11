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
    image: "/images/slider/9fd24160-ae8d-4841-b0c4-12c000e62972.png",
    mobileImage: "/images/slider/9fd24160-ae8d-4841-b0c4-12c000e62972.png",
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
    image: "/images/slider/6a74e3ea-8000-4b0b-898a-f1c53f2b233d.png",
    mobileImage: "/images/slider/6a74e3ea-8000-4b0b-898a-f1c53f2b233d.png",
    imageAlt: "نماد دبیرستان البرز · تصویر مفهومی",
    tone: "ink",
    isConceptual: true,
  },
];
