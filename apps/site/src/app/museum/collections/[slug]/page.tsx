import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: "مجموعه موزه",
    description: "صفحهٔ مجموعه موزه.",
    path: `/museum/collections/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  await params;
  return (
    <ComingSoonPage
      title="مجموعه موزه"
      description="این بخش در مسیر فعلی سایت فعال نیست؛ محتوای موزه بعداً تکمیل می‌شود."
      breadcrumbs={[
        { label: "خانه", href: "/" },
        { label: "موزه", href: "/museum" },
        { label: "مجموعه‌ها", href: "/museum/collections" },
        { label: "مجموعه" },
      ]}
    />
  );
}
