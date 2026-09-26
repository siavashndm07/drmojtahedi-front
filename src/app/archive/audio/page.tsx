import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "آرشیو صوتی",
  description: "فایل‌های صوتی آرشیو.",
  path: "/archive/audio",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="آرشیو صوتی"
      description="فایل‌های صوتی آرشیو."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آرشیو", href: "/archive" }, { label: "صوتی" }]}
      links={undefined}
    />
  );
}
