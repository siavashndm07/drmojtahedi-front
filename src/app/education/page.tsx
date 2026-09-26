import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { GatewayGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "آموزش",
  description: "برنامه‌ها، کارگاه‌ها، منابع آموزشی و ارزیابی مدیران.",
  path: "/education",
});

const gateways = [
  {
    href: "/education/courses",
    title: "دوره‌ها",
    description: "مسیرهای آموزشی بنیاد.",
    icon: BookOpen,
  },
  {
    href: "/education/workshops",
    title: "کارگاه‌ها",
    description: "تجربه‌های تعاملی کوتاه‌مدت.",
    icon: MessagesSquare,
  },
  {
    href: "/education/assessment",
    title: "ارزیابی مدیران",
    description: "مرکز ارزیابی و توسعهٔ مدیران.",
    icon: Sparkles,
  },
  {
    href: "/education/resources",
    title: "منابع",
    description: "مطالب و بسته‌های آموزشی.",
    icon: GraduationCap,
  },
];

export default function EducationPage() {
  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "آموزش" }]}
        eyebrow="برنامه‌های یادگیری"
        title="آموزش"
        description="دوره‌ها، کارگاه‌ها، منابع و مرکز ارزیابی مدیران — در امتداد مأموریت آموزشی بنیاد."
        actions={
          <Link
            href="/education/assessment"
            className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
          >
            مرکز ارزیابی مدیران
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <GatewayGrid items={gateways} />
      </div>
    </div>
  );
}
