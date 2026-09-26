import type { Metadata } from "next";
import Link from "next/link";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listBooks } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "کتاب‌ها",
  description: "کتاب‌ها و انتشارات مرتبط با دکتر مجتهدی و بنیاد.",
  path: "/library/books",
});

export default async function BooksPage() {
  const books = await listBooks();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "کتابخانه", href: "/library" },
          { label: "کتاب‌ها" },
        ]}
        eyebrow="منابع"
        title="کتاب‌ها"
        description="انتشارات و منابع مکتوب دربارهٔ زندگی، آموزش و میراث دکتر مجتهدی — از جمله «به مملکتتون خدمت کنید»."
        actions={
          <Link
            href="/library"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            کتابخانه دیجیتال
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          columns="md:grid-cols-2"
          items={books.map((book) => ({
            key: book.id,
            href: `/library/${book.slug}`,
            title: book.title,
            description: book.description,
            meta: [book.author, book.year].filter(Boolean).join(" · "),
            badge: book.itemType === "book" ? "کتاب" : "مقاله",
            comingSoon: book.status === "coming-soon",
          }))}
        />
      </div>
    </div>
  );
}
