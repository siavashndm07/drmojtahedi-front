import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
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
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-card"
              >
                <ArticleCover
                  article={newsAsArticle(item)}
                  className="aspect-[16/10]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                    <Badge tone={item.status === "coming-soon" ? "placeholder" : "pine"}>
                      {item.status === "coming-soon" ? "به‌زودی" : item.category ?? "خبر"}
                    </Badge>
                    {item.dateLabel ? <span>{item.dateLabel}</span> : null}
                  </div>
                  <h3 className="mt-3 text-lg font-medium leading-8 group-hover:text-pine">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function ProjectsPreview() {
  const items = mockProjects.slice(0, 3);

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
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((project) => (
            <Link
              key={project.id}
              href={project.href ?? "/projects"}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
            >
              {project.heroImage ? (
                <CardCover
                  src={project.heroImage.src}
                  alt={project.heroImage.alt}
                  className="aspect-[16/10]"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-mint-soft">
                  <IconBadge icon={FolderKanban} />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  {project.phase ? <Badge tone="bronze">{project.phase}</Badge> : null}
                </div>
                <h3 className="mt-3 text-lg font-medium group-hover:text-pine">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-7 text-ink-muted">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
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

  return (
    <FadeIn>
      <section className="content-shell section-pad">
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
        <div className="grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/magazine/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition-colors hover:border-pine/40"
            >
              <ArticleCover
                article={article}
                className="aspect-[16/10]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs text-bronze">
                  <Newspaper className="size-3.5" aria-hidden />
                  {article.category}
                </div>
                <h3 className="mt-3 text-xl font-medium text-ink group-hover:text-pine">
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink-muted">
                  {article.description}
                </p>
                {article.readingTimeMinutes ? (
                  <p className="mt-4 text-xs text-ink-muted">
                    حدود {toPersianDigits(article.readingTimeMinutes)} دقیقه مطالعه
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
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
            <li
              key={sponsor.id}
              className="group overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-sm"
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
