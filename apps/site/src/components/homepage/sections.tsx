import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Camera,
  Clapperboard,
  FolderKanban,
  HandHeart,
  Images,
  GraduationCap,
  BookOpen,
  Landmark,
  ShieldCheck,

  MessagesSquare,
} from "lucide-react";
import { LandingPhoto } from "@/components/homepage/LandingPhoto";
import { ArticleCover } from "@/components/magazine/ArticleCover";
import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { IconBadge } from "@/components/ui/IconBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  mockArticles,
  mockNews,
  mockPartnerLinks,
  mockProjects,
  mockSponsors,
} from "@/lib/mock";
import { COVER_IMAGES } from "@/lib/mock/covers";
import { DONATE_TARGETS } from "@/lib/mock/donations";
import type { Article, FoundationProject, NewsItem, Sponsor } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

function newsAsArticle(item: NewsItem): Article {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    status: item.status,
    category: item.category,
    coverTone: item.coverTone,
    heroImage: item.heroImage,
  };
}

function CardCover({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-mint-soft", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}

function MediaTile({
  href,
  eyebrow,
  title,
  description,
  icon: Icon,
  image,
  tone = "light",
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  tone?: "light" | "dark" | "soft";
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-52 flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-[0_8px_30px_rgba(20,40,35,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-pine/30 hover:shadow-[0_18px_50px_rgba(20,40,35,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
          className={cn(
            "absolute inset-0",
            tone === "dark" && "bg-pine-dark/45",
            tone === "soft" && "bg-mint-soft/25",
            tone === "light" && "bg-ink/15",
          )}
          aria-hidden
        />
        <span className="absolute end-3 top-3 inline-flex size-10 items-center justify-center rounded-xl bg-white/90 text-pine shadow-sm backdrop-blur-sm">
          <Icon className="size-4.5" strokeWidth={1.8} aria-hidden />
        </span>
        <p className="absolute start-4 bottom-3 text-[11px] font-semibold tracking-[0.16em] text-white drop-shadow-sm">
          {eyebrow}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-pine">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-ink-muted">{description}</p>
      </div>
    </Link>
  );
}

function plainText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const GIVE_CARDS = [
  {
    id: "education",
    href: "/donate",
    title: DONATE_TARGETS[0].title,
    description: DONATE_TARGETS[0].description,
    image: "/images/covers/give-education.jpeg",
    fallback: COVER_IMAGES.library,
  },
  {
    id: "archive",
    href: "/donate",
    title: DONATE_TARGETS[2].title,
    description: DONATE_TARGETS[2].description,
    image: "/images/covers/give-archive.jpeg",
    fallback: COVER_IMAGES.archive,
  },
  {
    id: "students",
    href: "/donate",
    title: DONATE_TARGETS[3].title,
    description: DONATE_TARGETS[3].description,
    image: "/images/covers/give-students.jpeg",
    fallback: COVER_IMAGES.gathering,
  },
] as const;

export function DonationPreview({
  message,
  goals,
}: {
  message?: string;
  goals?: { id: string; title: string; description?: string }[];
}) {
  const text = plainText(message ?? "");
  const cards = GIVE_CARDS.map((card, index) => {
    const goal = goals?.[index];
    return {
      ...card,
      id: goal?.id || card.id,
      title: goal?.title || card.title,
      description: goal?.description || card.description,
    };
  });

  const impactItems = [
    {
      number: "۰۱",
      icon: GraduationCap,
      title: cards[0]?.title || "فرصت‌های آموزشی",
      description:
        cards[0]?.description ||
        "کمک به گسترش فرصت‌های یادگیری و دسترسی به منابع آموزشی.",
    },
    {
      number: "۰۲",
      icon: BookOpen,
      title: cards[1]?.title || "حفظ میراث و اسناد",
      description:
        cards[1]?.description ||
        "پشتیبانی از نگهداری، سامان‌دهی و در دسترس قرار گرفتن آثار و خاطرات ارزشمند.",
    },
    {
      number: "۰۳",
      icon: Landmark,
      title: cards[2]?.title || "پشتیبانی از نسل آینده",
      description:
        cards[2]?.description ||
        "کمک به برنامه‌هایی که زمینه رشد و شکوفایی دانشجویان و جوانان را فراهم می‌کنند.",
    },
  ];

  return (
    <FadeIn>
      <section
        className="relative isolate overflow-hidden bg-[#102F2A] text-[#FBF8F0]"
        aria-labelledby="foundation-donation-title"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 12% 18%, #C6A66B 0, transparent 35%), radial-gradient(ellipse at 92% 88%, #6EAA91 0, transparent 32%)",
          }}
        />
        <div className="content-shell section-pad !py-16 md:!py-24 lg:!py-28">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div>
              <p className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.12em] text-[#D9BD83]">
                <span className="h-px w-8 bg-[#D9BD83]" />
                سهم شما در ادامه یک میراث
              </p>

              <h2
                id="foundation-donation-title"
                className="mt-7 max-w-2xl text-3xl font-semibold leading-[1.55] tracking-tight text-[#FBF8F0] md:text-5xl md:leading-[1.45] lg:text-[3.5rem]"
              >
                بعضی میراث‌ها را
                <span className="block text-[#D9BD83]">باید به آینده رساند.</span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/75 md:text-lg md:leading-9">
                حمایت از بنیاد، تنها یک کمک مالی نیست؛ مشارکت در زنده نگه‌داشتن
                اندیشه، گسترش فرصت‌های یادگیری و حفظ آثاری است که می‌توانند
                برای نسل‌های آینده الهام‌بخش باشند.
              </p>

              {/* {text ? (
                <p className="mt-4 max-w-xl border-r-2 border-[#D9BD83]/70 pr-4 text-sm leading-7 text-white/65">
                  {text}
                </p>
              ) : null} */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/donate"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#D9BD83] px-7 py-4 text-sm font-bold text-[#173A32] transition-colors hover:bg-[#E8D3A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#102F2A]"
                >
                  می‌خواهم همراه باشم
                  <ArrowLeft className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex min-h-14 items-center justify-center gap-2 border border-white/25 px-6 py-4 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  فعالیت‌های بنیاد را ببینید
                </Link>
              </div>

              <div className="mt-8 flex items-start gap-3 text-sm leading-7 text-white/60">
                <ShieldCheck
                  className="mt-1 size-5 shrink-0 text-[#D9BD83]"
                  strokeWidth={1.6}
                  aria-hidden
                />
                <p>
                  پیش از مشارکت، با اهداف، برنامه‌ها و مسیرهای حمایت مالی بنیاد
                  آشنا شوید و متناسب با علاقه و توان خود تصمیم بگیرید.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 border border-[#D9BD83]/25 md:-inset-5" aria-hidden="true" />
              <div className="relative bg-[#F6F1E6] p-6 text-[#183A32] md:p-9 lg:p-10">
                <div className="flex items-start justify-between gap-4 border-b border-[#183A32]/15 pb-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.12em] text-[#8C7041]">
                      حمایت شما می‌تواند
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold leading-10 md:text-xl">
                      به سه مسیر ارزشمند جان بدهد
                    </h3>
                  </div>
                  <HandHeart
                    className="mt-1 size-8 shrink-0 text-[#8C7041]"
                    strokeWidth={1.4}
                    aria-hidden
                  />
                </div>

                <ol className="divide-y divide-[#183A32]/15">
                  {impactItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.number} className="group py-5 first:pt-6 last:pb-1">
                        <div className="flex gap-4 md:gap-5">
                          <span className="pt-1 text-xs font-semibold tabular-nums text-[#9A8051]">
                            {item.number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3">
                              <Icon
                                className="size-5 shrink-0 text-[#54796A]"
                                strokeWidth={1.6}
                                aria-hidden
                              />
                              <h4 className="text-base font-bold leading-7 md:text-lg">
                                {item.title}
                              </h4>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-[#52635C]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <Link
                  href="/donate"
                  className="mt-7 flex items-center justify-between border-t border-[#183A32]/15 pt-5 text-sm font-bold text-[#245B4B] transition-colors hover:text-[#8C7041]"
                >
                  آشنایی با راه‌های حمایت مالی
                  <ArrowLeft className="size-4" aria-hidden />
                </Link>
              </div>
              <p className="mt-4 text-xs leading-6 text-white/50">
                هر مشارکت، فرصتی برای نزدیک‌تر شدن به اهداف بنیاد است.
              </p>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

function StoryBand({
  title,
  moreHref,
  moreLabel,
  leadHref,
  lead,
  rest,
}: {
  title: string;
  moreHref: string;
  moreLabel: string;
  leadHref: string;
  lead: Article;
  rest: { href: string; article: Article }[];
}) {
  return (
    <section className="bg-paper">
      <div className="content-shell section-pad">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <h2 className="text-display max-w-2xl text-3xl leading-tight tracking-tight text-ink md:text-5xl lg:text-4xl">{title}</h2>
          <Link href={moreHref} className="shrink-0 text-sm font-semibold text-pine hover:underline">
            {moreLabel}
          </Link>
        </div>

        <Link href={leadHref} className="group grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <ArticleCover
            article={lead}
            priority
            className="aspect-[16/10] rounded-[1.75rem]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div>
            {lead.category ? (
              <p className="text-sm font-semibold text-pine">{lead.category}</p>
            ) : null}
            <h3 className="text-display mt-3 text-3xl leading-tight tracking-tight text-ink transition-colors group-hover:text-pine md:text-4xl lg:text-3xl">
              {lead.title}
            </h3>
            {lead.description ? (
              <p className="mt-4 line-clamp-4 text-base leading-8 text-ink-muted md:text-lg">
                {lead.description}
              </p>
            ) : null}
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pine">
              خواندن داستان کامل
              <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" aria-hidden />
            </span>
          </div>
        </Link>

        {rest.length > 0 ? (
          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {rest.map((item) => (
              <li key={item.article.id}>
                <Link href={item.href} className="group block">
                  <ArticleCover
                    article={item.article}
                    className="aspect-[16/10] rounded-[1.5rem]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {item.article.category ? (
                    <p className="mt-4 text-sm font-semibold text-pine">{item.article.category}</p>
                  ) : null}
                  <h3 className="mt-1 text-xl font-semibold leading-8 text-ink group-hover:text-pine">
                    {item.article.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-pine">
                    خواندن داستان
                    <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export function NewsPreview({ items: itemsProp }: { items?: NewsItem[] }) {
  const items = (itemsProp?.length ? itemsProp : mockNews).slice(0, 3);
  const [featured, ...rest] = items;
  if (!featured) return null;

  return (
    <FadeIn>
      <StoryBand
        title="داستان‌هایی از شبکهٔ بنیاد"
        moreHref="/news"
        moreLabel="اخبار و داستان‌ها"
        leadHref={`/news/${featured.slug}`}
        lead={newsAsArticle(featured)}
        rest={rest.map((item) => ({
          href: `/news/${item.slug}`,
          article: newsAsArticle(item),
        }))}
      />
    </FadeIn>
  );
}

export function ProjectsPreview({
  items: itemsProp,
}: {
  items?: FoundationProject[];
}) {
  const items = (itemsProp ?? mockProjects).slice(0, 3);
  const [flagship, ...secondary] = items;

  if (!flagship) return null;

  return (
    <FadeIn>
      <section className="content-shell section-pad">
        <SectionHeading
            eyebrow="کارِ در جریان"
            title="چیزهایی که با هم پیش می‌بریم"
            description="از آموزش و مدرسه تا نگهداری میراث؛ هر پروژه جایی است که می‌شود کنارش ایستاد."
          action={
            <Link href="/projects" className="text-sm font-medium text-pine hover:underline">
              همه پروژه‌ها
            </Link>
          }
        />

        <Link
          href={flagship.href ?? "/projects"}
          className="group grid overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-[0_8px_30px_rgba(20,40,35,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-pine/30 hover:shadow-[0_18px_50px_rgba(20,40,35,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 md:grid-cols-12"
        >
          <div className="relative md:col-span-5">
            {flagship.heroImage ? (
              <CardCover
                src={flagship.heroImage.src}
                alt={flagship.heroImage.alt}
                className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[17rem]"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-mint-soft md:aspect-auto md:h-full md:min-h-[17rem]">
                <IconBadge icon={FolderKanban} size="lg" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 md:col-span-7 md:p-8 lg:p-10">
            {flagship.phase ? <Badge tone="bronze">{flagship.phase}</Badge> : null}
            <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-pine md:text-3xl">
              {flagship.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted md:text-[15px] md:leading-8">
              {flagship.description}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pine">
              ببینید چه می‌گذرد
              <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" aria-hidden />
            </span>
          </div>
        </Link>

        {secondary.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {secondary.map((project) => (
              <Link
                key={project.id}
                href={project.href ?? "/projects"}
                className="group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-[0_8px_30px_rgba(20,40,35,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-pine/30 hover:shadow-[0_18px_50px_rgba(20,40,35,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
              >
                {project.heroImage ? (
                  <CardCover
                    src={project.heroImage.src}
                    alt={project.heroImage.alt}
                    className="aspect-[21/9]"
                  />
                ) : (
                  <div className="flex aspect-[21/9] items-center justify-center bg-mint-soft">
                    <IconBadge icon={FolderKanban} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  {project.phase ? <Badge tone="bronze">{project.phase}</Badge> : null}
                  <h3 className="mt-3 text-lg font-semibold tracking-tight transition-colors group-hover:text-pine">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-7 text-ink-muted">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </FadeIn>
  );
}

export function ArchiveHighlights() {
  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-[linear-gradient(180deg,rgb(var(--accent-soft)/0.45),rgb(var(--paper)))]">
        <div className="content-shell section-pad">
          <SectionHeading
            eyebrow="دیدن و شنیدن"
            title="میراث را ورق بزنید"
            description="عکس، فیلم و سند؛ چیزهایی که اگر دیده نشوند، آرام‌آرام گم می‌شوند."
            action={
              <Link href="/gallery" className="text-sm font-medium text-pine hover:underline">
                ورود به گالری
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            <MediaTile
              href="/gallery"
              eyebrow="آرشیو"
              title="گالری"
              description="از اینجا وارد عکس‌ها و فیلم‌ها شوید."
              icon={Images}
              image={COVER_IMAGES.heritage}
              tone="dark"
            />
            <MediaTile
              href="/archive/photographs"
              eyebrow="عکس"
              title="تصویرها"
              description="عکس‌ها و آثاری که به بنیاد سپرده شده‌اند."
              icon={Camera}
              image={COVER_IMAGES.gathering}
            />
            <MediaTile
              href="/archive/video"
              eyebrow="فیلم"
              title="ویدئوها"
              description="روایت تصویری از مراسم، مکان‌ها و آدم‌ها."
              icon={Clapperboard}
              image={COVER_IMAGES.ceremony}
              tone="soft"
            />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function MagazinePreview({
  articles: articlesProp,
}: {
  articles?: Article[];
}) {
  const articles = (articlesProp?.length ? articlesProp : mockArticles).slice(0, 3);
  const [lead, ...rail] = articles;
  if (!lead) return null;

  return (
    <FadeIn>
      <StoryBand
        title="یادداشت‌هایی برای خواندن"
        moreHref="/magazine"
        moreLabel="همهٔ مقاله‌ها"
        leadHref={`/magazine/${lead.slug}`}
        lead={lead}
        rest={rail.map((article) => ({
          href: `/magazine/${article.slug}`,
          article,
        }))}
      />
    </FadeIn>
  );
}

export function PartnersPreview() {
  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-paper/60">
        <div className="content-shell section-pad !py-10">
          <SectionHeading
            eyebrow="کنار ما"
            title="کسانی که این راه را با هم می‌رویم"
            description="دانشگاه‌ها، انجمن‌ها و دوستانی که میراث دکتر مجتهدی را زنده نگه می‌دارند."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {mockPartnerLinks.map((partner) => (
              <li key={partner.id}>
                <span className="inline-flex rounded-full border border-ink/10 bg-surface px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-pine/25 hover:text-pine">
                  {partner.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </FadeIn>
  );
}

export function SponsorsPreview({ items: itemsProp }: { items?: Sponsor[] }) {
  const items = (itemsProp ?? mockSponsors).slice(0, 7);
  return (
    <FadeIn>
      <section className="content-shell section-pad !pb-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="سپاس"
            title="حامیانی که این کار را ممکن می‌کنند"
            description="نام‌هایی که برنامه‌های آموزشی و فرهنگی بنیاد را سر پا نگه می‌دارند."
          />
          <Link href="/sponsors" className="text-sm font-medium text-pine hover:underline">
            مشاهده همه
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {items.map((sponsor) => (
            <li key={sponsor.id}>
              <Link
                href={`/sponsors/${sponsor.slug}`}
                className="group block overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-[0_6px_24px_rgba(20,40,35,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-mint-soft">
                  {sponsor.coverImage ? (
                    <Image
                      src={sponsor.coverImage.src}
                      alt={sponsor.coverImage.alt}
                      fill
                      sizes="160px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
                  <span className="absolute inset-x-2 bottom-2 line-clamp-2 text-center text-[11px] font-medium leading-4 text-white">
                    {sponsor.title}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </FadeIn>
  );
}

export function SupportCTA() {
  return (
    <FadeIn>
      <section className="content-shell section-pad">
        <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-[0_10px_36px_rgba(20,40,35,0.06)]">
          <div
            className="pointer-events-none absolute inset-y-0 end-0 w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgb(var(--accent)/0.12),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 md:py-14">
            <div className="flex max-w-2xl gap-4">
              <IconBadge icon={HandHeart} size="lg" />
              <div>
                <p className="text-xs font-medium text-bronze">اگر کمک مالی الان ممکن نیست</p>
                <h2 className="text-display mt-2 text-2xl md:text-3xl">باز هم جا برای شما هست</h2>
                <p className="mt-3 leading-8 text-ink-muted">
                  یک سند، یک کتاب، یک خاطره یا چند ساعت وقت هم برای این بنیاد ارزشمند است.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-pine-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
              >
                <MessagesSquare className="size-4" aria-hidden />
                ارسال خاطره
              </Link>
              <Link
                href="/collaborate"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-pine/40 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
              >
                <HandHeart className="size-4" aria-hidden />
                همکاری
              </Link>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
