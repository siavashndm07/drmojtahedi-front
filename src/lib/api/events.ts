import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockEvents } from "@/lib/mock";
import type { EventItem } from "@/lib/types";

export async function listEvents(): Promise<EventItem[]> {
  if (!isApiEnabled()) return mockEvents;
  const data = await apiGet<EventItem[] | { results: EventItem[] }>("/events/");
  return unwrapList(data);
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  if (!isApiEnabled()) {
    return mockEvents.find((item) => item.slug === slug) ?? null;
  }
  try {
    return await apiGet<EventItem>(`/events/${slug}/`);
  } catch {
    return null;
  }
}
