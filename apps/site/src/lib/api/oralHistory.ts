import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import { mockOralHistory, type OralHistoryInterview } from "@/lib/mock/oralHistory";

function normalize(row: Record<string, unknown>): OralHistoryInterview {
  const status = row.status === "coming-soon" ? "coming-soon" : "published";
  const audioRaw = row.audio_src ?? row.audioSrc;
  return {
    id: String(row.id ?? row.slug ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    subtitle: String(row.subtitle ?? ""),
    year: String(row.year ?? ""),
    durationLabel: String(row.duration_label ?? row.durationLabel ?? ""),
    narrator: String(row.narrator ?? ""),
    collection: String(row.collection ?? ""),
    description: String(row.description ?? ""),
    transcriptExcerpt: String(row.transcript_excerpt ?? row.transcriptExcerpt ?? ""),
    source: String(row.source ?? ""),
    audioSrc: audioRaw ? String(audioRaw) : null,
    relatedHref: String(row.related_href ?? row.relatedHref ?? "") || undefined,
    relatedLabel: String(row.related_label ?? row.relatedLabel ?? "") || undefined,
    status,
  };
}

export async function listOralHistory(): Promise<OralHistoryInterview[]> {
  if (!isApiEnabled()) return mockOralHistory;
  const data = await apiGet<
    Record<string, unknown>[] | { results: Record<string, unknown>[] }
  >("/oral-history/");
  const rows = await unwrapList(data);
  return rows.map(normalize);
}

export async function getOralHistory(
  slug: string,
): Promise<OralHistoryInterview | null> {
  if (!isApiEnabled()) {
    return mockOralHistory.find((item) => item.slug === slug) ?? null;
  }
  try {
    const row = await apiGet<Record<string, unknown>>(`/oral-history/${slug}/`);
    return normalize(row);
  } catch {
    return null;
  }
}
