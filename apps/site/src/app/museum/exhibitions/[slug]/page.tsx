import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: "نمایشگاه",
    description: "صفحهٔ نمایشگاه.",
    path: `/museum/exhibitions/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  await params;
  return (
    <ComingSoonPage
      title="نمایشگاه"
      description="این بخش در مسیر فعلی سایت فعال نیست؛ نمایشگاه‌ها بعداً تکمیل می‌شوند."
      breadcrumbs={[
        { label: "خانه", href: "/" },
        { label: "موزه", href: "/museum" },
        { label: "نمایشگاه‌ها", href: "/museum/exhibitions" },
        { label: "نمایشگاه" },
      ]}
    />
  );
}
