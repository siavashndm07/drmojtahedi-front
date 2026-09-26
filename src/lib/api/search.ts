import type { SearchResult, SearchResultCategory } from "@/lib/types";
import {
  mockArchive,
  mockArticles,
  mockEvents,
  mockNews,
  mockPeople,
} from "@/lib/mock";

export type SearchFilters = {
  category?: SearchResultCategory;
};

/**
 * Search abstraction — swap implementation for Django / semantic search later.
 */
export async function search(
  query: string,
  filters: SearchFilters = {},
): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  const all: SearchResult[] = [
    ...mockPeople.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/heritage/people/${item.slug}`,
      category: "people" as const,
      status: item.status,
    })),
    ...mockArchive.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/archive/${item.slug}`,
      category: "archive" as const,
      status: item.status,
    })),
    ...mockEvents.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/events/${item.slug}`,
      category: "events" as const,
      status: item.status,
    })),
    ...mockNews.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/news/${item.slug}`,
      category: "news" as const,
      status: item.status,
    })),
    ...mockArticles.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description,
      href: `/magazine/${item.slug}`,
      category: "articles" as const,
      status: item.status,
    })),
  ];

  return all.filter((item) => {
    const categoryOk =
      !filters.category || filters.category === "all" || item.category === filters.category;
    if (!categoryOk) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.excerpt?.toLowerCase().includes(q) ?? false)
    );
  });
}
