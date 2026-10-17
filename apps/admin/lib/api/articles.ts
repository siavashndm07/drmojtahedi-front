import { apiFetch } from "@/lib/api/client";
import type { ContentStatus, Paginated } from "@/lib/api/resources";
import type { NewsBodyBlock } from "@/lib/newsBlocks";

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export type AdminArticle = {
  id: number | string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  body?: string;
  blocks?: NewsBodyBlock[];
  category?: string;
  status: ContentStatus;
  author?: string;
  dateLabel?: string;
  date_label?: string;
  publishedAt?: string | null;
  published_at?: string | null;
  readingTimeMinutes?: number | null;
  reading_time_minutes?: number | null;
  coverTone?: string;
  cover?: string;
  coverImageId?: string | null;
  heroImage?: { id?: string | null; src: string; alt?: string } | null;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
};

export type ArticlePayload = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  body?: string;
  blocks?: NewsBodyBlock[];
  category?: string;
  status?: ContentStatus;
  author?: string;
  dateLabel?: string;
  publishedAt?: string | null;
  readingTimeMinutes?: number | null;
  coverTone?: string;
  coverImageId?: string | null;
  tags?: string[];
};

export type AdminArticleCategory = {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
};

export async function apiListArticles(token: string) {
  return unwrapList(
    await apiFetch<AdminArticle[] | Paginated<AdminArticle>>("/admin/articles/", {
      token,
    }),
  );
}

export async function apiGetArticle(token: string, id: string | number) {
  return apiFetch<AdminArticle>(`/admin/articles/${id}/`, { token });
}

export async function apiCreateArticle(token: string, payload: ArticlePayload) {
  return apiFetch<AdminArticle>("/admin/articles/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateArticle(
  token: string,
  id: string | number,
  payload: Partial<ArticlePayload>,
) {
  return apiFetch<AdminArticle>(`/admin/articles/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteArticle(token: string, id: string | number) {
  return apiFetch(`/admin/articles/${id}/`, { method: "DELETE", token });
}

export async function apiListArticleCategories(token: string) {
  return unwrapList(
    await apiFetch<AdminArticleCategory[] | Paginated<AdminArticleCategory>>(
      "/admin/article-categories/",
      { token },
    ),
  );
}

export async function apiSaveArticleCategory(
  token: string,
  payload: Partial<AdminArticleCategory> & { title: string; slug: string },
  id?: string | number,
) {
  if (id) {
    return apiFetch<AdminArticleCategory>(`/admin/article-categories/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<AdminArticleCategory>("/admin/article-categories/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteArticleCategory(token: string, id: string | number) {
  return apiFetch(`/admin/article-categories/${id}/`, { method: "DELETE", token });
}
