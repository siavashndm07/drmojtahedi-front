import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "پیشرفت ساخت",
  description: "چشم‌انداز پروژه و به‌روزرسانی‌های ساخت.",
  path: "/construction",
});

export default function Page() {
  return (
    <ComingSoonPage
      title="پیشرفت ساخت"
      description="چشم‌انداز پروژه و به‌روزرسانی‌های ساخت."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "پیشرفت ساخت" }]}
      links={undefined}
    />
  );
}
