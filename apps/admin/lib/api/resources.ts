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
  logoLabel?: string;
  coverImageId?: string | null;
  logoImageId?: string | null;
  coverImage?: { id?: string; src: string; alt?: string } | null;
  logoImage?: { id?: string; src: string; alt?: string } | null;
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

export type VisitDayPoint = {
  date: string;
  pageviews: number;
  uniques: number;
};

export type VisitSlicePoint = {
  label: string;
  value: number;
};

export type RecentVisit = {
  at: string;
  path: string;
  ip: string;
  browser: string;
  device: string;
};

export type DashboardNewsItem = {
  id: string | number;
  title: string;
  status: string;
  updatedAt: string;
};

export type DashboardContribution = {
  id: string | number;
  title: string;
  name: string;
  status: string;
  createdAt: string;
};

export type DashboardDonation = {
  id: string | number;
  name: string;
  amount: number;
  status: string;
  createdAt: string;
};

export type DashboardStats = {
  news: number;
  articles?: number;
  books?: number;
  people: number;
  archive: number;
  galleries?: number;
  oralHistory?: number;
  sponsors: number;
  members?: number;
  membersPending?: number;
  newsletter: number;
  contributions: number;
  contributionsNew?: number;
  donationsOpen?: number;
  donationsPaid?: number;
  feesOpen?: number;
  drafts?: number;
  recentNews?: DashboardNewsItem[];
  recentContributions?: DashboardContribution[];
  recentDonations?: DashboardDonation[];
  todayVisits?: number;
  todayUniques?: number;
  visitsLast7Days?: VisitDayPoint[];
  visitsSeries?: VisitDayPoint[];
  visitBrowsers?: VisitSlicePoint[];
  visitDevices?: VisitSlicePoint[];
  recentVisits?: RecentVisit[];
};

export type TrafficRangeDays = 7 | 15 | 30;

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function apiDashboard(token: string, visitDays?: number) {
  const qs = visitDays ? `?visitDays=${visitDays}` : "";
  return apiFetch<DashboardStats>(`/admin/dashboard/${qs}`, { token });
}

