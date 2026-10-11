/**
 * Primary nav aligned to legacy drmojtahedi.com IA
 * (no museum / tickets / complex / education).
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
  groups?: NavGroup[];
  featured?: NavFeatured;
};

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
        title: "منابع",
        items: [
          {
            label: "شاگردان",
            href: "/heritage/students",
            description: "دانش‌آموختگان مرتبط",
            icon: "students",
          },
          {
            label: "کتاب‌ها",
            href: "/library/books",
            description: "انتشارات بنیاد",
            icon: "books",
          },
          { label: "مقالات", href: "/magazine", description: "مقالات تحریری", icon: "magazine" },
          { label: "اخبار", href: "/news", description: "تازه‌های بنیاد", icon: "news" },
        ],
      },
    ],
  },
  {
    label: "پروژه‌ها",
    href: "/projects",
    icon: "projects",
  },
  {
    label: "گالری",
    href: "/gallery",
    icon: "gallery",
    featured: {
      title: "آرشیو دیداری",
      description: "تصاویر و ویدئوهای مرتبط با بنیاد و میراث دکتر مجتهدی.",
      href: "/gallery",
      cta: "ورود به گالری",
    },
    groups: [
      {
        title: "رسانه",
        items: [
          {
            label: "گالری تصاویر",
            href: "/archive/photographs",
            description: "عکس‌ها و آثار",
            icon: "photos",
          },
          {
            label: "گالری ویدئو",
            href: "/archive/video",
            description: "فیلم و مستند",
            icon: "video",
          },
          { label: "آرشیو", href: "/archive", description: "همه رسانه‌ها", icon: "archive" },
        ],
      },
    ],
  },
  {
    label: "همکاری",
    href: "/collaborate",
    icon: "collaborate",
  },
  {
    label: "عضویت",
    href: "/account/membership",
    icon: "person",
  },
];

export const utilityNavigation: NavChild[] = [
  { label: "جستجو", href: "/search", icon: "search" },
  { label: "حامیان", href: "/sponsors", icon: "sponsors" },
  { label: "حمایت", href: "/support", icon: "support" },
  { label: "کمک مالی", href: "/donate", icon: "support" },
  { label: "تماس", href: "/contact", icon: "contact" },
];

export const footerColumns = [
  {
    title: "دکتر مجتهدی",
    icon: "person" as NavIconName,
    links: [
      { label: "زندگی‌نامه", href: "/about/biography", icon: "biography" as NavIconName },
      { label: "خط زمان", href: "/about/timeline", icon: "timeline" as NavIconName },
      { label: "معرفی بنیاد", href: "/foundation", icon: "foundation" as NavIconName },
      { label: "ارکان بنیاد", href: "/foundation/organs", icon: "organs" as NavIconName },
      { label: "شاگردان", href: "/heritage/students", icon: "students" as NavIconName },
    ],
  },
  {
    title: "محتوا",
    icon: "news" as NavIconName,
    links: [
      { label: "اخبار", href: "/news", icon: "news" as NavIconName },
      { label: "مقالات", href: "/magazine", icon: "magazine" as NavIconName },
      { label: "کتاب‌ها", href: "/library/books", icon: "books" as NavIconName },
      { label: "پروژه‌ها", href: "/projects", icon: "projects" as NavIconName },
    ],
  },
  {
    title: "گالری",
    icon: "gallery" as NavIconName,
    links: [
      { label: "گالری", href: "/gallery", icon: "gallery" as NavIconName },
      { label: "تصاویر", href: "/archive/photographs", icon: "photos" as NavIconName },
      { label: "ویدئو", href: "/archive/video", icon: "video" as NavIconName },
    ],
  },
  {
    title: "همراهی",
    icon: "support" as NavIconName,
    links: [
      { label: "همکاری", href: "/collaborate", icon: "collaborate" as NavIconName },
      { label: "حمایت", href: "/support", icon: "support" as NavIconName },
      { label: "کمک مالی", href: "/donate", icon: "support" as NavIconName },
      { label: "حامیان", href: "/sponsors", icon: "sponsors" as NavIconName },
      { label: "عضویت", href: "/account/membership", icon: "person" as NavIconName },
      { label: "تماس", href: "/contact", icon: "contact" as NavIconName },
    ],
  },
] as const;
