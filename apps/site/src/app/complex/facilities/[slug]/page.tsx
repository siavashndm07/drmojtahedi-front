import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: "فضای مجموعه",
    description: "صفحهٔ فضا.",
    path: `/complex/facilities/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  await params;
  return (
    <ComingSoonPage
      title="فضای مجموعه"
      description="این بخش در مسیر فعلی سایت فعال نیست."
      breadcrumbs={[
        { label: "خانه", href: "/" },
        { label: "پروژه‌ها", href: "/projects" },
        { label: "فضا" },
      ]}
      links={[{ href: "/projects", label: "پروژه‌های بنیاد" }]}
    />
  );
}
