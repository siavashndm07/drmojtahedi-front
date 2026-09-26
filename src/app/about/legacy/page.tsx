import type { Metadata } from "next";
import Link from "next/link";
import {
  EditorialQuote,
  RelatedContent,
} from "@/components/shared/ContentExtras";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "میراث",
  description:
    "میراث آموزشی و نهادی دکتر محمدعلی مجتهدی گیلانی — البرز، شریف و نسل دانش‌آموختگان.",
  path: "/about/legacy",
});

export default function LegacyPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "دکتر مجتهدی", href: "/about" },
          { label: "میراث" },
        ]}
        eyebrow="میراث"
        title="از کلاس درس تا دانشگاه ملی"
        description="میراث دکتر مجتهدی در دو ستون اصلی دیده می‌شود: پرورش انسان در دبیرستان البرز، و بنیان‌گذاری دانشگاهی که امروز شریف نام دارد."
      />
      <div className="content-shell section-pad !pt-8 space-y-12">
        <FadeIn>
          <EditorialQuote attribution="عنوان کتاب خاطرات و گفتارهای او">
            به مملکتتون خدمت کنید.
          </EditorialQuote>
        </FadeIn>
        <FadeIn>
          <div className="grid gap-6 md:grid-cols-2">
            <section className="border border-ink/10 bg-surface p-6 md:p-8">
              <h2 className="text-display text-xl">میراث البرز</h2>
              <p className="mt-3 text-sm leading-8 text-ink-muted">
                حدود ۳۴ سال ریاست دبیرستان البرز، استاندارد علمی و انضباطی‌ای ساخت که نسل‌هایی
                از دانش‌آموزان — بسیاری از آنان بعدها استاد، مهندس و مدیر شدند — از آن گذشتند.
                نام مجتهدی و البرز برای ایرانیان هم‌معنا مانده است.
              </p>
              <Link href="/education" className="mt-5 inline-flex text-sm font-medium text-pine hover:underline">
                بخش آموزش
              </Link>
            </section>
            <section className="border border-ink/10 bg-surface p-6 md:p-8">
              <h2 className="text-display text-xl">میراث شریف</h2>
              <p className="mt-3 text-sm leading-8 text-ink-muted">
                تأسیس دانشگاه صنعتی آریامهر (شریف) در ۱۳۴۴–۱۳۴۵، نهاد آموزش عالی مهندسی ایران
                را دگرگون کرد. {siteConfig.personName} نخستین نایب‌التولیهٔ این دانشگاه بود.
              </p>
              <Link href="/about/timeline" className="mt-5 inline-flex text-sm font-medium text-pine hover:underline">
                خط زمان نهادها
              </Link>
            </section>
          </div>
        </FadeIn>
        <FadeIn>
          <section className="border border-ink/10 bg-mint-soft/50 p-6 md:p-8">
            <h2 className="text-display text-xl">مجموعهٔ فرهنگی امروز</h2>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-ink-muted">
              بنیاد فرهنگی دکتر مجتهدی این میراث را در قالب موزه، آرشیو دیجیتال، آموزش و
              مجموعهٔ فیزیکی ادامه می‌دهد — تا روایت یک آموزگار ملی برای نسل جدید زنده بماند.
            </p>
            <Link href="/complex" className="mt-5 inline-flex text-sm font-medium text-pine hover:underline">
              معرفی مجموعه
            </Link>
          </section>
        </FadeIn>
        <FadeIn>
          <RelatedContent
            items={[
              { href: "/about/biography", label: "زندگی‌نامه", meta: "روایت فصل‌به‌فصل" },
              { href: "/about/timeline", label: "خط زمان", meta: "مسیر تعاملی" },
              { href: "/museum", label: "موزه", meta: "تجربهٔ نمایش" },
              { href: "/archive", label: "آرشیو", meta: "اسناد و خاطرات" },
              { href: "/magazine/moalem-alborz", label: "معلم البرز", meta: "مقاله" },
              { href: "/support", label: "حمایت", meta: "همراهی با مجموعه" },
            ]}
          />
        </FadeIn>
      </div>
    </div>
  );
}
