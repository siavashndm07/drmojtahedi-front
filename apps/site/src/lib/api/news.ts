import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockNews } from "@/lib/mock";
import type { NewsItem } from "@/lib/types";

export async function listNews(): Promise<NewsItem[]> {
  if (!isApiEnabled()) return mockNews;
  const data = await apiGet<NewsItem[] | { results: NewsItem[] }>("/news/");
  return unwrapList(data);
}

export async function getNewsItem(slug: string): Promise<NewsItem | null> {
  if (!isApiEnabled()) {
    return mockNews.find((item) => item.slug === slug) ?? null;
  }
  try {
    return await apiGet<NewsItem>(`/news/${slug}/`);
  } catch {
    return null;
  }
}

export function relatedNews(items: NewsItem[], currentId: string, limit = 3) {
  return items.filter((item) => item.id !== currentId).slice(0, limit);
}
