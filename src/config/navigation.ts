import type { NavIconName } from "@/components/icons/navIcons";

export type NavChild = {
  label: string;
  href: string;
  description?: string;
  icon?: NavIconName;
};

export type NavItem = {
  label: string;
  href: string;
  icon: NavIconName;
  children?: NavChild[];
};

/**
 * Compact primary nav (5 items) so it fits laptop/desktop widths.
 * Nested destinations stay reachable via mega-menu / mobile accordion.
 */
export const primaryNavigation: NavItem[] = [
  { label: "خانه", href: "/", icon: "home" },
  {
    label: "دکتر مجتهدی",
    href: "/about",
    icon: "person",
    children: [
      { label: "درباره", href: "/about", description: "معرفی کوتاه", icon: "about" },
      {
        label: "زندگی‌نامه",
        href: "/about/biography",
        description: "روایت زندگی",
        icon: "biography",
      },
      {
        label: "خط زمان",
        href: "/about/timeline",
        description: "مراحل زندگی",
        icon: "timeline",
      },
      { label: "میراث", href: "/about/legacy", description: "تأثیر و یادگار", icon: "legacy" },
      { label: "افراد", href: "/heritage/people", description: "شبکهٔ افراد", icon: "people" },
      { label: "مکان‌ها", href: "/heritage/places", description: "جغرافیای میراث", icon: "places" },
      {
        label: "نهادها",
        href: "/heritage/institutions",
        description: "مؤسسات مرتبط",
        icon: "institutions",
      },
    ],
  },
  {
    label: "موزه و مجموعه",
    href: "/museum",
    icon: "museum",
    children: [
      { label: "موزه", href: "/museum", description: "معرفی موزه", icon: "museum" },
      {
        label: "مجموعه‌ها",
        href: "/museum/collections",
        description: "اشیاء و اسناد",
        icon: "collections",
      },
      {
        label: "نمایشگاه‌ها",
        href: "/museum/exhibitions",
        description: "جاری و گذشته",
        icon: "exhibitions",
      },
      {
        label: "مجموعه فرهنگی",
        href: "/complex",
        description: "چشم‌انداز فیزیکی",
        icon: "complex",
      },
      { label: "پارک", href: "/complex/park", description: "فضای عمومی", icon: "park" },
      {
        label: "آمفی‌تئاتر",
        href: "/complex/amphitheater",
        description: "رویداد و اجرا",
        icon: "amphitheater",
      },
      {
        label: "پیشرفت ساخت",
        href: "/construction",
        description: "وضعیت پروژه",
        icon: "construction",
      },
      { label: "راهنمای بازدید", href: "/visit", description: "ساعات و دسترسی", icon: "visit" },
    ],
  },
  {
    label: "برنامه‌ها",
    href: "/events",
    icon: "events",
    children: [
      { label: "رویدادها", href: "/events", description: "تقویم فرهنگی", icon: "events" },
      { label: "اخبار", href: "/news", description: "تازه‌های بنیاد", icon: "news" },
      { label: "آموزش", href: "/education", description: "برنامه‌های یادگیری", icon: "education" },
      { label: "دوره‌ها", href: "/education/courses", description: "مسیرهای آموزشی", icon: "courses" },
      {
        label: "کارگاه‌ها",
        href: "/education/workshops",
        description: "تجربهٔ تعاملی",
        icon: "workshops",
      },
      { label: "خاطرات", href: "/memories", description: "روایت بازدیدکنندگان", icon: "memories" },
    ],
  },
  {
    label: "منابع",
    href: "/archive",
    icon: "archive",
    children: [
      { label: "آرشیو", href: "/archive", description: "همه رسانه‌ها", icon: "archive" },
      { label: "اسناد", href: "/archive/documents", description: "متن و گواهی", icon: "documents" },
      { label: "عکس‌ها", href: "/archive/photographs", description: "آرشیو تصویری", icon: "photos" },
      { label: "صوتی", href: "/archive/audio", description: "روایت شنیداری", icon: "audio" },
      { label: "تصویری", href: "/archive/video", description: "فیلم و مستند", icon: "video" },
      {
        label: "تاریخ شفاهی",
        href: "/oral-history",
        description: "مصاحبه‌ها",
        icon: "oralHistory",
      },
      { label: "کتابخانه", href: "/library", description: "منابع پژوهشی", icon: "library" },
      { label: "مجله", href: "/magazine", description: "مقالات تحریری", icon: "magazine" },
      { label: "اخبار", href: "/news", description: "تازه‌های بنیاد", icon: "news" },
    ],
  },
];

export const utilityNavigation: NavChild[] = [
  { label: "جستجو", href: "/search", icon: "search" },
  { label: "حمایت از مجموعه", href: "/support", icon: "support" },
  { label: "تماس", href: "/contact", icon: "contact" },
  { label: "درباره ما", href: "/about", icon: "about" },
];

export const futureNavigation: NavChild[] = [
  { label: "عضویت", href: "/account/membership", icon: "person" },
  { label: "بلیط", href: "/tickets", icon: "events" },
  { label: "موزه مجازی", href: "/virtual-museum", icon: "museum" },
  { label: "تور ۳۶۰ درجه", href: "/virtual-tour", icon: "facilities" },
  { label: "دستیار هوشمند", href: "/ai", icon: "sparkles" },
  { label: "کاوش دانش", href: "/explore", icon: "timeline" },
];

export const footerColumns = [
  {
    title: "میراث",
    icon: "heritage" as NavIconName,
    links: [
      { label: "زندگی‌نامه", href: "/about/biography", icon: "biography" as NavIconName },
      { label: "خط زمان", href: "/about/timeline", icon: "timeline" as NavIconName },
      { label: "افراد", href: "/heritage/people", icon: "people" as NavIconName },
      { label: "آرشیو", href: "/archive", icon: "archive" as NavIconName },
    ],
  },
  {
    title: "موزه و مجموعه",
    icon: "museum" as NavIconName,
    links: [
      { label: "موزه", href: "/museum", icon: "museum" as NavIconName },
      { label: "نمایشگاه‌ها", href: "/museum/exhibitions", icon: "exhibitions" as NavIconName },
      { label: "مجموعه فرهنگی", href: "/complex", icon: "complex" as NavIconName },
      { label: "پیشرفت ساخت", href: "/construction", icon: "construction" as NavIconName },
    ],
  },
  {
    title: "برنامه‌ها",
    icon: "education" as NavIconName,
    links: [
      { label: "رویدادها", href: "/events", icon: "events" as NavIconName },
      { label: "اخبار", href: "/news", icon: "news" as NavIconName },
      { label: "آموزش", href: "/education", icon: "education" as NavIconName },
      { label: "کتابخانه", href: "/library", icon: "library" as NavIconName },
      { label: "مجله", href: "/magazine", icon: "magazine" as NavIconName },
    ],
  },
  {
    title: "حمایت و بازدید",
    icon: "support" as NavIconName,
    links: [
      { label: "راهنمای بازدید", href: "/visit", icon: "visit" as NavIconName },
      { label: "حمایت", href: "/support", icon: "support" as NavIconName },
      { label: "خاطرات", href: "/memories", icon: "memories" as NavIconName },
      { label: "تماس", href: "/contact", icon: "contact" as NavIconName },
    ],
  },
] as const;
