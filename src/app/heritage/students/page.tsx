import type { Metadata } from "next";
import Link from "next/link";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listStudents } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "شاگردان",
  description:
    "شاگردان و دانش‌آموختگان مرتبط با دکتر مجتهدی و دبیرستان البرز.",
  path: "/heritage/students",
});

export default async function StudentsPage() {
  const students = await listStudents();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "دکتر مجتهدی", href: "/about" },
          { label: "شاگردان" },
        ]}
        eyebrow="میراث انسانی"
        title="شاگردان"
        description="نسل‌هایی از دانش‌آموزان البرز و دانش‌آموختگان مرتبط با مسیر آموزشی دکتر مجتهدی. فهرست به‌تدریج از آرشیو و خاطرات تکمیل می‌شود."
        actions={
          <>
            <Link
              href="/heritage/people"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              همهٔ افراد
            </Link>
            <Link
              href="/memories"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              ارسال خاطره
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          items={students.map((person) => ({
            key: person.id,
            href: `/heritage/people/${person.slug}`,
            title: person.name,
            description: person.description,
            meta: person.role,
            badge: "شاگرد",
            comingSoon: person.status === "coming-soon",
          }))}
        />
      </div>
    </div>
  );
}
