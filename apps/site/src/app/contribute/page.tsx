import type { Metadata } from "next";
import Link from "next/link";
import { ContributeForm } from "@/components/forms/ContributeForm";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ارسال خاطره و سند",
  description:
    "خاطره، عکس، سند یا اثر مرتبط با دکتر مجتهدی و البرز را برای بررسی به بنیاد بسپارید.",
  path: "/contribute",
});

export default function ContributePage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "ارسال خاطره و سند" }]}
        eyebrow="میراث زنده"
        title="ارسال خاطره، عکس و سند"
        description="اگر خاطره‌ای از البرز یا شریف دارید، یا سندی در اختیار شماست، شرح آن را برای بررسی بنیاد ارسال کنید."
        actions={
          <>
            <Link
              href="/collaborate"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              راه‌های همکاری
            </Link>
            <Link
              href="/archive"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              آرشیو دیجیتال
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl">
            <ContributeForm />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
