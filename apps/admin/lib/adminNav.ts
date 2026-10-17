import {
  Archive,
  BookMarked,
  BookOpen,
  Bot,
  Building2,
  Clock,
  CreditCard,
  FolderOpen,
  Goal,
  HandHeart,
  HeartHandshake,
  ImageIcon,
  Images,
  Landmark,
  LayoutDashboard,
  Link2,
  Mail,
  MapPin,
  Mic,
  Newspaper,
  Settings,
  Shield,
  Tags,
  UserCog,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavLeaf = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Extra search terms (Persian / Latin aliases). */
  keywords?: string[];
};

export type NavGroup = {
  key: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  children: NavLeaf[];
};

export type NavItem =
  | {
      kind: "link";
      key: string;
      label: string;
      href: string;
      icon: LucideIcon;
      keywords?: string[];
    }
  | {
      kind: "group";
      key: string;
      label: string;
      icon: LucideIcon;
      description?: string;
      children: NavLeaf[];
    };

/**
 * Flat 2-level IA: one link or one group of related leaves.
 * Grouped by how editors actually work day-to-day.
 */
export const ADMIN_MENU: NavItem[] = [
  {
    kind: "link",
    key: "dashboard",
    label: "داشبورد",
    href: "/",
    icon: LayoutDashboard,
    keywords: ["خانه", "خلاصه", "home"],
  },
  {
    kind: "group",
    key: "content-group",
    label: "محتوا و انتشارات",
    icon: Newspaper,
    description: "اخبار، مجله و کتاب",
    children: [
      {
        key: "news",
        label: "اخبار",
        href: "/news",
        icon: Newspaper,
        keywords: ["خبر", "news"],
      },
      {
        key: "news-categories",
        label: "دسته‌بندی اخبار",
        href: "/news/categories",
        icon: Tags,
        keywords: ["دسته", "category"],
      },
      {
        key: "articles",
        label: "مقالات",
        href: "/articles",
        icon: BookMarked,
        keywords: ["مجله", "مقاله", "article"],
      },
      {
        key: "articles-categories",
        label: "دسته‌بندی مقالات",
        href: "/articles/categories",
        icon: Tags,
      },
      {
        key: "books",
        label: "کتاب‌ها",
        href: "/books",
        icon: BookOpen,
        keywords: ["کتابخانه", "book"],
      },
    ],
  },
  {
    kind: "group",
    key: "heritage-group",
    label: "میراث فرهنگی",
    icon: Landmark,
    description: "افراد، مکان و خط زمان",
    children: [
      {
        key: "people",
        label: "افراد",
        href: "/people",
        icon: Users,
        keywords: ["شخصیت", "people"],
      },
      {
        key: "places",
        label: "مکان‌ها",
        href: "/places",
        icon: MapPin,
        keywords: ["جغرافیا", "place"],
      },
      {
        key: "timeline",
        label: "خط زمان",
        href: "/timeline",
        icon: Clock,
        keywords: ["گاه‌شمار", "timeline"],
      },
    ],
  },
  {
    kind: "group",
    key: "archive-group",
    label: "آرشیو و رسانه",
    icon: Archive,
    description: "اسناد، تاریخ شفاهی و فایل‌ها",
    children: [
      {
        key: "archive",
        label: "آیتم‌های آرشیو",
        href: "/archive",
        icon: FolderOpen,
        keywords: ["سند", "archive"],
      },
      {
        key: "oral-history",
        label: "تاریخ شفاهی",
        href: "/oral-history",
        icon: Mic,
        keywords: ["مصاحبه", "oral"],
      },
      {
        key: "galleries",
        label: "گالری",
        href: "/galleries",
        icon: Images,
        keywords: ["تصویر", "ویدئو", "آلبوم", "همایش", "gallery", "video"],
      },
      {
        key: "media",
        label: "کتابخانه رسانه",
        href: "/media",
        icon: ImageIcon,
        keywords: ["تصویر", "ویدیو", "media", "upload"],
      },
    ],
  },
  {
    kind: "group",
    key: "foundation-group",
    label: "بنیاد",
    icon: Building2,
    description: "پروژه، حامی و معرفی",
    children: [
      {
        key: "projects",
        label: "پروژه‌ها",
        href: "/projects",
        icon: Building2,
        keywords: ["طرح", "project"],
      },
      {
        key: "sponsors",
        label: "حامیان",
        href: "/sponsors",
        icon: HeartHandshake,
        keywords: ["اسپانسر", "sponsor"],
      },
      {
        key: "organs",
        label: "ارکان",
        href: "/organs",
        icon: Landmark,
        keywords: ["هیئت", "organ"],
      },
      {
        key: "useful-links",
        label: "پیوندهای مفید",
        href: "/useful-links",
        icon: Link2,
        keywords: ["لینک", "links"],
      },
    ],
  },
  {
    kind: "group",
    key: "donations-group",
    label: "کمک‌های خیرخواهانه",
    icon: HandHeart,
    description: "ثبت کمک و اهداف",
    children: [
      {
        key: "donations",
        label: "کمک‌ها",
        href: "/donations",
        icon: HandHeart,
        keywords: ["اهدا", "donate", "donation"],
      },
      {
        key: "donation-goals",
        label: "اهداف کمک",
        href: "/donation-goals",
        icon: Goal,
        keywords: ["هدف", "goal"],
      },
    ],
  },
  {
    kind: "group",
    key: "members-group",
    label: "اعضا و عضویت",
    icon: UserRound,
    description: "اعضا، ارکان عضویت و حق‌عضویت",
    children: [
      {
        key: "members",
        label: "اعضا",
        href: "/members",
        icon: UserRound,
        keywords: ["عضو", "member"],
      },
      {
        key: "membership-tiers",
        label: "انواع عضویت",
        href: "/membership-tiers",
        icon: Users,
        keywords: ["ارکان", "tier"],
      },
      {
        key: "membership-fees",
        label: "حق عضویت",
        href: "/membership-fees",
        icon: Wallet,
        keywords: ["شهریه", "fee", "پرداخت"],
      },
      {
        key: "newsletter",
        label: "خبرنامه",
        href: "/newsletter",
        icon: Mail,
        keywords: ["ایمیل", "newsletter"],
      },
      {
        key: "contributions",
        label: "ارسال خاطره",
        href: "/contributions",
        icon: BookMarked,
        keywords: ["خاطره", "contribution"],
      },
    ],
  },
  {
    kind: "group",
    key: "settings-group",
    label: "تنظیمات و سیستم",
    icon: Settings,
    description: "سایت، پرداخت و دسترسی",
    children: [
      {
        key: "settings",
        label: "تنظیمات سایت",
        href: "/settings",
        icon: Settings,
        keywords: ["برند", "بنر", "homepage", "site"],
      },
      {
        key: "settings-payments",
        label: "پرداخت و پیام کمک",
        href: "/settings/payments",
        icon: CreditCard,
        keywords: ["درگاه", "zarinpal", "payment", "پیام"],
      },
      {
        key: "settings-staff",
        label: "کاربران پنل",
        href: "/settings/staff",
        icon: Shield,
        keywords: ["ادمین", "دسترسی", "staff"],
      },
      {
        key: "ai",
        label: "دستیار هوشمند",
        href: "/ai",
        icon: Bot,
        keywords: ["ai", "چت", "assistant"],
      },
      {
        key: "account",
        label: "حساب من",
        href: "/account",
        icon: UserCog,
        keywords: ["رمز", "پروفایل", "account"],
      },
    ],
  },
];

