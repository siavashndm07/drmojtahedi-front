/**
 * Compact primary nav (5 items) with categorized mega-menu groups.
 */
import type { NavIconName } from "@/components/icons/navIcons";

export type NavChild = {
  label: string;
  href: string;
  description?: string;
  icon?: NavIconName;
};

export type NavGroup = {
  title: string;
  items: NavChild[];
};

export type NavFeatured = {
  title: string;
  description: string;
  href: string;
  cta?: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: NavIconName;
  /** Categorized columns for mega-menu / mobile accordion */
  groups?: NavGroup[];
  /** Optional highlight card in desktop mega-menu */
  featured?: NavFeatured;
};

/** Flat list of all child links (search, breadcrumbs helpers, etc.) */
export function flattenNavGroups(item: NavItem): NavChild[] {
  return item.groups?.flatMap((group) => group.items) ?? [];
}

export const primaryNavigation: NavItem[] = [
  { label: "خانه", href: "/", icon: "home" },
  {
    label: "دکتر مجتهدی",
    href: "/about",
    icon: "person",
    featured: {
      title: "زندگی و میراث",
      description: "از لاهیجان تا البرز و شریف — روایت مستند زندگی دکتر مجتهدی.",
      href: "/about/biography",
      cta: "خواندن زندگی‌نامه",
    },
    groups: [
      {
        title: "زندگی و میراث",
        items: [
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
        ],
      },
      {
        title: "بنیاد",
        items: [
          {
            label: "معرفی بنیاد",
            href: "/foundation",
            description: "مأموریت و هویت",
            icon: "foundation",
          },
          {
            label: "اساس‌نامه",
            href: "/foundation/charter",
            description: "اسناد نهادی",
            icon: "charter",
          },
          {
            label: "ارکان بنیاد",
            href: "/foundation/organs",
            description: "هیئت‌ها و اعضا",
            icon: "organs",
          },
        ],
      },
      {
        title: "شبکهٔ میراث",
        items: [
          {
            label: "شاگردان",
            href: "/heritage/students",
            description: "دانش‌آموختگان مرتبط",
            icon: "students",
          },
          { label: "افراد", href: "/heritage/people", description: "شبکهٔ افراد", icon: "people" },
          {
            label: "مکان‌ها",
            href: "/heritage/places",
            description: "جغرافیای میراث",
            icon: "places",
          },
          {
            label: "نهادها",
            href: "/heritage/institutions",
            description: "مؤسسات مرتبط",
            icon: "institutions",
          },
        ],
      },
    ],
  },
  {
    label: "موزه و مجموعه",
    href: "/museum",
    icon: "museum",
    featured: {
      title: "مجموعهٔ فرهنگی",
      description: "موزه، پارک، آمفی‌تئاتر و فضاهای آموزشی در یک چشم‌انداز.",
      href: "/complex",
      cta: "مشاهده مجموعه",
    },
    groups: [
      {
        title: "موزه",
        items: [
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
          { label: "راهنمای بازدید", href: "/visit", description: "ساعات و دسترسی", icon: "visit" },
        ],
      },
      {
        title: "فضا و ساخت",
        items: [
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
        ],
      },
    ],
  },
  {
    label: "برنامه‌ها",
    href: "/events",
    icon: "events",
    featured: {
      title: "تقویم فرهنگی",
      description: "رویدادهای پیش‌رو و گذشتهٔ بنیاد را دنبال کنید.",
      href: "/events",
      cta: "مشاهده رویدادها",
    },
    groups: [
      {
        title: "رویداد و خبر",
        items: [
          { label: "رویدادها", href: "/events", description: "تقویم فرهنگی", icon: "events" },
          { label: "اخبار", href: "/news", description: "تازه‌های بنیاد", icon: "news" },
          {
            label: "پروژه‌های بنیاد",
            href: "/projects",
            description: "طرح‌های در حال اجرا",
            icon: "projects",
          },
          {
            label: "خاطرات",
            href: "/memories",
            description: "روایت بازدیدکنندگان",
            icon: "memories",
          },
        ],
      },
      {
        title: "آموزش",
        items: [
          {
            label: "آموزش",
            href: "/education",
            description: "برنامه‌های یادگیری",
            icon: "education",
          },
          {
            label: "ارزیابی مدیران",
            href: "/education/assessment",
            description: "مرکز ارزیابی",
            icon: "assessment",
          },
          {
            label: "دوره‌ها",
            href: "/education/courses",
            description: "مسیرهای آموزشی",
            icon: "courses",
          },
          {
            label: "کارگاه‌ها",
            href: "/education/workshops",
            description: "تجربهٔ تعاملی",
            icon: "workshops",
          },
        ],
      },
      {
        title: "همراهی",
        items: [
          {
            label: "همکاری",
            href: "/collaborate",
            description: "داوطلبی و شراکت",
            icon: "collaborate",
          },
          { label: "حمایت", href: "/support", description: "راه‌های حمایت", icon: "support" },
          { label: "حامیان", href: "/sponsors", description: "سپاس از همراهان", icon: "sponsors" },
          {
            label: "عضویت",
            href: "/account/membership",
            description: "ثبت‌نام در بنیاد",
            icon: "person",
          },
        ],
      },
    ],
  },
  {
    label: "منابع",
    href: "/archive",
    icon: "archive",
    featured: {
      title: "آرشیو دیجیتال",
      description: "اسناد، عکس، صوت، ویدئو و تاریخ شفاهی در یک درگاه.",
      href: "/archive",
      cta: "ورود به آرشیو",
    },
    groups: [
      {
        title: "آرشیو رسانه‌ای",
        items: [
          { label: "آرشیو", href: "/archive", description: "همه رسانه‌ها", icon: "archive" },
          { label: "گالری", href: "/gallery", description: "تصاویر و ویدئو", icon: "gallery" },
          {
            label: "اسناد",
            href: "/archive/documents",
            description: "متن و گواهی",
            icon: "documents",
          },
          {
            label: "عکس‌ها",
            href: "/archive/photographs",
            description: "آرشیو تصویری",
            icon: "photos",
          },
          { label: "صوتی", href: "/archive/audio", description: "روایت شنیداری", icon: "audio" },
          { label: "تصویری", href: "/archive/video", description: "فیلم و مستند", icon: "video" },
        ],
      },
      {
        title: "پژوهش و نشر",
        items: [
          {
            label: "تاریخ شفاهی",
            href: "/oral-history",
            description: "مصاحبه‌ها",
            icon: "oralHistory",
          },
          { label: "کتابخانه", href: "/library", description: "منابع پژوهشی", icon: "library" },
          {
            label: "کتاب‌ها",
            href: "/library/books",
            description: "انتشارات بنیاد",
            icon: "books",
          },
          { label: "مجله", href: "/magazine", description: "مقالات تحریری", icon: "magazine" },
          { label: "اخبار", href: "/news", description: "تازه‌های بنیاد", icon: "news" },
        ],
      },
    ],
  },
];

