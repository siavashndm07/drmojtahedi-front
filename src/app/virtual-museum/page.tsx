import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "موزه مجازی",
  description: "این بخش در حال توسعه است.",
  path: "/virtual-museum",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="موزه مجازی"
      description="این بخش در حال توسعه است."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "موزه مجازی" }]}
      links={undefined}
    />
  );
}