export function collectNavLeaves(items: NavItem[] = ADMIN_MENU): NavLeaf[] {
  const leaves: NavLeaf[] = [];
  for (const item of items) {
    if (item.kind === "link") {
      leaves.push(item);
    } else {
      leaves.push(...item.children);
    }
  }
  return leaves;
}

export function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function resolveActiveNavKey(pathname: string): string {
  const matches: { key: string; href: string }[] = [];
  for (const leaf of collectNavLeaves()) {
    if (pathMatches(pathname, leaf.href)) {
      matches.push({ key: leaf.key, href: leaf.href });
    }
  }
  matches.sort((a, b) => b.href.length - a.href.length);
  return matches[0]?.key ?? "dashboard";
}

export function normalizeMenuSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "");
}

function leafMatchesQuery(leaf: NavLeaf, q: string) {
  const haystack = normalizeMenuSearch(
    [leaf.label, leaf.href, ...(leaf.keywords ?? [])].join(" "),
  );
  return haystack.includes(q);
}

export function filterAdminMenu(items: NavItem[], query: string): NavItem[] {
  const q = normalizeMenuSearch(query);
  if (!q) return items;

  return items.flatMap((item) => {
    if (item.kind === "link") {
      return leafMatchesQuery(item, q) ||
        normalizeMenuSearch(item.label).includes(q)
        ? [item]
        : [];
    }
    const labelHit = normalizeMenuSearch(
      [item.label, item.description ?? ""].join(" "),
    ).includes(q);
    const children = item.children.filter((leaf) => leafMatchesQuery(leaf, q));
    if (labelHit) return [item];
    if (children.length) return [{ ...item, children }];
    return [];
  });
}
