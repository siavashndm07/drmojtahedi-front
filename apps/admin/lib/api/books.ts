import { apiFetch } from "@/lib/api/client";
import type { ContentStatus, Paginated } from "@/lib/api/resources";

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export type AdminBook = {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  status: ContentStatus;
  source?: string;
  author?: string;
  year?: string;
  itemType?: string;
  item_type?: string;
  tags?: string[];
  cover?: string;
  coverImageId?: string | null;
  heroImage?: { id?: string | null; src: string; alt?: string } | null;
  created_at?: string;
  updated_at?: string;
};

export type BookPayload = {
  slug: string;
  title: string;
  description?: string;
  status?: ContentStatus;
  source?: string;
  author?: string;
  year?: string;
  itemType?: string;
  tags?: string[];
  coverImageId?: string | null;
};

export async function apiListBooks(token: string) {
  return unwrapList(
    await apiFetch<AdminBook[] | Paginated<AdminBook>>("/admin/books/", { token }),
  );
}

export async function apiGetBook(token: string, id: string | number) {
  return apiFetch<AdminBook>(`/admin/books/${id}/`, { token });
}

export async function apiCreateBook(token: string, payload: BookPayload) {
  return apiFetch<AdminBook>("/admin/books/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateBook(
  token: string,
  id: string | number,
  payload: Partial<BookPayload>,
) {
  return apiFetch<AdminBook>(`/admin/books/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteBook(token: string, id: string | number) {
  return apiFetch(`/admin/books/${id}/`, { method: "DELETE", token });
}
