import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

/** Placeholder titles until institution records are wired like places/people. */
const KNOWN: Record<string, string> = {
  "sharif-university": "دانشگاه صنعتی شریف",
  "alborz-high-school": "دبیرستان البرز",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = KNOWN[slug];
  if (!title) {
    return buildPageMetadata({
      title: "نهاد یافت نشد",
      path: `/heritage/institutions/${slug}`,
    });
  }
  return buildPageMetadata({
    title,
    description: "صفحهٔ نهاد مرتبط با میراث دکتر مجتهدی.",
    path: `/heritage/institutions/${slug}`,
  });
}

export default async function InstitutionPage({ params }: Props) {
  const { slug } = await params;
  const title = KNOWN[slug];
  if (!title) notFound();

  return (
    <ComingSoonPage
      title={title}
      description="محتوای کامل این نهاد به‌زودی تکمیل می‌شود."
      breadcrumbs={[
        { label: "خانه", href: "/" },
        { label: "میراث و تاریخ", href: "/heritage" },
        { label: "نهادها", href: "/heritage/institutions" },
        { label: title },
      ]}
      links={[
        { href: "/heritage/places", label: "مکان‌ها" },
        { href: "/about/timeline", label: "خط زمان" },
      ]}
    />
  );
}
