import type { Metadata } from "next";
import Link from "next/link";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { mockEducationPrograms } from "@/lib/mock";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "دوره‌ها",
  description: "دوره‌ها و مرکز توسعهٔ مهارت بنیاد فرهنگی دکتر مجتهدی.",
  path: "/education/courses",
});

const typeLabels: Record<string, string> = {
  course: "دوره",
  workshop: "کارگاه",
  lecture: "سخنرانی",
  resource: "مرکز",
};

export default function CoursesPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "آموزش", href: "/education" },
          { label: "دوره‌ها" },
        ]}
        eyebrow="خدمات آموزشی"
        title="دوره‌ها و مراکز آموزشی"
        description="بر اساس آرشیو آموزشی سایت پیشین بنیاد — از مرکز توسعهٔ مهارت تا فهرست دوره‌ها و ارزیابی مدیران."
        actions={
          <Link
            href="/education/assessment"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            مرکز ارزیابی مدیران
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          items={mockEducationPrograms.map((item) => ({
            key: item.id,
            href:
              item.slug === "arzyabi-modiran"
                ? "/education/assessment"
                : item.slug === "markaz-tosee-maharat"
                  ? "/education"
                  : "/education/courses",
            title: item.title,
            description: item.description,
            meta: item.audience,
            badge: item.programType ? typeLabels[item.programType] : "آموزش",
            comingSoon: item.status === "coming-soon",
          }))}
        />
      </div>
    </div>
  );
}
