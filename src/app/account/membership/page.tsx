import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "عضویت",
  description: "ثبت‌نام و عضویت در بنیاد فرهنگی دکتر مجتهدی.",
  path: "/account/membership",
});

const tiers = [
  {
    title: "عضو پیوسته",
    description: "عضویت فعال با دسترسی به برنامه‌ها و خبرنامهٔ اختصاصی.",
  },
  {
    title: "عضو وابسته",
    description: "همراهی علاقه‌مندان و حامیان بدون تعهد کامل عضویت پیوسته.",
  },
  {
    title: "عضو افتخاری",
    description: "تشخیص هیئت امناء برای چهره‌های فرهنگی و علمی.",
  },
  {
    title: "عضو حقوقی",
    description: "عضویت سازمان‌ها، دانشگاه‌ها و مؤسسات همکار.",
  },
];

export default function MembershipPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "حساب", href: "/account" },
          { label: "عضویت" },
        ]}
        eyebrow="عضویت در بنیاد"
        title="ثبت‌نام و عضویت"
        description="انواع عضویت مطابق اساس‌نامه بنیاد. فرم آنلاین پس از اتصال سامانهٔ حساب کاربری فعال می‌شود."
        actions={
          <>
            <Link
              href="/account/register"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              شروع ثبت‌نام
            </Link>
            <Link
              href="/foundation/charter"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              اساس‌نامه
            </Link>
          </>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <li
                key={tier.title}
                className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm"
              >
                <h2 className="text-lg font-medium text-ink">{tier.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{tier.description}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </div>
  );
}
