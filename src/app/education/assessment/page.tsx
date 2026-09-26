import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { getAssessment } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ارزیابی مدیران",
  description:
    "مرکز ارزیابی و توسعهٔ مدیران بنیاد فرهنگی دکتر مجتهدی.",
  path: "/education/assessment",
});

export default async function AssessmentPage() {
  const program = await getAssessment();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "آموزش", href: "/education" },
          { label: "ارزیابی مدیران" },
        ]}
        eyebrow="خدمات آموزشی"
        title={program.title}
        description={program.description}
        actions={
          <>
            <Link
              href="/contact"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              درخواست ارزیابی
            </Link>
            <Link
              href="/projects"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              پروژه‌های بنیاد
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-10">
        <FadeIn>
          <section className="rounded-2xl border border-ink/10 bg-surface p-6 md:p-8">
            <h2 className="text-display text-2xl">مخاطبان</h2>
            <p className="mt-3 text-base leading-8 text-ink-muted">
              {program.audience}
            </p>
          </section>
        </FadeIn>
        <FadeIn>
          <section>
            <h2 className="text-display text-2xl md:text-3xl">خروجی‌ها</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {(program.outcomes ?? []).map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-ink/10 bg-paper/80 px-5 py-4 text-sm leading-7 text-ink-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
