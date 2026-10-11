import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/magazine/ArticleDetail";
import {
  getArticle,
  listArticles,
  relatedArticles,
} from "@/lib/api/magazine";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await listArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return buildPageMetadata({
      title: "مقاله یافت نشد",
      path: `/magazine/${slug}`,
    });
  }
  return buildPageMetadata({
    title: article.title,
    description: article.description ?? article.subtitle,
    path: `/magazine/${article.slug}`,
  });
}

export default async function MagazineArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, all] = await Promise.all([getArticle(slug), listArticles()]);
  if (!article) notFound();

  const related = relatedArticles(all, article.id);

  return <ArticleDetail article={article} related={related} />;
}
