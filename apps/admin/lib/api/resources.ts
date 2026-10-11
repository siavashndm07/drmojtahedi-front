import { apiFetch } from "@/lib/api/client";

export type Paginated<T> = {
  count: number;
  results: T[];
};

export type ContentStatus = "published" | "draft" | "placeholder" | "coming-soon";

export type NewsItem = {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  body?: string;
  category?: string;
  status: ContentStatus;
  date_label?: string;
  author?: string;
};

export type Person = {
  id: number | string;
  slug: string;
  title: string;
  name: string;
  role?: string;
  kind?: string;
  description?: string;
  biography?: string;
  status: ContentStatus;
};

export type ArchiveItem = {
  id: number | string;
  slug: string;
  title: string;
  type: string;
  description?: string;
  collection?: string;
  status: ContentStatus;
};

export type Sponsor = {
  id: number | string;
  slug: string;
  title: string;
  kind: string;
  description?: string;
  logo_label?: string;
  status: ContentStatus;
};

export type NewsletterRow = {
  id: number | string;
  email: string;
  created_at?: string;
  active?: boolean;
};

export type ContributionRow = {
  id: number | string;
  type: string;
  name: string;
  phone?: string;
  email?: string;
  title: string;
  body: string;
  status?: string;
  created_at?: string;
};

export type DashboardStats = {
  news: number;
  people: number;
  archive: number;
  sponsors: number;
  newsletter: number;
  contributions: number;
};

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function apiDashboard(token: string) {
  return apiFetch<DashboardStats>("/admin/dashboard/", { token });
}

export async function apiListNews(token: string) {
  return unwrapList(await apiFetch<NewsItem[] | Paginated<NewsItem>>("/admin/news/", { token }));
}

export async function apiSaveNews(
  token: string,
  payload: Partial<NewsItem> & { title: string; slug: string },
  id?: string | number,
) {
  if (id) {
    return apiFetch<NewsItem>(`/admin/news/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<NewsItem>("/admin/news/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteNews(token: string, id: string | number) {
  return apiFetch(`/admin/news/${id}/`, { method: "DELETE", token });
}

export async function apiListPeople(token: string) {
  return unwrapList(await apiFetch<Person[] | Paginated<Person>>("/admin/people/", { token }));
}

export async function apiSavePerson(
  token: string,
  payload: Partial<Person> & { title: string; slug: string; name: string },
  id?: string | number,
) {
  if (id) {
    return apiFetch<Person>(`/admin/people/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<Person>("/admin/people/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeletePerson(token: string, id: string | number) {
  return apiFetch(`/admin/people/${id}/`, { method: "DELETE", token });
}

export async function apiListArchive(token: string) {
  return unwrapList(
    await apiFetch<ArchiveItem[] | Paginated<ArchiveItem>>("/admin/archive/", { token }),
  );
}

export async function apiSaveArchive(
  token: string,
  payload: Partial<ArchiveItem> & { title: string; slug: string; type: string },
  id?: string | number,
) {
  if (id) {
    return apiFetch<ArchiveItem>(`/admin/archive/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<ArchiveItem>("/admin/archive/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteArchive(token: string, id: string | number) {
  return apiFetch(`/admin/archive/${id}/`, { method: "DELETE", token });
}

export async function apiListSponsors(token: string) {
  return unwrapList(
    await apiFetch<Sponsor[] | Paginated<Sponsor>>("/admin/sponsors/", { token }),
  );
}

export async function apiSaveSponsor(
  token: string,
  payload: Partial<Sponsor> & { title: string; slug: string; kind: string },
  id?: string | number,
) {
  if (id) {
    return apiFetch<Sponsor>(`/admin/sponsors/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<Sponsor>("/admin/sponsors/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteSponsor(token: string, id: string | number) {
  return apiFetch(`/admin/sponsors/${id}/`, { method: "DELETE", token });
}

export async function apiListNewsletter(token: string) {
  return unwrapList(
    await apiFetch<NewsletterRow[] | Paginated<NewsletterRow>>("/admin/newsletter/", {
      token,
    }),
  );
}

export async function apiListContributions(token: string) {
  return unwrapList(
    await apiFetch<ContributionRow[] | Paginated<ContributionRow>>(
      "/admin/contributions/",
      { token },
    ),
  );
}
