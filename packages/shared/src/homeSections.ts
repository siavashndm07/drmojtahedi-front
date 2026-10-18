export type HomeSectionKey =
  | "hero"
  | "donate"
  | "timeline"
  | "news"
  | "projects"
  | "archive"
  | "magazine"
  | "sponsors"
  | "partners"
  | "supportCta";

export type HomeSections = Record<HomeSectionKey, boolean>;

export const HOME_SECTION_KEYS: HomeSectionKey[] = [
  "hero",
  "donate",
  "timeline",
  "news",
  "projects",
  "archive",
  "magazine",
  "sponsors",
  "partners",
  "supportCta",
];

export const HOME_SECTION_LABELS: Record<HomeSectionKey, string> = {
  hero: "اسلایدر / هیرو",
  donate: "کمک و همراهی",
  timeline: "خط زمان",
  news: "اخبار",
  projects: "پروژه‌ها",
  archive: "آرشیو و رسانه",
  magazine: "مجله",
  sponsors: "حامیان",
  partners: "همکاران",
  supportCta: "فراخوان حمایت",
};

export const DEFAULT_HOME_SECTIONS: HomeSections = {
  hero: true,
  donate: true,
  timeline: true,
  news: true,
  projects: true,
  archive: true,
  magazine: true,
  sponsors: true,
  partners: true,
  supportCta: true,
};

export const DEFAULT_HOME_SECTION_ORDER: HomeSectionKey[] = [...HOME_SECTION_KEYS];

export function mergeHomeSections(
  raw?: Partial<HomeSections> | null,
): HomeSections {
  const merged = { ...DEFAULT_HOME_SECTIONS };
  if (!raw || typeof raw !== "object") return merged;
  for (const key of HOME_SECTION_KEYS) {
    if (typeof raw[key] === "boolean") merged[key] = raw[key]!;
  }
  return merged;
}

export function normalizeHomeSectionOrder(
  raw?: readonly string[] | null,
): HomeSectionKey[] {
  const fallback = [...DEFAULT_HOME_SECTION_ORDER];
  if (!Array.isArray(raw) || raw.length === 0) return fallback;

  const valid = new Set<HomeSectionKey>(HOME_SECTION_KEYS);
  const seen = new Set<HomeSectionKey>();
  const order: HomeSectionKey[] = [];

  for (const item of raw) {
    const key = String(item || "").trim() as HomeSectionKey;
    if (!valid.has(key) || seen.has(key)) continue;
    seen.add(key);
    order.push(key);
  }

  for (const key of HOME_SECTION_KEYS) {
    if (seen.has(key)) continue;
    const defaultIndex = DEFAULT_HOME_SECTION_ORDER.indexOf(key);
    let insertAt = order.length;
    for (let index = 0; index < order.length; index += 1) {
      if (DEFAULT_HOME_SECTION_ORDER.indexOf(order[index]) > defaultIndex) {
        insertAt = index;
        break;
      }
    }
    order.splice(insertAt, 0, key);
    seen.add(key);
  }
  return order;
}

export function visibleHomeSections(
  order?: readonly string[] | null,
  enabled?: Partial<HomeSections> | null,
): HomeSectionKey[] {
  const sections = mergeHomeSections(enabled);
  return normalizeHomeSectionOrder(order).filter((key) => sections[key] !== false);
}