export const utilityNavigation: NavChild[] = [
  { label: "جستجو", href: "/search", icon: "search" },
  { label: "حامیان", href: "/sponsors", icon: "sponsors" },
  { label: "حمایت از مجموعه", href: "/support", icon: "support" },
  { label: "عضویت", href: "/account/membership", icon: "person" },
  { label: "تماس", href: "/contact", icon: "contact" },
  { label: "درباره ما", href: "/about", icon: "about" },
];

export const futureNavigation: NavChild[] = [
  { label: "بلیط", href: "/tickets", icon: "events" },
  { label: "موزه مجازی", href: "/virtual-museum", icon: "museum" },
  { label: "تور ۳۶۰ درجه", href: "/virtual-tour", icon: "facilities" },
  { label: "دستیار هوشمند", href: "/ai", icon: "sparkles" },
  { label: "کاوش دانش", href: "/explore", icon: "timeline" },
];

export const footerColumns = [
  {
    title: "میراث و بنیاد",
    icon: "heritage" as NavIconName,
    links: [
      { label: "زندگی‌نامه", href: "/about/biography", icon: "biography" as NavIconName },
      { label: "خط زمان", href: "/about/timeline", icon: "timeline" as NavIconName },
      { label: "معرفی بنیاد", href: "/foundation", icon: "foundation" as NavIconName },
      { label: "ارکان بنیاد", href: "/foundation/organs", icon: "organs" as NavIconName },
      { label: "شاگردان", href: "/heritage/students", icon: "students" as NavIconName },
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
      { label: "پروژه‌ها", href: "/projects", icon: "projects" as NavIconName },
      { label: "ارزیابی مدیران", href: "/education/assessment", icon: "assessment" as NavIconName },
      { label: "همکاری", href: "/collaborate", icon: "collaborate" as NavIconName },
      { label: "گالری", href: "/gallery", icon: "gallery" as NavIconName },
      { label: "کتاب‌ها", href: "/library/books", icon: "books" as NavIconName },
    ],
  },
  {
    title: "حمایت و بازدید",
    icon: "support" as NavIconName,
    links: [
      { label: "حامیان", href: "/sponsors", icon: "sponsors" as NavIconName },
      { label: "حمایت", href: "/support", icon: "support" as NavIconName },
      { label: "عضویت", href: "/account/membership", icon: "person" as NavIconName },
      { label: "راهنمای بازدید", href: "/visit", icon: "visit" as NavIconName },
      { label: "تماس", href: "/contact", icon: "contact" as NavIconName },
    ],
  },
] as const;
