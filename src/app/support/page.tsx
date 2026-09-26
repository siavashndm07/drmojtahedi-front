import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "حمایت از مجموعه",
  description: "راه‌های حمایت مالی و اهدای آثار.",
  path: "/support",
});

const ways = [
  {
    title: "کمک‌های خیرخواهانه",
    description: "حمایت مالی از برنامه‌های آموزشی و فرهنگی عام‌المنفعه.",
    href: "/contact",
  },
  {
    title: "اهدای سند و کتاب",
    description: "سپردن اسناد، عکس و کتاب به آرشیو بنیاد.",
    href: "/collaborate",
  },
  {
    title: "پیوستن به حامیان",
    description: "اسپانسرشیپ فردی یا سازمانی برنامه‌ها.",
    href: "/sponsors",
  },
  {
    title: "همکاری داوطلبانه",
    description: "همراهی در رویداد، آرشیو و راهنمایی بازدید.",
    href: "/collaborate",
  },
];

export default function SupportPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "حمایت" }]}
        eyebrow="حمایت"
        title="حمایت از مجموعه"
        description="حمایت مالی، اهدای سند و کتاب، سپردن آثار، یا همراهی داوطلبانه."
        actions={
          <Link
            href="/collaborate"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            مسیرهای همکاری
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {ways.map((way) => (
              <li key={way.title}>
                <Link
                  href={way.href}
                  className="group block h-full rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
                >
                  <h2 className="text-lg font-medium group-hover:text-pine">{way.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{way.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </div>
  );
}
