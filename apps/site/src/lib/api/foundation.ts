import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import {
  mockBooks,
  mockCollaborateOptions,
  mockOrganMembers,
  mockPeople,
  mockProjects,
  mockSponsors,
} from "@/lib/mock";
import type {
  CollaborateOption,
  FoundationOrganMember,
  FoundationProject,
  LibraryItem,
  Person,
  Sponsor,
  UsefulLink,
} from "@/lib/types";

export async function listOrganMembers(): Promise<FoundationOrganMember[]> {
  if (!isApiEnabled()) return mockOrganMembers;
  const data = await apiGet<
    FoundationOrganMember[] | { results: FoundationOrganMember[] }
  >("/foundation/organs/");
  return unwrapList(data);
}

export async function listStudents(): Promise<Person[]> {
  const people = await listPeopleLocal();
  return people.filter((p) => p.kind === "student");
}

async function listPeopleLocal(): Promise<Person[]> {
  if (!isApiEnabled()) return mockPeople;
  const data = await apiGet<Person[] | { results: Person[] }>("/people/");
  return unwrapList(data);
}

export async function listBooks(): Promise<LibraryItem[]> {
  if (!isApiEnabled()) return mockBooks;
  const data = await apiGet<LibraryItem[] | { results: LibraryItem[] }>(
    "/library/books/",
  );
  return unwrapList(data);
}

export async function getBook(slug: string): Promise<LibraryItem | null> {
  if (!isApiEnabled()) {
    return mockBooks.find((b) => b.slug === slug) ?? null;
  }
  try {
    return await apiGet<LibraryItem>(`/library/books/${slug}/`);
  } catch {
    return null;
  }
}

function resolveProgress(project: FoundationProject): number | null | undefined {
  const raw = project.progressPercent ?? project.progress_percent;
  if (raw == null || raw === ("" as unknown)) return undefined;
  const n = Number(raw);
  if (Number.isNaN(n)) return undefined;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function enrichProject(project: FoundationProject): FoundationProject {
  const mock = mockProjects.find((item) => item.slug === project.slug);
  const progress = resolveProgress(project);
  if (!mock) {
    return {
      ...project,
      progressPercent: progress ?? null,
    };
  }
  const hasCover = Boolean(project.heroImage?.src);
  return {
    ...project,
    description: project.description || mock.description,
    phase: project.phase || mock.phase,
    location: project.location || mock.location,
    href: project.href || mock.href,
    coverTone: project.coverTone || mock.coverTone,
    heroImage: hasCover ? project.heroImage : mock.heroImage,
    source: project.source || mock.source,
    progressPercent:
      progress ?? mock.progressPercent ?? mock.progress_percent ?? null,
  };
}

export async function listProjects(): Promise<FoundationProject[]> {
  if (!isApiEnabled()) return mockProjects;
  const data = await apiGet<
    FoundationProject[] | { results: FoundationProject[] }
  >("/projects/");
  const items = await unwrapList(data);
  return items.map(enrichProject);
}

export async function getProject(slug: string): Promise<FoundationProject | null> {
  if (!isApiEnabled()) {
    return mockProjects.find((item) => item.slug === slug) ?? null;
  }
  try {
    const project = await apiGet<FoundationProject>(`/projects/${slug}/`);
    return enrichProject(project);
  } catch {
    return mockProjects.find((item) => item.slug === slug) ?? null;
  }
}

export function relatedProjects(
  projects: FoundationProject[],
  currentId: string,
  limit = 3,
) {
  return projects.filter((item) => item.id !== currentId).slice(0, limit);
}

export async function listCollaborateOptions(): Promise<CollaborateOption[]> {
  if (!isApiEnabled()) return mockCollaborateOptions;
  const data = await apiGet<
    CollaborateOption[] | { results: CollaborateOption[] }
  >("/collaborate/");
  return unwrapList(data);
}

export async function listSponsors(): Promise<Sponsor[]> {
  if (!isApiEnabled()) return mockSponsors;
  const data = await apiGet<Sponsor[] | { results: Sponsor[] }>("/sponsors/");
  return unwrapList(data);
}

export async function getSponsor(slug: string): Promise<Sponsor | null> {
  if (!isApiEnabled()) {
    return mockSponsors.find((item) => item.slug === slug) ?? null;
  }
  try {
    return await apiGet<Sponsor>(`/sponsors/${slug}/`);
  } catch {
    return null;
  }
}

export async function listUsefulLinks(): Promise<UsefulLink[]> {
  if (!isApiEnabled()) return [];
  try {
    const data = await apiGet<UsefulLink[] | { results: UsefulLink[] }>(
      "/useful-links/",
    );
    return unwrapList(data);
  } catch {
    return [];
  }
}
