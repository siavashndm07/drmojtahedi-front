import type { Metadata } from "next";
import { NewsIndex } from "@/components/news/NewsViews";
import { listNews } from "@/lib/api/news";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "اخبار",
  description:
    "اخبار و اطلاعیه‌های بنیاد فرهنگی دکتر مجتهدی — فراخوان‌ها، گزارش‌ها و تازه‌های مجموعه.",
  path: "/news",
});

export default async function NewsPage() {
  const items = await listNews();
  return <NewsIndex items={items} />;
}
