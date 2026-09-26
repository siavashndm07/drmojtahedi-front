/** Shared content status — never present placeholders as verified history. */
export type ContentStatus = "published" | "draft" | "placeholder" | "coming-soon";

export type MediaAsset = {
  id?: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  isConceptual?: boolean;
};

export type RelatedRef = {
  id: string;
  slug: string;
  title: string;
  type: string;
  href?: string;
};

export type EntityBase = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status: ContentStatus;
  source?: string | null;
  media?: MediaAsset[];
  relatedContent?: RelatedRef[];
};

export type PersonKind =
  | "student"
  | "colleague"
  | "founder"
  | "family"
  | "organ"
  | "other";

export type Person = EntityBase & {
  name: string;
  role?: string;
  relationship?: string;
  portrait?: MediaAsset;
  biography?: string;
  /** Classification for directories (e.g. شاگردان) */
  kind?: PersonKind;
  /** Organ role label when kind is organ */
  organRole?: string;
};

export type OrganGroup =
  | "boards"
  | "members"
  | "representatives"
  | "other";

export type FoundationOrganMember = {
  id: string;
  name: string;
  role: string;
  group: OrganGroup;
  location?: string;
  note?: string;
  status: ContentStatus;
};

export type Sponsor = EntityBase & {
  kind: "individual" | "organization";
  logoLabel?: string;
};

export type FoundationProject = EntityBase & {
  phase?: string;
  location?: string;
  href?: string;
  coverTone?: "pine" | "ink" | "bronze";
};

export type CollaborateOption = EntityBase & {
  kind: "volunteer" | "partner" | "research" | "donate-artifact" | "corporate";
};

export type AssessmentProgram = EntityBase & {
  audience?: string;
  outcomes?: string[];
};

export type Place = EntityBase & {
  location?: string;
  coordinates?: { lat: number; lng: number } | null;
  historicalSignificance?: string;
};

export type Institution = EntityBase & {
  foundedYear?: string;
  location?: string;
};

export type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
  location?: string;
  image?: string;
  category?: string;
  relatedItems?: string[];
  status: ContentStatus;
  source?: string | null;
};

export type ArchiveItemType =
  | "document"
  | "photo"
  | "audio"
  | "video"
  | "book"
  | "letter"
  | "certificate"
  | "object";

export type ArchiveItem = EntityBase & {
  type: ArchiveItemType;
  dateLabel?: string;
  creator?: string;
  collection?: string;
  rights?: string;
  location?: string;
  thumbnail?: MediaAsset;
};

export type MuseumCollection = EntityBase & {
  itemCount?: number | null;
  image?: MediaAsset;
};

export type MuseumObject = EntityBase & {
  collectionSlug?: string;
  accessionNumber?: string;
  materials?: string;
  period?: string;
  image?: MediaAsset;
};

export type ExhibitionStatus = "current" | "upcoming" | "past";

export type Exhibition = EntityBase & {
  exhibitionStatus: ExhibitionStatus;
  startDate?: string | null;
  endDate?: string | null;
  location?: string;
  curatorialStatement?: string;
  image?: MediaAsset;
};

export type Facility = EntityBase & {
  capacityLabel?: string;
  purpose?: string;
  image?: MediaAsset;
};

export type EventSchedule = "upcoming" | "past";

export type EventItem = EntityBase & {
  startAt?: string | null;
  endAt?: string | null;
  /** Persian display date */
  dateLabel?: string;
  /** Filter bucket for past / upcoming pills */
  schedule?: EventSchedule;
  venue?: string;
  category?: string;
  image?: MediaAsset;
  speakers?: string[];
  body?: string;
  coverTone?: "pine" | "ink" | "bronze";
};

export type NewsItem = EntityBase & {
  dateLabel?: string;
  publishedAt?: string | null;
  category?: string;
  author?: string;
  coverTone?: "pine" | "ink" | "bronze";
  heroImage?: MediaAsset;
  body?: string;
  blocks?: ArticleBodyBlock[];
  /** Optional link to a related event */
  relatedEventSlug?: string;
};

export type EducationProgram = EntityBase & {
  programType?: "course" | "workshop" | "lecture" | "resource";
  audience?: string;
  image?: MediaAsset;
};

export type LibraryItem = EntityBase & {
  author?: string;
  year?: string;
  itemType?: "book" | "article" | "research" | "thesis" | "publication" | "document";
};

export type OralHistoryInterview = EntityBase & {
  personName?: string;
  dateLabel?: string;
  audioSrc?: string | null;
  transcript?: { time: string; text: string }[];
  topics?: string[];
};

export type ArticleBodyBlock = {
  type: "paragraph" | "h2" | "h3" | "quote" | "ul" | "ol" | "tip" | "image";
  text: string;
  src?: string;
  alt?: string;
};

export type Article = EntityBase & {
  subtitle?: string;
  author?: string;
  publishedAt?: string | null;
  /** Display date in Persian calendar / label */
  dateLabel?: string;
  readingTimeMinutes?: number;
  category?: string;
  tags?: string[];
  heroImage?: MediaAsset;
  /** Conceptual cover tone when no archival photo yet */
  coverTone?: "pine" | "ink" | "bronze";
  /** Plain-text fallback body */
  body?: string;
  /** Structured editorial blocks (SensibleCool-style) */
  blocks?: ArticleBodyBlock[];
};

export type MemorySubmission = {
  name: string;
  email: string;
  relationship?: string;
  title: string;
  story: string;
  consent: boolean;
};

export type ConstructionUpdate = EntityBase & {
  dateLabel?: string;
  milestone?: string;
  image?: MediaAsset;
};

export type DonationOption = EntityBase & {
  kind: "financial" | "archive" | "book" | "artifact" | "volunteer" | "corporate";
};

export type SearchResultCategory =
  | "all"
  | "people"
  | "archive"
  | "museum"
  | "events"
  | "news"
  | "articles"
  | "library"
  | "places";

export type SearchResult = {
  id: string;
  title: string;
  excerpt?: string;
  href: string;
  category: Exclude<SearchResultCategory, "all">;
  status: ContentStatus;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
