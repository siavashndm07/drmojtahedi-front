import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "راهنمای بازدید",
  description: "ساعات، مسیر دسترسی و امکانات بازدید.",
  path: "/visit",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="راهنمای بازدید"
      description="ساعات، مسیر دسترسی و امکانات بازدید."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "بازدید" }]}
      links={undefined}
    />
  );
}
