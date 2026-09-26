import type { Metadata } from "next";
import Link from "next/link";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listCollaborateOptions } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

const kindLabels: Record<string, string> = {
  volunteer: "داوطلبی",
  partner: "شراکت",
  research: "پژوهش",
  "donate-artifact": "اهدای اثر",
  corporate: "شرکتی",
};

export const metadata: Metadata = buildPageMetadata({
  title: "همکاری",
  description: "راه‌های همکاری داوطلبانه، سازمانی و پژوهشی با بنیاد.",
  path: "/collaborate",
});

export default async function CollaboratePage() {
  const options = await listCollaborateOptions();

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "همکاری" }]}
        eyebrow="همراهی"
        title="همکاری با بنیاد"
        description="داوطلبی، شراکت سازمانی، همکاری پژوهشی، اهدای سند و اثر، یا حمایت شرکتی — مسیر مناسب خود را انتخاب کنید."
        actions={
          <>
            <Link
              href="/contact"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              ارتباط برای همکاری
            </Link>
            <Link
              href="/support"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              راه‌های حمایت
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <ContentCardGrid
          items={options.map((opt) => ({
            key: opt.id,
            href: "/contact",
            title: opt.title,
            description: opt.description,
            badge: kindLabels[opt.kind] ?? "همکاری",
          }))}
        />
      </div>
    </div>
  );
}
