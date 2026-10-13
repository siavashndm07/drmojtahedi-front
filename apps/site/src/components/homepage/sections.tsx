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
  Newspaper,
} from "lucide-react";
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
import type { Article, NewsItem } from "@/lib/types";
import { toPersianDigits } from "@/lib/utils/digits";
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
        className="object-cover transition duration-700 group-hover:scale-[1.04]"
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
      className="group flex min-h-52 flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
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
        <p className="absolute start-4 bottom-3 text-[11px] tracking-[0.16em] text-white/85">
          {eyebrow}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-medium text-ink group-hover:text-pine">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-ink-muted">{description}</p>
      </div>
    </Link>
  );
}

export function NewsPreview() {
  const items = mockNews.slice(0, 3);
  const [featured, ...rest] = items;

  if (!featured) return null;

  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-[linear-gradient(180deg,rgb(var(--accent-soft)/0.4),rgb(var(--paper)))]">
        <div className="content-shell section-pad">
          <SectionHeading
            eyebrow="اخبار"
            title="تازه‌های بنیاد"
            description="اطلاعیه‌ها، فراخوان‌ها و گزارش‌های بنیاد فرهنگی دکتر مجتهدی."
            action={
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-medium text-pine hover:underline"
              >
                <Newspaper className="size-4" aria-hidden />
                همه اخبار
              </Link>
            }
          />
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            <Link
              href={`/news/${featured.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-card lg:col-span-7"
            >
              <ArticleCover
                article={newsAsArticle(featured)}
                className="aspect-[16/10] lg:aspect-[16/9]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                  <Badge
                    tone={featured.status === "coming-soon" ? "placeholder" : "pine"}
                  >
                    {featured.status === "coming-soon"
                      ? "به‌زودی"
                      : featured.category ?? "خبر"}
                  </Badge>
                  {featured.dateLabel ? <span>{featured.dateLabel}</span> : null}
                </div>
                <h3 className="mt-3 text-xl font-medium leading-9 md:text-2xl group-hover:text-pine">
                  {featured.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink-muted md:text-[15px]">
                  {featured.description}
                </p>
              </div>
            </Link>

            <div className="flex flex-col gap-4 lg:col-span-5">
              {rest.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group flex flex-1 gap-4 overflow-hidden rounded-2xl border border-ink/10 bg-surface p-3 shadow-sm transition hover:border-pine/35 hover:shadow-card sm:p-4"
                >
                  <ArticleCover
                    article={newsAsArticle(item)}
                    className="aspect-square w-24 shrink-0 rounded-xl sm:w-28"
                    sizes="112px"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                      <Badge
                        tone={item.status === "coming-soon" ? "placeholder" : "pine"}
                      >
                        {item.status === "coming-soon"
                          ? "به‌زودی"
                          : item.category ?? "خبر"}
                      </Badge>
                      {item.dateLabel ? <span>{item.dateLabel}</span> : null}
                    </div>
                    <h3 className="mt-2 text-base font-medium leading-7 group-hover:text-pine">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-6 text-ink-muted sm:text-sm sm:leading-7">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function ProjectsPreview() {
  const items = mockProjects.slice(0, 3);
  const [flagship, ...secondary] = items;

  if (!flagship) return null;

  return (
    <FadeIn>
      <section className="content-shell section-pad">
        <SectionHeading
          eyebrow="پروژه‌ها"
          title="پروژه‌های بنیاد"
          description="از خانهٔ فرهنگی و یادمان تا پلتفرم دیجیتال میراث."
          action={
            <Link href="/projects" className="text-sm font-medium text-pine hover:underline">
              همه پروژه‌ها
            </Link>
          }
        />

        <Link
          href={flagship.href ?? "/projects"}
          className="group grid overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition hover:border-pine/40 hover:shadow-card md:grid-cols-12"
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
            <h3 className="mt-4 text-2xl font-medium leading-10 md:text-3xl group-hover:text-pine">
              {flagship.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted md:text-[15px] md:leading-8">
              {flagship.description}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pine">
              مشاهده پروژه
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
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
                  <h3 className="mt-3 text-lg font-medium group-hover:text-pine">
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
            eyebrow="گالری"
            title="تصاویر و ویدئو"
            description="گالری تصاویر و آرشیو ویدئوی بنیاد — ادامهٔ بخش گالری سایت پیشین."
            action={
              <Link href="/gallery" className="text-sm font-medium text-pine hover:underline">
                ورود به گالری
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            <MediaTile
              href="/gallery"
              eyebrow="GALLERY"
              title="گالری"
              description="ورودی عمومی به آرشیو دیداری."
              icon={Images}
              image={COVER_IMAGES.heritage}
              tone="dark"
            />
            <MediaTile
              href="/archive/photographs"
              eyebrow="PHOTOS"
              title="گالری تصاویر"
              description="عکس‌ها و آثار اهدایی."
              icon={Camera}
              image={COVER_IMAGES.gathering}
            />
            <MediaTile
              href="/archive/video"
              eyebrow="VIDEO"
              title="گالری ویدئو"
              description="فیلم و روایت تصویری."
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

export function MagazinePreview() {
  const articles = mockArticles.slice(0, 3);
  const [lead, ...rail] = articles;

  if (!lead) return null;

  return (
    <FadeIn>
      <section className="border-y border-ink/5 bg-[linear-gradient(180deg,rgb(var(--paper)),rgb(var(--accent-soft)/0.28))]">
        <div className="content-shell section-pad">
          <SectionHeading
            eyebrow="مقالات"
            title="خواندنی‌های تحریریه"
            description="یادداشت‌هایی دربارهٔ معلم البرز، بنیان‌گذاری شریف، و میراث آموزش در ایران."
            action={
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 text-sm font-medium text-pine hover:underline"
              >
                <Newspaper className="size-4" aria-hidden />
                همه مقالات
              </Link>
            }
          />

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Link
              href={`/magazine/${lead.slug}`}
              className="group flex flex-col lg:col-span-7"
            >
              <ArticleCover
                article={lead}
                className="aspect-[16/10] rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="mt-5 border-s-2 border-pine/40 ps-4 md:mt-6 md:ps-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-bronze">
                  <span className="inline-flex items-center gap-1.5">
                    <Newspaper className="size-3.5" aria-hidden />
                    {lead.category}
                  </span>
                  {lead.readingTimeMinutes ? (
                    <span className="text-ink-muted">
                      حدود {toPersianDigits(lead.readingTimeMinutes)} دقیقه مطالعه
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-2xl font-medium leading-10 text-ink md:text-3xl md:leading-[2.75rem] group-hover:text-pine">
                  {lead.title}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-8 text-ink-muted">
                  {lead.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pine">
                  ادامه مطلب
                  <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>

            <div className="flex flex-col gap-6 lg:col-span-5 lg:justify-center">
              {rail.map((article) => (
                <Link
                  key={article.id}
                  href={`/magazine/${article.slug}`}
                  className="group grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/10 pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[9rem_1fr]"
                >
                  <ArticleCover
                    article={article}
                    className="aspect-[4/3] rounded-xl"
                    sizes="144px"
                  />
                  <div className="min-w-0 self-center">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-bronze">
                      <span>{article.category}</span>
                      {article.readingTimeMinutes ? (
                        <span className="text-ink-muted">
                          {toPersianDigits(article.readingTimeMinutes)} دقیقه
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-base font-medium leading-7 text-ink group-hover:text-pine sm:text-lg sm:leading-8">
                      {article.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-6 text-ink-muted sm:text-sm sm:leading-7">
                      {article.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function PartnersPreview() {
  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-paper/60">
        <div className="content-shell section-pad !py-10">
          <SectionHeading
            eyebrow="لینک‌ها و دوستان"
            title="شبکهٔ همکاران"
            description="دانشگاه‌ها، انجمن‌ها و مؤسسات مرتبط — از فوتر سایت پیشین بنیاد."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {mockPartnerLinks.map((partner) => (
              <li key={partner.id}>
                <span className="inline-flex rounded-full border border-ink/10 bg-surface px-3.5 py-1.5 text-xs text-ink-muted">
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

export function SponsorsPreview() {
  return (
    <FadeIn>
      <section className="content-shell section-pad !pb-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="حامیان"
            title="حامیان گرامی بنیاد"
            description="افراد و سازمان‌هایی که برنامه‌های عام‌المنفعه را ممکن می‌سازند."
          />
          <Link href="/sponsors" className="text-sm font-medium text-pine hover:underline">
            مشاهده همه
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {mockSponsors.map((sponsor) => (
            <li key={sponsor.id}>
              <Link
                href={`/sponsors/${sponsor.slug}`}
                className="group block overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-sm transition hover:border-pine/35"
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
        <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
          <div
            className="pointer-events-none absolute inset-y-0 end-0 w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgb(var(--accent)/0.12),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 md:py-14">
            <div className="flex max-w-2xl gap-4">
              <IconBadge icon={HandHeart} size="lg" />
              <div>
                <p className="text-xs tracking-[0.16em] text-bronze">حمایت</p>
                <h2 className="text-display mt-2 text-2xl md:text-3xl">کمک‌های خیرخواهانه</h2>
                <p className="mt-3 text-ink-muted">
                  حمایت مالی، اهدای سند و کتاب، یا همراهی داوطلبانه با بنیاد.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3.5 text-sm font-semibold text-white hover:bg-pine-dark"
              >
                <HandHeart className="size-4" aria-hidden />
                راه‌های حمایت
              </Link>
              <Link
                href="/collaborate"
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-6 py-3.5 text-sm font-semibold hover:border-pine/40"
              >
                همکاری
              </Link>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
