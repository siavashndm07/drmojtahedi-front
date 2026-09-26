import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug?: string; event?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const key = resolved.slug ?? resolved.event ?? "item";
  return buildPageMetadata({
    title: `جزئیات مجموعه · ${key}`,
    description: "صفحه جزئیات مجموعه موزه.",
    path: "/museum/collections/" + key,
  });
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const key = resolved.slug ?? resolved.event ?? "item";
  return (
    <ComingSoonPage
      title={`جزئیات مجموعه: ${key}`}
      description="صفحه جزئیات مجموعه موزه."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "مجموعه‌ها", href: "/museum/collections" }, { label: "جزئیات" }]}
    />
  );
}
