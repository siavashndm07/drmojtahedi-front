import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OralHistoryPlayer } from "@/components/oral/OralHistoryPlayer";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { getOralHistory, listOralHistory } from "@/lib/api/oralHistory";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await listOralHistory();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const interview = await getOralHistory(slug);
  if (!interview) {
    return buildPageMetadata({
      title: "مصاحبه یافت نشد",
      path: `/oral-history/${slug}`,
    });
  }
  return buildPageMetadata({
    title: interview.title,
    description: interview.description,
    path: `/oral-history/${interview.slug}`,
  });
}

export default async function OralHistoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const interview = await getOralHistory(slug);
  if (!interview) notFound();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "تاریخ شفاهی", href: "/oral-history" },
          { label: interview.title },
        ]}
        eyebrow="مصاحبه"
        title={interview.title}
        description={interview.subtitle}
        statusLabel={interview.status === "coming-soon" ? "به‌زودی" : undefined}
        actions={
          <Link
            href="/oral-history"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            همه مصاحبه‌ها
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <OralHistoryPlayer interview={interview} />
        </FadeIn>
      </div>
    </div>
  );
}
