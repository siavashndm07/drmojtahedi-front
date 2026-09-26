import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { ArticleCover } from "@/components/magazine/ArticleCover";
import { PageHero } from "@/components/shared/PageHero";
import { listArticles } from "@/lib/api/magazine";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "مجله",
  description:
    "مقالات تحریریه دربارهٔ دکتر محمدعلی مجتهدی گیلانی، دبیرستان البرز، دانشگاه شریف و میراث آموزشی.",
  path: "/magazine",
});

export default async function MagazinePage() {
  const articles = await listArticles();
  const [featured, ...rest] = articles;

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "مجله" }]}
        eyebrow="دانشنامه میراث"
        title="مجله بنیاد"
        description="خواندنی‌هایی دربارهٔ معلم البرز، بنیان‌گذاری شریف، مسیر تحصیل در فرانسه، و میراث فرهنگی امروز."
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium text-ink">
              <BookOpen className="size-3.5 text-mint-deep" aria-hidden />
              {toPersianDigits(articles.length)} مقاله
            </span>
            <Link
              href="/about/biography"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine/35 hover:text-pine"
            >
              زندگی‌نامه
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pine-dark"
            >
              آرشیو
            </Link>
          </>
        }
      />

      <section className="content-wide section-pad !pt-6">
        {featured ? (
          <Link
            href={`/magazine/${featured.slug}`}
            className="group grid overflow-hidden rounded-[2rem] border border-pine/10 bg-surface shadow-sm transition hover:border-pine/40 lg:grid-cols-2"
          >
            <ArticleCover
              article={featured}
              priority
              className="aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                {featured.category ? (
                  <span className="rounded-full bg-mint-soft px-3 py-1 font-medium text-pine dark:bg-mint">
                    {featured.category}
                  </span>
                ) : null}
                {featured.dateLabel ? <span>{featured.dateLabel}</span> : null}
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden />
                  {toPersianDigits(featured.readingTimeMinutes ?? 5)} دقیقه
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-9 text-ink transition group-hover:text-mint-deep sm:text-3xl">
                {featured.title}
              </h2>
              {featured.subtitle ? (
                <p className="mt-2 text-sm font-medium text-pine">{featured.subtitle}</p>
              ) : null}
              <p className="mt-3 text-sm leading-8 text-ink-muted">
                {featured.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-mint-deep">
                ادامه مطلب
                <ArrowLeft className="size-4 transition group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.id}
              href={`/magazine/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-pine/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
            >
              <ArticleCover
                article={article}
                className="aspect-[16/10]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                  {article.category ? (
                    <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-pine dark:bg-mint">
                      {article.category}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" aria-hidden />
                    {toPersianDigits(article.readingTimeMinutes ?? 5)} دقیقه
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-bold leading-8 text-ink transition group-hover:text-mint-deep">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                  {article.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mint-deep">
                  ادامه مطلب
                  <ArrowLeft className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
