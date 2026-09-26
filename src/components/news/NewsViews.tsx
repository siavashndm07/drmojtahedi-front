import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Clock,
  Newspaper,
  User,
} from "lucide-react";
import { ArticleCover } from "@/components/magazine/ArticleCover";
import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/shared/PageHero";
import {
  articleBlockNavLabel,
  listItemsFromBlock,
  parseArticleInline,
} from "@/lib/magazine/blocks";
import type { Article, ArticleBodyBlock, NewsItem } from "@/lib/types";
import { toPersianDigits } from "@/lib/utils/digits";

export function newsAsArticle(item: NewsItem): Article {
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

function InlineText({ text }: { text: string }) {
  const parts = parseArticleInline(text);
  return (
    <>
      {parts.map((part, index) => {
        if (part.kind === "link") {
          const external = part.href.startsWith("http");
          return (
            <Link
              key={`${part.href}-${index}`}
              href={part.href}
              className="font-semibold text-pine underline decoration-pine/30 underline-offset-4"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {part.label}
            </Link>
          );
        }
        return <span key={`t-${index}`}>{part.value}</span>;
      })}
    </>
  );
}

function BodyBlocks({ blocks }: { blocks: ArticleBodyBlock[] }) {
  return (
    <div className="mt-8 space-y-6">
      {blocks.map((block, index) => {
        const id = `section-${index + 1}`;
        if (block.type === "h2") {
          return (
            <h2 key={id} id={id} className="scroll-mt-28 text-display text-2xl text-ink">
              <InlineText text={block.text} />
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={id} id={id} className="scroll-mt-28 text-xl font-bold text-ink">
              <InlineText text={block.text} />
            </h3>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={id}
              id={id}
              className="scroll-mt-28 border-s-4 border-pine/40 bg-mint-soft/40 px-5 py-4 text-sm leading-8 text-ink dark:bg-mint/20"
            >
              <InlineText text={block.text} />
            </blockquote>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const items = listItemsFromBlock(block.text);
          const Tag = block.type === "ol" ? "ol" : "ul";
          return (
            <Tag
              key={id}
              id={id}
              className={`scroll-mt-28 space-y-2 text-sm leading-8 text-ink-muted ${
                block.type === "ol" ? "list-decimal ps-5" : "list-disc ps-5 marker:text-pine"
              }`}
            >
              {items.map((line) => (
                <li key={line}>
                  <InlineText text={line} />
                </li>
              ))}
            </Tag>
          );
        }
        if (block.type === "tip") {
          return (
            <aside
              key={id}
              id={id}
              className="scroll-mt-28 rounded-2xl border border-pine/20 bg-mint-soft/70 p-5 text-sm leading-8 dark:bg-mint/30"
            >
              <InlineText text={block.text} />
            </aside>
          );
        }
        return (
          <p
            key={id}
            id={id}
            className="scroll-mt-28 text-justify text-sm leading-8 text-ink-muted sm:text-base sm:leading-9"
          >
            <InlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

export function NewsIndex({ items }: { items: NewsItem[] }) {
  const [featured, ...rest] = items;

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "اخبار" }]}
        eyebrow="تازه‌ها"
        title="اخبار بنیاد"
        description="اطلاعیه‌ها، فراخوان‌ها و گزارش‌های مرتبط با میراث دکتر مجتهدی، مجموعهٔ فرهنگی و برنامه‌ها."
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium">
              <Newspaper className="size-3.5 text-mint-deep" aria-hidden />
              {toPersianDigits(items.length)} خبر
            </span>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-5 py-2.5 text-sm font-semibold transition hover:border-pine/35 hover:text-pine"
            >
              رویدادها
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
            <Link
              href="/magazine"
              className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
            >
              مجله
            </Link>
          </>
        }
      />

      <section className="content-wide section-pad !pt-6">
        {featured ? (
          <Link
            href={`/news/${featured.slug}`}
            className="group grid overflow-hidden rounded-[2rem] border border-pine/10 bg-surface shadow-sm transition hover:border-pine/40 lg:grid-cols-2"
          >
            <ArticleCover
              article={newsAsArticle(featured)}
              priority
              className="aspect-[4/3] lg:aspect-auto lg:min-h-[20rem]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                <Badge tone={featured.status === "coming-soon" ? "placeholder" : "pine"}>
                  {featured.status === "coming-soon" ? "به‌زودی" : featured.category ?? "خبر"}
                </Badge>
                {featured.dateLabel ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden />
                    {featured.dateLabel}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-9 text-ink transition group-hover:text-mint-deep sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-8 text-ink-muted">{featured.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-mint-deep">
                ادامه خبر
                <ArrowLeft className="size-4 transition group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
            >
              <ArticleCover
                article={newsAsArticle(item)}
                className="aspect-[16/10]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                  <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-pine dark:bg-mint">
                    {item.category}
                  </span>
                  {item.dateLabel ? <span>{item.dateLabel}</span> : null}
                </div>
                <h2 className="mt-3 text-lg font-bold leading-8 text-ink transition group-hover:text-mint-deep">
                  {item.title}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                  {item.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mint-deep">
                  ادامه خبر
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

export function NewsDetail({
  item,
  related,
}: {
  item: NewsItem;
  related: NewsItem[];
}) {
  const blocks =
    item.blocks?.length
      ? item.blocks
      : item.body
        ? [{ type: "paragraph" as const, text: item.body }]
        : item.description
          ? [{ type: "paragraph" as const, text: item.description }]
          : [];
  const hasHeadings = blocks.some((b) => b.type === "h2" || b.type === "h3");

  return (
    <div>
      <header className="relative isolate min-h-[18rem] overflow-hidden bg-pine sm:min-h-[22rem]">
        <ArticleCover
          article={newsAsArticle(item)}
          priority
          className="absolute inset-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/15" aria-hidden />
        <div className="content-wide relative flex min-h-[18rem] flex-col justify-end pb-8 pt-6 sm:min-h-[22rem] sm:pb-10">
          <nav aria-label="مسیر" className="mb-5 text-xs text-white/75">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  خانه
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/news" className="hover:text-white">
                  اخبار
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="line-clamp-1 text-white/90">{item.title}</li>
            </ol>
          </nav>
          <div className="flex flex-wrap gap-2 text-xs text-white/85">
            {item.category ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                <Newspaper className="size-3.5" aria-hidden />
                {item.category}
              </span>
            ) : null}
            {item.dateLabel ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden />
                {item.dateLabel}
              </span>
            ) : null}
          </div>
          <h1 className="text-display mt-4 max-w-3xl text-3xl text-white sm:text-4xl">{item.title}</h1>
          {item.description ? (
            <p className="mt-3 max-w-2xl text-sm leading-8 text-white/85">{item.description}</p>
          ) : null}
        </div>
      </header>

      {item.author ? (
        <div className="border-b border-ink/10 bg-cream/60">
          <div className="content-wide flex items-center gap-2 py-3 text-xs text-ink-muted">
            <User className="size-3.5 text-mint-deep" aria-hidden />
            {item.author}
          </div>
        </div>
      ) : null}

      <article className="content-wide section-pad !pt-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
          <div>
            <FadeIn>
              <BodyBlocks blocks={blocks} />
            </FadeIn>
            {item.relatedEventSlug ? (
              <Link
                href={`/events/${item.relatedEventSlug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-pine/20 bg-mint-soft/60 px-5 py-4 text-sm font-semibold text-pine transition hover:border-pine/40"
              >
                <CalendarDays className="size-4" aria-hidden />
                مشاهده رویداد مرتبط
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-3 border-t border-ink/10 pt-8">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold hover:border-pine/35 hover:text-pine"
              >
                <ArrowLeft className="size-4 rotate-180" aria-hidden />
                همه اخبار
              </Link>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine-dark"
              >
                مجله
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          <aside className="mt-10 hidden space-y-4 lg:mt-0 lg:block">
            <div className="sticky top-24 space-y-4">
              {hasHeadings ? (
                <div className="rounded-2xl border border-ink/10 bg-surface p-5">
                  <p className="text-xs font-semibold text-ink">در این خبر</p>
                  <nav className="mt-3 space-y-1.5">
                    {blocks.map((block, index) => {
                      if (block.type !== "h2" && block.type !== "h3") return null;
                      return (
                        <a
                          key={index}
                          href={`#section-${index + 1}`}
                          className="block rounded-lg px-2 py-1.5 text-xs text-ink-muted hover:bg-mint-soft/50 hover:text-pine"
                        >
                          {articleBlockNavLabel(block, index, (i) => `بخش ${toPersianDigits(i + 1)}`)}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              ) : null}
              <div className="rounded-2xl border border-ink/10 bg-surface p-5 text-xs text-ink-muted">
                <p className="font-semibold text-ink">اطلاعات</p>
                <dl className="mt-3 space-y-2">
                  {item.dateLabel ? (
                    <div className="flex justify-between gap-2">
                      <dt>تاریخ</dt>
                      <dd className="font-medium text-ink">{item.dateLabel}</dd>
                    </div>
                  ) : null}
                  {item.category ? (
                    <div className="flex justify-between gap-2">
                      <dt>موضوع</dt>
                      <dd className="font-medium text-ink">{item.category}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-ink/10 pt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-display text-2xl text-ink">اخبار مرتبط</h2>
              <Link href="/news" className="text-sm font-semibold text-mint-deep hover:text-pine">
                همه اخبار
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <Link
                  key={n.id}
                  href={`/news/${n.slug}`}
                  className="group overflow-hidden rounded-2xl border border-ink/10 bg-surface transition hover:border-pine/35"
                >
                  <ArticleCover
                    article={newsAsArticle(n)}
                    className="aspect-[16/10]"
                    sizes="33vw"
                  />
                  <div className="p-4">
                    <p className="text-[11px] text-mint-deep">{n.category}</p>
                    <h3 className="mt-1 font-semibold leading-7 group-hover:text-pine">{n.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}
