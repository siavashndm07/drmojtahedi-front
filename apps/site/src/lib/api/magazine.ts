import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockArticles } from "@/lib/mock";
import type { Article } from "@/lib/types";

export async function listArticles(): Promise<Article[]> {
  if (!isApiEnabled()) return mockArticles;
  const data = await apiGet<Article[] | { results: Article[] }>("/magazine/");
  return unwrapList(data);
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!isApiEnabled()) {
    return mockArticles.find((item) => item.slug === slug) ?? null;
  }
  try {
    return await apiGet<Article>(`/magazine/${slug}/`);
  } catch {
    return null;
  }
}

export function relatedArticles(articles: Article[], currentId: string, limit = 2) {
  return articles.filter((item) => item.id !== currentId).slice(0, limit);
}
