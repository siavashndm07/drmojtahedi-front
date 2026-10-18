export const FOOTER_ICON_IDS = [
  "home",
  "person",
  "biography",
  "timeline",
  "foundation",
  "charter",
  "organs",
  "students",
  "news",
  "magazine",
  "books",
  "projects",
  "gallery",
  "photos",
  "video",
  "collaborate",
  "memories",
  "support",
  "sponsors",
  "contact",
  "search",
  "places",
  "archive",
  "sparkles",
] as const;

export type FooterIconId = (typeof FOOTER_ICON_IDS)[number];

export const FOOTER_ICON_LABELS: Record<FooterIconId, string> = {
  home: "خانه",
  person: "شخص",
  biography: "زندگی‌نامه",
  timeline: "خط زمان",
  foundation: "بنیاد",
  charter: "منشور",
  organs: "ارکان",
  students: "آموزش",
  news: "اخبار",
  magazine: "مقاله",
  books: "کتاب",
  projects: "پروژه",
  gallery: "گالری",
  photos: "تصویر",
  video: "ویدئو",
  collaborate: "همکاری",
  memories: "خاطره",
  support: "حمایت",
  sponsors: "حامیان",
  contact: "تماس",
  search: "جستجو",
  places: "مکان",
  archive: "آرشیو",
  sparkles: "ویژه",
};

export type FooterNavLink = {
  label: string;
  href: string;
  icon: FooterIconId;
  enabled: boolean;
};

export type FooterNavSection = {
  id: string;
  title: string;
  icon: FooterIconId;
  enabled: boolean;
  links: FooterNavLink[];
};

const ICON_SET = new Set<string>(FOOTER_ICON_IDS);

export const DEFAULT_FOOTER_NAV: FooterNavSection[] = [
  {
    id: "about",
    title: "دکتر مجتهدی",
    icon: "person",
    enabled: true,
    links: [
      { label: "زندگی‌نامه", href: "/about/biography", icon: "biography", enabled: true },
      { label: "خط زمان", href: "/about/timeline", icon: "timeline", enabled: true },
      { label: "معرفی بنیاد", href: "/foundation", icon: "foundation", enabled: true },
      { label: "ارکان بنیاد", href: "/foundation/organs", icon: "organs", enabled: true },
      { label: "شاگردان", href: "/heritage/students", icon: "students", enabled: true },
    ],
  },
  {
    id: "content",
    title: "محتوا",
    icon: "news",
    enabled: true,
    links: [
      { label: "اخبار", href: "/news", icon: "news", enabled: true },
      { label: "مقالات", href: "/magazine", icon: "magazine", enabled: true },
      { label: "کتاب‌ها", href: "/library/books", icon: "books", enabled: true },
      { label: "پروژه‌ها", href: "/projects", icon: "projects", enabled: true },
    ],
  },
  {
    id: "gallery",
    title: "گالری",
    icon: "gallery",
    enabled: true,
    links: [
      { label: "گالری", href: "/gallery", icon: "gallery", enabled: true },
      { label: "تصاویر", href: "/archive/photographs", icon: "photos", enabled: true },
      { label: "ویدئو", href: "/archive/video", icon: "video", enabled: true },
    ],
  },
  {
    id: "together",
    title: "همراهی",
    icon: "support",
    enabled: true,
    links: [
      { label: "همکاری", href: "/collaborate", icon: "collaborate", enabled: true },
      { label: "ارسال خاطره", href: "/contribute", icon: "memories", enabled: true },
      { label: "حمایت", href: "/support", icon: "support", enabled: true },
      { label: "شفافیت", href: "/transparency", icon: "charter", enabled: true },
      { label: "کمک مالی", href: "/donate", icon: "support", enabled: true },
      { label: "حامیان", href: "/sponsors", icon: "sponsors", enabled: true },
      { label: "پیوندهای مفید", href: "/links", icon: "collaborate", enabled: true },
      { label: "عضویت", href: "/account/membership", icon: "person", enabled: true },
      { label: "رسانه", href: "/press", icon: "news", enabled: true },
      { label: "تماس", href: "/contact", icon: "contact", enabled: true },
    ],
  },
];

function cleanIcon(value: unknown): FooterIconId {
  return typeof value === "string" && ICON_SET.has(value)
    ? (value as FooterIconId)
    : "sparkles";
}

function cleanLink(raw: unknown): FooterNavLink | null {
  if (!raw || typeof raw !== "object") return null;
  const link = raw as Partial<FooterNavLink>;
  const label = String(link.label ?? "").trim().slice(0, 80);
  const href = String(link.href ?? "").trim().slice(0, 300);
  if (!label && !href) return null;
  return {
    label,
    href,
    icon: cleanIcon(link.icon),
    enabled: link.enabled !== false,
  };
}

/** Empty or missing data keeps the current footer. A saved list is used as-is. */
export function mergeFooterNav(raw?: FooterNavSection[] | null): FooterNavSection[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_FOOTER_NAV.map((section) => ({
      ...section,
      links: section.links.map((link) => ({ ...link })),
    }));
  }

  const sections: FooterNavSection[] = [];
  raw.slice(0, 8).forEach((section, index) => {
    if (!section || typeof section !== "object") return;
    const links = Array.isArray(section.links)
      ? section.links.map(cleanLink).filter((link): link is FooterNavLink => Boolean(link)).slice(0, 16)
      : [];
    const title = String(section.title ?? "").trim().slice(0, 80);
    if (!title && links.length === 0) return;
    const id = String(section.id ?? "").trim().slice(0, 40) || `section-${index + 1}`;
    sections.push({
      id,
      title: title || "پیوندها",
      icon: cleanIcon(section.icon),
      enabled: section.enabled !== false,
      links,
    });
  });

  return sections.length ? sections : mergeFooterNav(null);
}

export function visibleFooterNav(raw?: FooterNavSection[] | null): FooterNavSection[] {
  return mergeFooterNav(raw)
    .filter((section) => section.enabled)
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => link.enabled && link.label && link.href),
    }))
    .filter((section) => section.links.length > 0);
}
