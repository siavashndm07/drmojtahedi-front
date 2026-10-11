import type { Metadata } from "next";
import Link from "next/link";
import { DonateForm } from "@/components/account/DonateForm";
import { FadeIn } from "@/components/shared/FadeIn";
import { siteConfig } from "@/config/site";
import { COVER_IMAGES } from "@/lib/mock/covers";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "کمک‌های خیرخواهانه",
  description: "حمایت مالی از برنامه‌های عام‌المنفعهٔ بنیاد فرهنگی دکتر مجتهدی.",
  path: "/donate",
});

export default function DonatePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${COVER_IMAGES.heritage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-l from-pine-dark/92 via-pine-dark/85 to-pine/75" />
        <div className="content-shell relative section-pad !py-14 md:!py-20">
          <p className="text-xs tracking-[0.18em] text-mint-soft/80">حمایت مالی</p>
          <h1 className="text-display mt-3 max-w-2xl text-3xl text-white md:text-5xl">
            {siteConfig.shortName}
          </h1>
          <p className="mt-2 text-lg font-medium text-mint-soft">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-8 text-white/80 md:text-base">
            کمک خیرخواهانه شما مسیر برنامه‌های فرهنگی و عام‌المنفعه را ادامه
            می‌دهد. مبلغ، هدف و هویت را در چند گام کوتاه مشخص کنید.
          </p>
          <Link
            href="/support"
            className="mt-6 inline-flex text-sm font-medium text-mint-soft hover:underline"
          >
            سایر راه‌های حمایت
          </Link>
        </div>
      </section>

      <div className="content-shell section-pad">
        <FadeIn>
          <DonateForm mode="public" />
        </FadeIn>
      </div>
    </div>
  );
}
