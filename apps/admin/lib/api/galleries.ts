import { getStoredAdminToken } from "@/lib/adminToken";
import { ApiError, apiFetch, getApiBase } from "@/lib/api/client";

export type GalleryKind = "images" | "videos";

export type GalleryItemRow = {
  id: number;
  caption: string;
  sortOrder: number;
  url: string;
};

export type GalleryRow = {
  id: number;
  title: string;
  slug: string;
  description: string;
  kind: GalleryKind;
  sortOrder: number;
  isActive: boolean;
  coverId: string | null;
  coverUrl: string;
  itemCount: number;
  items: GalleryItemRow[];
};

export type GalleryWrite = {
  title: string;
  description: string;
  kind: GalleryKind;
  sortOrder: number;
  isActive: boolean;
  coverId: string | null;
};

async function parseJsonBody(text: string): Promise<Record<string, unknown>> {
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { message: text };
  }
}

export async function apiListGalleries(token: string): Promise<GalleryRow[]> {
  const data = await apiFetch<GalleryRow[] | { results?: GalleryRow[] }>(
    "/admin/galleries/",
    { token },
  );
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function apiSaveGallery(
  token: string,
  payload: GalleryWrite,
  id?: number,
): Promise<GalleryRow> {
  return apiFetch<GalleryRow>(id ? `/admin/galleries/${id}/` : "/admin/galleries/", {
    token,
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteGallery(token: string, id: number): Promise<void> {
  await apiFetch(`/admin/galleries/${id}/`, { token, method: "DELETE" });
}

export async function apiUploadGalleryItem(
  galleryId: number,
  file: File,
): Promise<GalleryRow> {
  const base = getApiBase();
  if (!base) throw new Error("API URL is not configured");
  const token = getStoredAdminToken();
  if (!token) throw new Error("وارد پنل نشده‌اید.");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${base}/admin/galleries/${galleryId}/items/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });
  const text = await response.text();
  const body = await parseJsonBody(text);
  if (!response.ok) {
    throw new ApiError(response.status, body, "آپلود ناموفق بود");
  }
  return body as GalleryRow;
}

export async function apiDeleteGalleryItem(
  token: string,
  galleryId: number,
  itemId: number,
): Promise<GalleryRow> {
  return apiFetch<GalleryRow>(`/admin/galleries/${galleryId}/items/${itemId}/`, {
    token,
    method: "DELETE",
  });
}
