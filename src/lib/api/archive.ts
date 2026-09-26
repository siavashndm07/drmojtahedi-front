import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockArchive } from "@/lib/mock";
import type { ArchiveItem } from "@/lib/types";

export async function listArchiveItems(): Promise<ArchiveItem[]> {
  if (!isApiEnabled()) return mockArchive;
  const data = await apiGet<ArchiveItem[] | { results: ArchiveItem[] }>("/archive/");
  return unwrapList(data);
}

export async function getArchiveItem(slug: string): Promise<ArchiveItem | null> {
  if (!isApiEnabled()) {
    return mockArchive.find((item) => item.slug === slug) ?? null;
  }
  try {
    return await apiGet<ArchiveItem>(`/archive/${slug}/`);
  } catch {
    return null;
  }
}
