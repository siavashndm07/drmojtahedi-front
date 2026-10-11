import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Lightbulb,
  Sparkles,
  User,
} from "lucide-react";
import { ArticleCover } from "@/components/magazine/ArticleCover";
import { ArticleReadingProgress } from "@/components/magazine/ArticleReadingProgress";
import { FadeIn } from "@/components/shared/FadeIn";
import { siteConfig } from "@/config/site";
import {
  articleBlockNavLabel,
  articleBlocks,
  listItemsFromBlock,
  parseArticleInline,
} from "@/lib/magazine/blocks";
import type { Article, ArticleBodyBlock } from "@/lib/types";
import { toPersianDigits } from "@/lib/utils/digits";

function sectionLabel(index: number): string {
  return `بخش ${toPersianDigits(index + 1)}`;
}

function ArticleInlineText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const parts = parseArticleInline(text);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.kind === "link") {
          const external = part.href.startsWith("http");
          return (
            <Link
              key={`${part.href}-${index}`}
              href={part.href}
              className="font-semibold text-pine underline decoration-pine/30 underline-offset-4 transition hover:decoration-pine"
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {part.label}
            </Link>
          );
        }
        return <span key={`t-${index}`}>{part.value}</span>;
      })}
    </span>
  );
}

function ArticleBlockView({
  block,
  index,
}: {
  block: ArticleBodyBlock;
  index: number;
}) {
  const sectionId = `section-${index + 1}`;

  if (block.type === "tip") {
    return (
      <aside
        id={sectionId}
        className="scroll-mt-28 rounded-2xl border border-pine/20 bg-mint-soft/70 p-5 dark:bg-mint/30 sm:p-6"
      >
        <div className="flex gap-3">
          <Lightbulb
            className="mt-0.5 size-5 shrink-0 text-pine"
            aria-hidden
          />
          <div>
            <p className="text-xs font-semibold text-pine">ادامهٔ مسیر</p>
            <p className="mt-2 text-justify text-sm leading-8 text-ink sm:text-[0.95rem] sm:leading-9">
              <ArticleInlineText text={block.text} />
            </p>
          </div>
        </div>
      </aside>
    );
  }

  if (block.type === "h2") {
    return (
      <h2
        id={sectionId}
        className="scroll-mt-28 text-display text-2xl leading-10 text-ink sm:text-[1.75rem]"
      >
        <ArticleInlineText text={block.text} />
      </h2>
    );
  }

  if (block.type === "h3") {
    return (
      <h3
        id={sectionId}
        className="scroll-mt-28 text-xl font-bold leading-9 text-ink sm:text-[1.35rem]"
      >
        <ArticleInlineText text={block.text} />
      </h3>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        id={sectionId}
        className="scroll-mt-28 border-s-4 border-pine/40 bg-mint-soft/40 px-5 py-4 text-sm leading-8 text-ink dark:bg-mint/20 sm:text-[0.95rem] sm:leading-9"
      >
        <ArticleInlineText text={block.text} />
      </blockquote>
    );
  }

  if (block.type === "ul" || block.type === "ol") {
    const items = listItemsFromBlock(block.text);
    const ListTag = block.type === "ol" ? "ol" : "ul";
    return (
      <ListTag
        id={sectionId}
        className={`scroll-mt-28 space-y-2 text-sm leading-8 text-ink-muted sm:text-[0.95rem] sm:leading-9 ${
          block.type === "ol"
            ? "list-decimal ps-5"
            : "list-disc ps-5 marker:text-pine"
        }`}
      >
        {items.map((item) => (
          <li key={item}>
            <ArticleInlineText text={item} />
          </li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "image") {
    const src = block.src?.trim();
    if (!src) return null;
    const caption = block.text.trim() || block.alt?.trim() || "";
    return (
      <figure id={sectionId} className="scroll-mt-28">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-ink/10 bg-cream">
          <Image
            src={src}
            alt={caption || ""}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        </div>
        {caption ? (
          <figcaption className="mt-3 text-center text-xs leading-6 text-ink-muted sm:text-sm">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  const isIntro = index === 0;
  return (
    <section id={sectionId} className="scroll-mt-28">
      <p
        className={
          isIntro
            ? "text-justify text-base font-medium leading-9 text-ink sm:text-lg sm:leading-10"
            : "text-justify text-sm leading-8 text-ink-muted sm:text-[0.95rem] sm:leading-9"
        }
      >
        <ArticleInlineText text={block.text} />
      </p>
    </section>
  );
}

export function ArticleDetail({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const blocks = articleBlocks(article);
  const author = article.author ?? "تحریریهٔ بنیاد";
  const hasHeadings = blocks.some(
    (block) => block.type === "h2" || block.type === "h3",
  );
  const minutes = article.readingTimeMinutes ?? 5;

  return (
    <>
      <ArticleReadingProgress />

      <header className="relative isolate min-h-[22rem] overflow-hidden bg-pine sm:min-h-[26rem] lg:min-h-[28rem]">
        <ArticleCover
          article={article}
          priority
          className="absolute inset-0"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-l from-pine/35 to-transparent mix-blend-multiply"
          aria-hidden
        />

        <div className="content-wide relative flex min-h-[22rem] flex-col justify-end pb-8 pt-6 sm:min-h-[26rem] sm:pb-10 lg:min-h-[28rem] lg:pb-12">
          <nav aria-label="مسیر" className="mb-6 text-xs text-white/75">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-white">
                  خانه
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li>
                <Link href="/magazine" className="transition hover:text-white">
                  مجله
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li className="line-clamp-1 text-white/90">{article.title}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-white/85">
              {article.category ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-medium backdrop-blur-sm">
                  <BookOpen className="size-3.5" aria-hidden />
                  {article.category}
                </span>
              ) : null}
              {article.dateLabel ? (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" aria-hidden />
                  {article.dateLabel}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden />
                {toPersianDigits(minutes)} دقیقه مطالعه
              </span>
            </div>

            <h1 className="text-display mt-4 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {article.title}
            </h1>
            {article.subtitle ? (
              <p className="mt-2 text-base font-medium text-white/90 sm:text-lg">
                {article.subtitle}
              </p>
            ) : null}
            {article.description ? (
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/85 sm:text-base">
                {article.description}
              </p>
            ) : null}

            {article.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="border-b border-ink/10 bg-cream/60 dark:bg-surface/40">
        <div className="content-wide flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3.5 text-mint-deep" aria-hidden />
            {author}
          </span>
          <span className="inline-flex items-center gap-1.5 lg:hidden">
            <Clock className="size-3.5" aria-hidden />
            {toPersianDigits(minutes)} دقیقه
          </span>
        </div>
      </div>

      <article
        id="article-content"
        className="content-wide pb-8 pt-10 lg:pb-12 lg:pt-12"
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-16">
          <div className="min-w-0">
            <FadeIn>
              <div className="relative overflow-hidden rounded-2xl border border-pine/15 bg-gradient-to-br from-mint-soft/80 to-surface p-6 dark:from-mint/30 sm:p-7">
                <div
                  className="absolute -start-6 -top-6 size-24 rounded-full bg-mint/30 blur-2xl"
                  aria-hidden
                />
                <div className="relative flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pine text-white">
                    <Sparkles className="size-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-mint-deep">
                      خلاصه مطلب
                    </p>
                    <p className="mt-2 text-justify text-sm leading-8 text-ink sm:text-[0.95rem]">
                      {article.description}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="mt-10 space-y-8">
              {blocks.map((block, index) => (
                <FadeIn key={`section-${index + 1}`} delayMs={index * 40}>
                  <ArticleBlockView block={block} index={index} />
                </FadeIn>
              ))}
            </div>

            <FadeIn>
              <div className="mt-10 flex items-start gap-4 rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-mint-soft text-sm font-bold text-pine dark:bg-mint">
                  {author.slice(0, 1)}
                </div>
                <div>
                  <p className="text-xs text-ink-muted">نوشته شده توسط</p>
                  <p className="mt-1 font-semibold text-ink">{author}</p>
                  <p className="mt-2 text-xs leading-7 text-ink-muted">
                    تیم محتوای {siteConfig.name} — روایت میراث آموزشی{" "}
                    {siteConfig.personName}.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="mt-10 flex flex-col gap-3 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/magazine"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine/35 hover:text-pine sm:w-auto"
                >
                  <ArrowLeft className="size-4 rotate-180" aria-hidden />
                  بازگشت به مجله
                </Link>
                <Link
                  href="/about/biography"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pine-dark sm:w-auto"
                >
                  زندگی‌نامه
                  <ArrowLeft className="size-4" aria-hidden />
                </Link>
              </div>
            </FadeIn>
          </div>

          <aside className="mt-12 hidden lg:block lg:self-stretch">
            <div className="sticky top-24 max-h-[calc(100vh-6.5rem)] space-y-6 overflow-y-auto overscroll-contain pb-2 [scrollbar-width:thin]">
              <div className="rounded-2xl border border-ink/10 bg-surface p-5">
                <p className="text-xs font-semibold text-ink">در این مقاله</p>
                <nav aria-label="فهرست مقاله" className="mt-4 space-y-2">
                  {blocks.map((block, index) => {
                    const include =
                      block.type === "h2" ||
                      block.type === "h3" ||
                      block.type === "tip" ||
                      (!hasHeadings && block.type === "paragraph") ||
                      (hasHeadings && block.type === "paragraph" && index === 0);
                    if (!include) return null;
                    return (
                      <a
                        key={`nav-${index}`}
                        href={`#section-${index + 1}`}
                        className="block rounded-lg px-2 py-1.5 text-xs leading-6 text-ink-muted transition hover:bg-mint-soft/50 hover:text-pine dark:hover:bg-mint/30"
                      >
                        {articleBlockNavLabel(block, index, sectionLabel)}
                      </a>
                    );
                  })}
                </nav>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-surface p-5">
                <p className="text-xs font-semibold text-ink">اطلاعات</p>
                <dl className="mt-3 space-y-2.5 text-xs text-ink-muted">
                  <div className="flex justify-between gap-3">
                    <dt>زمان مطالعه</dt>
                    <dd className="font-medium text-ink">
                      {toPersianDigits(minutes)} دقیقه
                    </dd>
                  </div>
                  {article.dateLabel ? (
                    <div className="flex justify-between gap-3">
                      <dt>تاریخ</dt>
                      <dd className="font-medium text-ink">{article.dateLabel}</dd>
                    </div>
                  ) : null}
                  {article.category ? (
                    <div className="flex justify-between gap-3">
                      <dt>موضوع</dt>
                      <dd className="font-medium text-ink">{article.category}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div className="overflow-hidden rounded-2xl border border-pine/15">
                <div className="bg-pine p-5 text-white">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                    <Compass className="size-3.5" aria-hidden />
                    مسیر مرتبط
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-7">
                    خط زمان و زندگی‌نامه را در کنار این مطلب بخوانید.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/about/timeline"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-mint-soft transition hover:text-white"
                    >
                      خط زمان
                      <ArrowLeft className="size-3.5" aria-hidden />
                    </Link>
                    <Link
                      href="/archive"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-mint-soft transition hover:text-white"
                    >
                      آرشیو
                      <ArrowLeft className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <FadeIn>
            <section className="mt-16 border-t border-ink/10 pt-12 lg:mt-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">ادامه مطالعه</p>
                  <h2 className="text-display mt-2 text-2xl text-ink">مقالات مرتبط</h2>
                </div>
                <Link
                  href="/magazine"
                  className="text-sm font-semibold text-mint-deep transition hover:text-pine"
                >
                  همه مقالات
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/magazine/${item.slug}`}
                    className="group grid overflow-hidden rounded-3xl border border-pine/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-card sm:grid-cols-[9rem_1fr]"
                  >
                    <ArticleCover
                      article={item}
                      className="aspect-[16/10] sm:aspect-auto sm:min-h-full"
                      sizes="200px"
                    />
                    <div className="flex flex-col justify-center p-5">
                      <p className="text-[11px] font-medium text-mint-deep">
                        {item.category}
                      </p>
                      <h3 className="mt-2 font-bold leading-7 text-ink transition group-hover:text-mint-deep">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-ink-muted">
                        {item.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-mint-deep">
                        {toPersianDigits(item.readingTimeMinutes ?? 5)} دقیقه
                        <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </FadeIn>
        ) : null}
      </article>
    </>
  );
}
