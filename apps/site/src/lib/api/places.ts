import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockPlaces } from "@/lib/mock";
import type { Place } from "@/lib/types";

export async function listPlaces(): Promise<Place[]> {
  if (!isApiEnabled()) return mockPlaces;
  const data = await apiGet<Place[] | { results: Place[] }>("/places/");
  return unwrapList(data);
}

export async function getPlace(slug: string): Promise<Place | null> {
  if (!isApiEnabled()) {
    return mockPlaces.find((item) => item.slug === slug) ?? null;
  }
  try {
    return await apiGet<Place>(`/places/${slug}/`);
  } catch {
    return null;
  }
}
