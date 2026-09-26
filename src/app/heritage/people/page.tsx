import type { Metadata } from "next";
import Link from "next/link";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listPeople } from "@/lib/api/people";
import { buildPageMetadata } from "@/lib/seo/metadata";

const kindLabels: Record<string, string> = {
  student: "شاگرد",
  colleague: "همکار",
  founder: "مؤسس",
  family: "خانواده",
  organ: "ارکان",
  other: "مرتبط",
};

export const metadata: Metadata = buildPageMetadata({
  title: "افراد",
  description: "دایرکتوری افراد مرتبط با میراث دکتر مجتهدی.",
  path: "/heritage/people",
});

export default async function PeoplePage() {
  const people = await listPeople();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "میراث و تاریخ", href: "/heritage" },
          { label: "افراد" },
        ]}
        eyebrow="شبکهٔ انسانی"
        title="افراد"
        description="شاگردان، همکاران، خانواده و چهره‌های مرتبط با مسیر زندگی و میراث دکتر مجتهدی."
        actions={
          <Link
            href="/heritage/students"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            فقط شاگردان
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          items={people.map((person) => ({
            key: person.id,
            href: `/heritage/people/${person.slug}`,
            title: person.name,
            description: person.description,
            meta: person.role,
            badge: person.kind ? kindLabels[person.kind] : undefined,
            comingSoon: person.status === "coming-soon",
          }))}
        />
      </div>
    </div>
  );
}
