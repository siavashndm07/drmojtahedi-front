import type { SearchResult, SearchResultCategory } from "@/lib/types";
import {
  mockArchive,
  mockArticles,
  mockBooks,
  mockNews,
  mockPeople,
  mockPlaces,
  mockProjects,
  mockSponsors,
} from "@/lib/mock";
import { listBooks } from "@/lib/api/foundation";
import { listArticles } from "@/lib/api/magazine";
import { listNews } from "@/lib/api/news";
import { isApiEnabled } from "@/lib/api/config";

export type SearchFilters = {
  category?: SearchResultCategory;
};

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\u064a/g, "\u06cc")
    .replace(/\u0643/g, "\u06a9")
    .replace(/\s+/g, " ");
}

function matches(haystack: string | undefined, needle: string): boolean {
  if (!haystack) return false;
  return normalize(haystack).includes(needle);
}

type IndexedResult = SearchResult & { blob: string };

/**
 * Search abstraction — content types with admin CRUD use live API when enabled.
 */
export async function search(
  query: string,
  filters: SearchFilters = {},
): Promise<SearchResult[]> {
  const q = normalize(query);
  const [news, articles, books] = await Promise.all([
    listNews().catch(() => (isApiEnabled() ? [] : mockNews)),
    listArticles().catch(() => (isApiEnabled() ? [] : mockArticles)),
    listBooks().catch(() => (isApiEnabled() ? [] : mockBooks)),
  ]);

  const all: IndexedResult[] = [
    ...mockPeople.map((item) => ({
      id: item.id,
      title: item.name || item.title,
      excerpt: [item.role, item.description].filter(Boolean).join(" — "),
      href: `/heritage/people/${item.slug}`,
      category: "people" as const,
      status: item.status,
      blob: [item.name, item.title, item.role, item.relationship, item.description, item.biography]
        .filter(Boolean)
        .join(" "),
    })),
    ...mockPlaces.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: [item.location, item.description].filter(Boolean).join(" — "),
      href: `/heritage/places/${item.slug}`,
      category: "places" as const,
      status: item.status,
      blob: [item.title, item.location, item.description, item.historicalSignificance]
        .filter(Boolean)
        .join(" "),
    })),
    ...mockArchive.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/archive/${item.slug}`,
      category: "archive" as const,
      status: item.status,
      blob: [item.title, item.description, item.collection, item.creator, item.type]
        .filter(Boolean)
        .join(" "),
    })),
    ...news.map((item) => ({
      id: String(item.id),
      title: item.title,
      excerpt: item.description,
      href: `/news/${item.slug}`,
      category: "news" as const,
      status: item.status,
      blob: [item.title, item.description, item.category, item.body]
        .filter(Boolean)
        .join(" "),
    })),
    ...articles.map((item) => ({
      id: String(item.id),
      title: item.title,
      excerpt: item.description ?? item.subtitle,
      href: `/magazine/${item.slug}`,
      category: "articles" as const,
      status: item.status,
      blob: [item.title, item.subtitle, item.description, item.category]
        .filter(Boolean)
        .join(" "),
    })),
    ...books.map((item) => ({
      id: String(item.id),
      title: item.title,
      excerpt: [item.author, item.description].filter(Boolean).join(" — "),
      href: `/library/${item.slug}`,
      category: "library" as const,
      status: item.status,
      blob: [item.title, item.author, item.description, item.year]
        .filter(Boolean)
        .join(" "),
    })),
    ...mockProjects.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/projects/${item.slug}`,
      category: "library" as const,
      status: item.status,
      blob: [item.title, item.description, item.phase, item.location]
        .filter(Boolean)
        .join(" "),
    })),
    ...mockSponsors.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/sponsors/${item.slug}`,
      category: "library" as const,
      status: item.status,
      blob: [item.title, item.description, item.kind].filter(Boolean).join(" "),
    })),
  ];

  return all
    .filter((item) => {
      const categoryOk =
        !filters.category ||
        filters.category === "all" ||
        item.category === filters.category;
      if (!categoryOk) return false;
      if (!q) return true;
      return (
        matches(item.title, q) ||
        matches(item.excerpt, q) ||
        matches(item.blob, q)
      );
    })
    .map(({ blob: _blob, ...rest }) => rest);
}

export const searchCategoryLabels: Record<SearchResultCategory, string> = {
  all: "همه",
  people: "افراد",
  archive: "آرشیو",
  museum: "موزه",
  events: "رویدادها",
  news: "اخبار",
  articles: "مقالات",
  library: "کتابخانه و پروژه",
  places: "مکان‌ها",
};
