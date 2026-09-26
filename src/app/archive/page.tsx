import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "آرشیو دیجیتال",
  description: "اسناد، عکس‌ها، صوت و تصویر.",
  path: "/archive",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="آرشیو دیجیتال"
      description="اسناد، عکس‌ها، صوت و تصویر."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آرشیو" }]}
      links={[{ href: "/archive/documents", label: "اسناد" }, { href: "/archive/photographs", label: "عکس‌ها" }, { href: "/archive/audio", label: "صوتی" }, { href: "/archive/video", label: "تصویری" }]}
    />
  );
}
