import { isApiEnabled } from "@/lib/api/config";
import { apiGet, unwrapList } from "@/lib/api/client";
import {
  mockAssessment,
  mockBooks,
  mockCollaborateOptions,
  mockOrganMembers,
  mockPeople,
  mockProjects,
  mockSponsors,
} from "@/lib/mock";
import type {
  AssessmentProgram,
  CollaborateOption,
  FoundationOrganMember,
  FoundationProject,
  LibraryItem,
  Person,
  Sponsor,
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
  const books = await listBooks();
  return books.find((b) => b.slug === slug) ?? null;
}

export async function listProjects(): Promise<FoundationProject[]> {
  if (!isApiEnabled()) return mockProjects;
  const data = await apiGet<
    FoundationProject[] | { results: FoundationProject[] }
  >("/projects/");
  return unwrapList(data);
}

export async function getAssessment(): Promise<AssessmentProgram> {
  if (!isApiEnabled()) return mockAssessment;
  try {
    return await apiGet<AssessmentProgram>("/education/assessment/");
  } catch {
    return mockAssessment;
  }
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
