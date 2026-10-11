import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetail } from "@/components/news/NewsViews";
import { getNewsItem, listNews, relatedNews } from "@/lib/api/news";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await listNews();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) {
    return buildPageMetadata({ title: "خبر یافت نشد", path: `/news/${slug}` });
  }
  return buildPageMetadata({
    title: item.title,
    description: item.description,
    path: `/news/${item.slug}`,
  });
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const [item, all] = await Promise.all([getNewsItem(slug), listNews()]);
  if (!item) notFound();
  return <NewsDetail item={item} related={relatedNews(all, item.id)} />;
}
