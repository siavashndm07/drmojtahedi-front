import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { getBook, listBooks } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const books = await listBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) {
    return buildPageMetadata({
      title: "منبع یافت نشد",
      path: `/library/${slug}`,
    });
  }
  return buildPageMetadata({
    title: book.title,
    description: book.description,
    path: `/library/${book.slug}`,
  });
}

export default async function LibraryItemPage({ params }: Props) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "کتابخانه", href: "/library" },
          { label: "کتاب‌ها", href: "/library/books" },
          { label: book.title },
        ]}
        eyebrow={book.itemType === "book" ? "کتاب" : "منبع"}
        title={book.title}
        description={book.description}
        statusLabel={book.status === "coming-soon" ? "به‌زودی" : undefined}
        actions={
          <Link
            href="/library/books"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            بازگشت به کتاب‌ها
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <article className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-surface p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {book.itemType ? <Badge tone="pine">{book.itemType}</Badge> : null}
              {book.year ? <Badge tone="bronze">{book.year}</Badge> : null}
            </div>
            {book.author ? (
              <p className="mt-4 text-sm text-ink-muted">نویسنده / گردآورنده: {book.author}</p>
            ) : null}
            {book.source ? (
              <p className="mt-2 text-xs text-ink-muted">منبع: {book.source}</p>
            ) : null}
            <p className="mt-6 text-base leading-9 text-ink-muted">{book.description}</p>
          </article>
        </FadeIn>
      </div>
    </div>
  );
}
