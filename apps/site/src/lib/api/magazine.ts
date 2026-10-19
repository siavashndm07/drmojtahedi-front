import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockArticles } from "@/lib/mock";
import type { Article } from "@/lib/types";

function enrichArticle(article: Article): Article {
  const mock = mockArticles.find((item) => item.slug === article.slug);
  if (!mock) return article;

  const hasCover = Boolean(article.heroImage?.src || article.cover);
  const hasBlocks = Boolean(article.blocks?.length);
  const hasBody = Boolean(article.body?.trim());

  return {
    ...article,
    subtitle: article.subtitle || mock.subtitle,
    description: article.description || mock.description,
    category: article.category || mock.category,
    author: article.author || mock.author,
    dateLabel: article.dateLabel || mock.dateLabel,
    readingTimeMinutes: article.readingTimeMinutes || mock.readingTimeMinutes,
    coverTone: article.coverTone || mock.coverTone,
    tags: article.tags?.length ? article.tags : mock.tags,
    heroImage: hasCover ? article.heroImage : mock.heroImage,
    cover: hasCover ? article.cover : mock.heroImage?.src,
    blocks: hasBlocks ? article.blocks : mock.blocks,
    body: hasBody ? article.body : mock.body,
  };
}

export async function listArticles(): Promise<Article[]> {
  if (!isApiEnabled()) return mockArticles;
  const data = await apiGet<Article[] | { results: Article[] }>("/magazine/");
  const items = await unwrapList(data);
  return items.map(enrichArticle);
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!isApiEnabled()) {
    return mockArticles.find((item) => item.slug === slug) ?? null;
  }
  try {
    const article = await apiGet<Article>(`/magazine/${slug}/`);
    return enrichArticle(article);
  } catch {
    return null;
  }
}

export function relatedArticles(articles: Article[], currentId: string, limit = 2) {
  return articles.filter((item) => item.id !== currentId).slice(0, limit);
}
