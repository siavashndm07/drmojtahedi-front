import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";

export type GalleryKind = "images" | "videos";

export type GalleryItem = {
  id: number;
  caption: string;
  sortOrder: number;
  url: string;
};

export type GalleryAlbum = {
  id: number;
  title: string;
  slug: string;
  description: string;
  kind: GalleryKind;
  sortOrder: number;
  isActive: boolean;
  coverUrl: string;
  itemCount: number;
  items?: GalleryItem[];
};

export async function listGalleries(): Promise<GalleryAlbum[]> {
  if (!isApiEnabled()) return [];
  try {
    const data = await apiGet<GalleryAlbum[] | { results?: GalleryAlbum[] }>("/galleries/");
    return unwrapList(data);
  } catch {
    return [];
  }
}

export async function getGallery(id: string | number): Promise<GalleryAlbum | null> {
  if (!isApiEnabled()) return null;
  const key = String(id).trim();
  if (!key) return null;
  try {
    return await apiGet<GalleryAlbum>(`/galleries/${encodeURIComponent(key)}/`);
  } catch {
    return null;
  }
}
