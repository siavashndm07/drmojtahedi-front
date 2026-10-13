import { apiFetch } from "@/lib/api/client";
import type { ContentStatus, Paginated } from "@/lib/api/resources";
import type { NewsBodyBlock } from "@/lib/newsBlocks";

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export type AdminNews = {
  id: number | string;
  slug: string;
  title: string;
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
  coverTone?: string;
  cover?: string;
  coverImageId?: string | null;
  heroImage?: { id?: string | null; src: string; alt?: string } | null;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
};

export type NewsPayload = {
  slug: string;
  title: string;
  description?: string;
  body?: string;
  blocks?: NewsBodyBlock[];
  category?: string;
  status?: ContentStatus;
  author?: string;
  dateLabel?: string;
  publishedAt?: string | null;
  coverTone?: string;
  coverImageId?: string | null;
  tags?: string[];
};

export type AdminNewsCategory = {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
};

export async function apiListNews(token: string) {
  return unwrapList(
    await apiFetch<AdminNews[] | Paginated<AdminNews>>("/admin/news/", { token }),
  );
}

export async function apiGetNews(token: string, id: string | number) {
  return apiFetch<AdminNews>(`/admin/news/${id}/`, { token });
}

export async function apiCreateNews(token: string, payload: NewsPayload) {
  return apiFetch<AdminNews>("/admin/news/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateNews(
  token: string,
  id: string | number,
  payload: Partial<NewsPayload>,
) {
  return apiFetch<AdminNews>(`/admin/news/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteNews(token: string, id: string | number) {
  return apiFetch(`/admin/news/${id}/`, { method: "DELETE", token });
}

export async function apiListNewsCategories(token: string) {
  return unwrapList(
    await apiFetch<AdminNewsCategory[] | Paginated<AdminNewsCategory>>(
      "/admin/news-categories/",
      { token },
    ),
  );
}

export async function apiSaveNewsCategory(
  token: string,
  payload: Partial<AdminNewsCategory> & { title: string; slug: string },
  id?: string | number,
) {
  if (id) {
    return apiFetch<AdminNewsCategory>(`/admin/news-categories/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<AdminNewsCategory>("/admin/news-categories/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteNewsCategory(token: string, id: string | number) {
  return apiFetch(`/admin/news-categories/${id}/`, { method: "DELETE", token });
}
