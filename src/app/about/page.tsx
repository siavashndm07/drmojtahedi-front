import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Compass, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { IconBadge } from "@/components/ui/IconBadge";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "درباره دکتر مجتهدی",
  description:
    "درباره دکتر محمدعلی مجتهدی گیلانی — معلم البرز و بنیان‌گذار دانشگاه صنعتی شریف.",
  path: "/about",
});

const gateways = [
  {
    href: "/about/biography",
    title: "زندگی‌نامه",
    description: "از لاهیجان تا سوربن، البرز و تأسیس دانشگاه شریف.",
    icon: BookOpen,
  },
  {
    href: "/about/timeline",
    title: "خط زمان",
    description: "نقاط عطف زندگی و مسئولیت‌های آموزشی — تعاملی و خوانا.",
    icon: Compass,
  },
  {
    href: "/about/legacy",
    title: "میراث",
    description: "میراث البرز، شریف و پیوند با مجموعهٔ فرهنگی امروز.",
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "دکتر مجتهدی" }]}
        eyebrow="دکتر مجتهدی"
        title={siteConfig.personTitle}
        description={`${siteConfig.personRoles.slice(0, 2).join(" · ")}. ${siteConfig.birthYear}–${siteConfig.deathYear}. از اینجا زندگی‌نامه، خط زمان و میراث او را بپیمایید.`}
      />
      <div className="content-shell section-pad !pt-8">
        <FadeIn>
          <div className="grid gap-4 md:grid-cols-3">
            {gateways.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-48 flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
              >
                <IconBadge icon={item.icon} />
                <div>
                  <h2 className="text-xl font-medium group-hover:text-pine">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-ink-muted">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