export async function getSiteTrafficSeries(token: string, days: TrafficRangeDays) {
  const data = await apiDashboard(token, days);
  return data.visitsSeries ?? [];
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
  payload: Partial<Sponsor> & {
    title: string;
    slug: string;
    kind: string;
    coverImageId?: string | null;
    logoImageId?: string | null;
  },
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

export type UsefulLink = {
  id: number | string;
  title: string;
  url: string;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
  logoId?: string | null;
  logoImage?: { id?: string; src: string; alt?: string } | null;
};

export async function apiListUsefulLinks(token: string) {
  return unwrapList(
    await apiFetch<UsefulLink[] | Paginated<UsefulLink>>("/admin/useful-links/", {
      token,
    }),
  );
}

export async function apiSaveUsefulLink(
  token: string,
  payload: {
    title: string;
    url: string;
    sortOrder?: number;
    isActive?: boolean;
    logoId?: string | null;
  },
  id?: string | number,
) {
  if (id) {
    return apiFetch<UsefulLink>(`/admin/useful-links/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<UsefulLink>("/admin/useful-links/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteUsefulLink(token: string, id: string | number) {
  return apiFetch(`/admin/useful-links/${id}/`, { method: "DELETE", token });
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

export type Place = {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  location?: string;
  lat?: number | null;
  lng?: number | null;
  historical_significance?: string;
  status: ContentStatus;
};

export type TimelineEvent = {
  id: number | string;
  year: string;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  source?: string;
  status: ContentStatus;
};

export type Project = {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  phase?: string;
  location?: string;
  href?: string;
  progress_percent?: number | null;
  progressPercent?: number | null;
  status: ContentStatus;
};

export type OrganMember = {
  id: number | string;
  name: string;
  role: string;
  group: string;
  location?: string;
  note?: string;
  status: ContentStatus;
};

export type OralHistory = {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  subtitle?: string;
  year?: string;
  duration_label?: string;
  narrator?: string;
  collection?: string;
  transcript_excerpt?: string;
  audio_src?: string;
  related_href?: string;
  related_label?: string;
  status: ContentStatus;
};

export type MediaAssetRow = {
  id: string;
  kind: string;
  url: string;
  altText?: string;
  createdAt?: string;
  src?: string;
  alt?: string;
};

export type DonationRow = {
  id: number | string;
  amount: number;
  donor_name?: string;
  donorName?: string;
  phone?: string;
  goal?: string;
  status?: string;
  created_at?: string;
};

export type MembershipTierRow = {
  id: number | string;
  title: string;
  slug?: string;
  annualFeeRials?: number;
  annual_fee_rials?: number;
  description?: string;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
};

export type MemberRow = {
  id: number | string;
  phone: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  education?: string;
  city?: string;
  membershipTierId?: number | string | null;
  membership_tier?: number | string | null;
  membershipType?: string;
  membership_type?: string;
  annualFeeRials?: number;
  annual_fee_rials?: number;
  membershipStatus?: string;
  lastLogin?: string | null;
  last_login?: string | null;
  lastLoginIp?: string | null;
  last_login_ip?: string | null;
  created_at?: string;
};

function crudHelpers<T>(basePath: string) {
  return {
    list: async (token: string) =>
      unwrapList(await apiFetch<T[] | Paginated<T>>(basePath, { token })),
    save: async (token: string, payload: Record<string, unknown>, id?: string | number) => {
      if (id) {
        return apiFetch<T>(`${basePath}${id}/`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
      }
      return apiFetch<T>(basePath, {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });
    },
    remove: async (token: string, id: string | number) =>
      apiFetch(`${basePath}${id}/`, { method: "DELETE", token }),
  };
}

const placesApi = crudHelpers<Place>("/admin/places/");
const timelineApi = crudHelpers<TimelineEvent>("/admin/timeline/");
const projectsApi = crudHelpers<Project>("/admin/projects/");
const organsApi = crudHelpers<OrganMember>("/admin/organs/");
const oralHistoryApi = crudHelpers<OralHistory>("/admin/oral-history/");

export const apiListPlaces = placesApi.list;
export async function apiSavePlace(
  token: string,
  payload: Record<string, string>,
  id?: string | number,
) {
  const body: Record<string, unknown> = { ...payload };
  for (const key of ["lat", "lng"] as const) {
    const raw = payload[key]?.trim() ?? "";
    body[key] = raw === "" ? null : Number(raw);
  }
  return placesApi.save(token, body, id);
}
export const apiDeletePlace = placesApi.remove;

export const apiListTimeline = timelineApi.list;
export const apiSaveTimeline = timelineApi.save;
export const apiDeleteTimeline = timelineApi.remove;

export const apiListProjects = projectsApi.list;
export async function apiSaveProject(
  token: string,
  payload: Record<string, string>,
  id?: string | number,
) {
  const body: Record<string, unknown> = { ...payload };
  const raw = payload.progress_percent?.trim() ?? "";
  if (raw === "") {
    body.progress_percent = null;
  } else {
    const n = Number(raw);
    body.progress_percent = Number.isFinite(n)
      ? Math.min(100, Math.max(0, Math.round(n)))
      : null;
  }
  return projectsApi.save(token, body, id);
}
export const apiDeleteProject = projectsApi.remove;

export const apiListOrgans = organsApi.list;
export const apiSaveOrgan = organsApi.save;
export const apiDeleteOrgan = organsApi.remove;

export const apiListOralHistory = oralHistoryApi.list;
export const apiSaveOralHistory = oralHistoryApi.save;
export const apiDeleteOralHistory = oralHistoryApi.remove;

export async function apiListMedia(token: string) {
  return unwrapList(
    await apiFetch<MediaAssetRow[] | Paginated<MediaAssetRow>>("/admin/media/", {
      token,
    }),
  );
}

export async function apiPatchMedia(
  token: string,
  id: string,
  payload: { altText?: string },
) {
  return apiFetch<MediaAssetRow>(`/admin/media/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteMedia(token: string, id: string) {
  return apiFetch(`/admin/media/${id}/`, { method: "DELETE", token });
}

export async function apiListDonations(token: string) {
  return unwrapList(
    await apiFetch<DonationRow[] | Paginated<DonationRow>>("/admin/donations/", {
      token,
    }),
  );
}

export async function apiPatchDonation(
  token: string,
  id: string | number,
  payload: Partial<DonationRow>,
) {
  return apiFetch<DonationRow>(`/admin/donations/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteDonation(token: string, id: string | number) {
  return apiFetch(`/admin/donations/${id}/`, { method: "DELETE", token });
}

export type DonationGoalRow = {
  id: number | string;
  title: string;
  description?: string;
  slug?: string;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
};

export async function apiListDonationGoals(token: string) {
  return unwrapList(
    await apiFetch<DonationGoalRow[] | Paginated<DonationGoalRow>>(
      "/admin/donation-goals/",
      { token },
    ),
  );
}

export async function apiSaveDonationGoal(
  token: string,
  payload: {
    title: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  id?: string | number,
) {
  if (id) {
    return apiFetch<DonationGoalRow>(`/admin/donation-goals/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  }
  return apiFetch<DonationGoalRow>("/admin/donation-goals/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteDonationGoal(token: string, id: string | number) {
  return apiFetch(`/admin/donation-goals/${id}/`, { method: "DELETE", token });
}

const membershipTiersApi = crudHelpers<MembershipTierRow>("/admin/membership-tiers/");

export const apiListMembershipTiers = membershipTiersApi.list;

export async function apiSaveMembershipTier(
  token: string,
  payload: {
    title: string;
    annualFeeRials: number;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  id?: string | number,
) {
  return membershipTiersApi.save(
    token,
    {
      title: payload.title,
      annualFeeRials: payload.annualFeeRials,
      description: payload.description ?? "",
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    },
    id,
  );
}

export const apiDeleteMembershipTier = membershipTiersApi.remove;

export async function apiListMembers(token: string) {
  return unwrapList(
    await apiFetch<MemberRow[] | Paginated<MemberRow>>("/admin/members/", { token }),
  );
}

export async function apiPatchMember(
  token: string,
  id: string | number,
  payload: Partial<MemberRow> & { membershipTierId?: number | string | null },
) {
  return apiFetch<MemberRow>(`/admin/members/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteMember(token: string, id: string | number) {
  return apiFetch(`/admin/members/${id}/`, { method: "DELETE", token });
}

export type MembershipFeeRow = {
  id: number | string;
  amount: number;
  method?: string;
  gateway?: string;
  gatewayLabel?: string;
  status?: string;
  memberPhone?: string;
  memberName?: string;
  tierTitle?: string;
  tier_title?: string;
  transactionId?: string;
  transaction_id?: string;
  periodYear?: number | null;
  period_year?: number | null;
  createdAt?: string;
  created_at?: string;
};

export async function apiListMembershipFees(token: string) {
  return unwrapList(
    await apiFetch<MembershipFeeRow[] | Paginated<MembershipFeeRow>>(
      "/admin/membership-fees/",
      { token },
    ),
  );
}

export async function apiPatchMembershipFee(
  token: string,
  id: string | number,
  payload: Partial<MembershipFeeRow>,
) {
  return apiFetch<MembershipFeeRow>(`/admin/membership-fees/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteMembershipFee(token: string, id: string | number) {
  return apiFetch(`/admin/membership-fees/${id}/`, { method: "DELETE", token });
}
