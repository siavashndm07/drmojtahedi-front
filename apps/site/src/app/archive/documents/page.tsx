import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "اسناد",
  description: "اسناد آرشیوی.",
  path: "/archive/documents",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="اسناد"
      description="اسناد آرشیوی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آرشیو", href: "/archive" }, { label: "اسناد" }]}
      links={undefined}
    />
  );
}
