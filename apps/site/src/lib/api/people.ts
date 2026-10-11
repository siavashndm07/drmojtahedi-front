import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockPeople, mockTimeline } from "@/lib/mock";
import type { Person, TimelineEvent } from "@/lib/types";

export async function listPeople(): Promise<Person[]> {
  if (!isApiEnabled()) return mockPeople;
  const data = await apiGet<Person[] | { results: Person[] }>("/people/");
  return unwrapList(data);
}

export async function getPerson(slug: string): Promise<Person | null> {
  if (!isApiEnabled()) {
    return mockPeople.find((item) => item.slug === slug) ?? null;
  }
  try {
    return await apiGet<Person>(`/people/${slug}/`);
  } catch {
    return null;
  }
}

export async function listTimeline(): Promise<TimelineEvent[]> {
  if (!isApiEnabled()) return mockTimeline;
  const data = await apiGet<TimelineEvent[] | { results: TimelineEvent[] }>("/timeline/");
  return unwrapList(data);
}
