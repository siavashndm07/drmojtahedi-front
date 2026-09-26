import type { Metadata } from "next";
import Link from "next/link";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listProjects } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "پروژه‌های بنیاد",
  description: "پروژه‌های فرهنگی، آموزشی و عمرانی بنیاد فرهنگی دکتر مجتهدی.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "پروژه‌های بنیاد" }]}
        eyebrow="برنامه‌ها"
        title="پروژه‌های بنیاد"
        description="از مجموعهٔ فرهنگی و مرکز ارزیابی مدیران تا توافق‌های منطقه‌ای و پلتفرم دیجیتال میراث."
        actions={
          <Link
            href="/construction"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            پیشرفت ساخت
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          columns="md:grid-cols-2"
          items={projects.map((project) => ({
            key: project.id,
            href: project.href ?? `/projects`,
            title: project.title,
            description: project.description,
            meta: [project.phase, project.location].filter(Boolean).join(" · "),
            badge: "پروژه",
            comingSoon: project.status === "coming-soon",
          }))}
        />
      </div>
    </div>
  );
}
