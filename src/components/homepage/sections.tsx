import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Clapperboard,
  FileText,
  GraduationCap,
  HandHeart,
  Landmark,
  Library,
  MessagesSquare,
  Mic,
  Newspaper,
  Theater,
  Trees,
} from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { IconBadge } from "@/components/ui/IconBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mockArticles, mockNews, mockPartnerLinks, mockSponsors } from "@/lib/mock";
import { toPersianDigits } from "@/lib/utils/digits";

function MediaTile({
  href,
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = "light",
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "light" | "dark" | "soft";
}) {
  const tones = {
    light: "border-ink/10 bg-surface hover:border-pine/40",
    dark: "border-transparent bg-pine-dark text-white hover:bg-pine",
    soft: "border-ink/10 bg-mint-soft/50 hover:border-pine/40",
  } as const;

  return (
    <Link
      href={href}
      className={`group flex min-h-44 flex-col justify-between rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-card md:min-h-52 md:p-6 ${tones[tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-xs tracking-[0.16em] ${tone === "dark" ? "text-white/55" : "text-bronze"}`}
        >
          {eyebrow}
        </p>
        <span
          className={
            tone === "dark"
              ? "inline-flex size-10 items-center justify-center rounded-xl bg-white/10 text-white"
              : "inline-flex size-10 items-center justify-center rounded-xl bg-mint-soft text-pine"
          }
        >
          <Icon className="size-4.5" strokeWidth={1.8} aria-hidden />
        </span>
      </div>
      <div>
        <h3
          className={`text-xl font-medium ${tone === "dark" ? "text-white" : "text-ink group-hover:text-pine"}`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 text-sm leading-7 ${tone === "dark" ? "text-white/70" : "text-ink-muted"}`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export function MuseumPreview() {
  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-surface/60">
        <div className="content-shell section-pad">
          <SectionHeading
            eyebrow="موزه"
            title="فضایی برای دیدن، فهمیدن و به یاد سپردن"
            description="روایت زندگی معلم البرز و بنیان‌گذار شریف — از مجموعه‌ها تا نمایشگاه‌های موضوعی."
            action={
              <Link href="/museum" className="text-sm font-medium text-pine hover:underline">
                صفحه موزه
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            <MediaTile
              href="/museum"
              eyebrow="MUSEUM"
              title="موزه"
              description="مأموریت، چشم‌انداز و مسیر بازدید."
              icon={Landmark}
              tone="dark"
            />
            <MediaTile
              href="/museum/collections"
              eyebrow="COLLECTIONS"
              title="مجموعه‌ها"
              description="اسناد، اشیاء و روایت‌های موضوعی."
              icon={Library}
            />
            <MediaTile
              href="/museum/exhibitions"
              eyebrow="EXHIBITIONS"
              title="نمایشگاه‌ها"
              description="جاری، آینده و گذشته."
              icon={Newspaper}
              tone="soft"
            />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function ComplexPreview() {
  const facilities = [
    { href: "/museum", label: "موزه", note: "نمایش و تفسیر", icon: Landmark },
    { href: "/complex/park", label: "پارک", note: "فضای عمومی", icon: Trees },
    { href: "/complex/amphitheater", label: "آمفی‌تئاتر", note: "رویداد و اجرا", icon: Theater },
    { href: "/library", label: "کتابخانه", note: "پژوهش و مطالعه", icon: Library },
    { href: "/education", label: "آموزش", note: "کارگاه و دوره", icon: GraduationCap },
    { href: "/museum/exhibitions", label: "نمایشگاه", note: "تجربهٔ موضوعی", icon: Newspaper },
  ];

  return (
    <FadeIn>
      <section className="content-shell section-pad">
        <SectionHeading
          eyebrow="مجموعه فرهنگی"
          title="چشم‌انداز یک نهاد فرهنگی زنده"
          description={`حدود ${toPersianDigits("4000")} مترمربع: موزه، پارک، آمفی‌تئاتر، کتابخانه و فضاهای آموزشی. تصاویر فعلی مفهومی‌اند.`}
          action={
            <Link href="/complex" className="text-sm font-medium text-pine hover:underline">
              معرفی مجموعه
            </Link>
          }
        />
        <div className="overflow-hidden rounded-2xl border border-ink/10">
          <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="group flex min-h-28 items-center justify-between gap-4 bg-paper px-5 py-5 transition-colors hover:bg-mint-soft/60"
              >
                <div className="flex items-center gap-3">
                  <IconBadge icon={item.icon} />
                  <div>
                    <p className="text-lg font-medium text-ink group-hover:text-pine">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">{item.note}</p>
                  </div>
                </div>
                <span className="text-xs text-bronze">تصویر مفهومی</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function ArchiveHighlights() {
  const items = [
    { href: "/archive/photographs", title: "عکس", hint: "نگاه آرشیوی", icon: Camera },
    { href: "/archive/documents", title: "سند", hint: "متن و گواهی", icon: FileText },
    { href: "/archive/audio", title: "صوت", hint: "روایت شنیداری", icon: Mic },
    { href: "/archive/video", title: "تصویر", hint: "مستند و فیلم", icon: Clapperboard },
  ];

  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-[linear-gradient(180deg,rgb(var(--accent-soft)/0.45),rgb(var(--paper)))]">
        <div className="content-shell section-pad">
          <SectionHeading
            eyebrow="آرشیو"
            title="اسناد، خاطرات و روایت شفاهی"
            description="از خاطرات چاپ‌شده تا عکس‌های دورهٔ البرز — گنجینه‌ای برای پژوهش دربارهٔ مجتهدی، البرز و شریف."
            action={
              <Link href="/archive" className="text-sm font-medium text-pine hover:underline">
                ورود به آرشیو
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <div
                  className="flex aspect-[5/4] items-end justify-between p-4"
                  style={{
                    background: `linear-gradient(160deg, rgb(var(--accent-soft)), rgb(var(--paper)) ${40 + index * 10}%)`,
                  }}
                >
                  <Badge tone="pine">آرشیو</Badge>
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface/90 text-pine shadow-sm">
                    <item.icon className="size-4.5" strokeWidth={1.8} aria-hidden />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium group-hover:text-pine">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.hint}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function NewsPreview() {
  const items = mockNews.slice(0, 3);

  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-[linear-gradient(180deg,rgb(var(--accent-soft)/0.4),rgb(var(--paper)))]">
        <div className="content-shell section-pad">
          <SectionHeading
            eyebrow="اخبار"
            title="تازه‌های بنیاد"
            description="اطلاعیه‌ها، فراخوان‌ها و گزارش‌های مجموعه — جدا از مقالات بلند مجله."
            action={
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-medium text-pine hover:underline"
              >
                <Newspaper className="size-4" aria-hidden />
                همه اخبار
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-card"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                  <Badge tone={item.status === "coming-soon" ? "placeholder" : "pine"}>
                    {item.status === "coming-soon" ? "به‌زودی" : item.category ?? "خبر"}
                  </Badge>
                  {item.dateLabel ? <span>{item.dateLabel}</span> : null}
                </div>
                <h3 className="mt-3 text-lg font-medium leading-8 group-hover:text-pine">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-ink-muted">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function EducationPreview() {
  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-surface/50">
        <div className="content-shell section-pad">
          <SectionHeading
            eyebrow="آموزش"
            title="یادگیری در امتداد میراث البرز"
            description="کارگاه، دوره و منابع — در روح آموزش‌مداری که دکتر مجتهدی نمایندگی می‌کرد."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <MediaTile
              href="/education/workshops"
              eyebrow="WORKSHOPS"
              title="کارگاه‌ها"
              description="تجربهٔ تعاملی و گروهی."
              icon={MessagesSquare}
            />
            <MediaTile
              href="/education/courses"
              eyebrow="COURSES"
              title="دوره‌ها"
              description="مسیرهای یادگیری ساخت‌یافته."
              icon={GraduationCap}
              tone="soft"
            />
            <MediaTile
              href="/education/resources"
              eyebrow="RESOURCES"
              title="منابع"
              description="مواد مکمل برای مطالعهٔ مستقل."
              icon={FileText}
            />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export function MagazinePreview() {
  return (
    <FadeIn>
      <section className="content-shell section-pad">
        <SectionHeading
          eyebrow="مجله"
          title="خواندنی‌های تحریریه"
          description="یادداشت‌هایی دربارهٔ معلم البرز، بنیان‌گذاری شریف، و میراث آموزش در ایران."
          action={
            <Link href="/magazine" className="inline-flex items-center gap-2 text-sm font-medium text-pine hover:underline">
              <Newspaper className="size-4" aria-hidden />
              مجله
            </Link>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          {mockArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/magazine/${article.slug}`}
              className={`group rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm transition-colors hover:border-pine/40 ${index === 0 ? "lg:p-8" : ""}`}
            >
              <div className="flex items-center gap-2 text-xs text-bronze">
                <Newspaper className="size-3.5" aria-hidden />
                {article.category}
              </div>
              <h3
                className={`mt-3 font-medium text-ink group-hover:text-pine ${index === 0 ? "text-2xl md:text-3xl" : "text-xl"}`}
              >
                {article.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{article.description}</p>
              {article.readingTimeMinutes ? (
                <p className="mt-4 text-xs text-ink-muted">
                  حدود {toPersianDigits(article.readingTimeMinutes)} دقیقه مطالعه
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

export function MemoryCTA() {
  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-pine text-white">
        <div className="content-shell section-pad flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-white/65">
              <MessagesSquare className="size-3.5" aria-hidden />
              MEMORIES
            </p>
            <h2 className="text-display mt-3 text-3xl md:text-4xl">خاطره یا روایتی دارید؟</h2>
            <p className="mt-4 text-base leading-8 text-white/80">
              اگر شاگرد البرز، دانش‌آموختهٔ شریف، یا شاهد دوره‌ای از زندگی دکتر مجتهدی
              بوده‌اید، روایت خود را با ما در میان بگذارید. انتشار پس از بررسی انجام می‌شود.
            </p>
          </div>
          <Link
            href="/memories"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-pine-dark transition-opacity hover:opacity-90"
          >
            <MessagesSquare className="size-4" aria-hidden />
            ارسال خاطره
          </Link>
        </div>
      </section>
    </FadeIn>
  );
}

export function PartnersPreview() {
  return (
    <FadeIn>
      <section className="border-y border-ink/10 bg-paper/60">
        <div className="content-shell section-pad !py-10">
          <SectionHeading
            eyebrow="لینک‌ها و دوستان"
            title="شبکهٔ همکاران"
            description="دانشگاه‌ها، انجمن‌ها و مؤسسات مرتبط — از فوتر سایت پیشین بنیاد."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {mockPartnerLinks.map((partner) => (
              <li key={partner.id}>
                <span className="inline-flex rounded-full border border-ink/10 bg-surface px-3.5 py-1.5 text-xs text-ink-muted">
                  {partner.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </FadeIn>
  );
}

export function SponsorsPreview() {
  return (
    <FadeIn>
      <section className="content-shell section-pad !pb-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="حامیان"
            title="حامیان گرامی بنیاد"
            description="افراد و سازمان‌هایی که برنامه‌های عام‌المنفعه را ممکن می‌سازند."
          />
          <Link href="/sponsors" className="text-sm font-medium text-pine hover:underline">
            مشاهده همه
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {mockSponsors.map((sponsor) => (
            <li
              key={sponsor.id}
              className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-ink/10 bg-surface px-3 py-4 text-center shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-mint-soft text-xs font-semibold text-pine">
                {sponsor.logoLabel ?? sponsor.title.slice(0, 1)}
              </span>
              <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-ink-muted">
                {sponsor.title}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </FadeIn>
  );
}

export function SupportCTA() {
  return (
    <FadeIn>
      <section className="content-shell section-pad">
        <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
          <div
            className="pointer-events-none absolute inset-y-0 end-0 w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgb(var(--accent)/0.12),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 md:py-14">
            <div className="flex max-w-2xl gap-4">
              <IconBadge icon={HandHeart} size="lg" />
              <div>
                <p className="text-xs tracking-[0.16em] text-bronze">SUPPORT</p>
                <h2 className="text-display mt-2 text-2xl md:text-3xl">حمایت از مجموعه</h2>
                <p className="mt-3 text-ink-muted">
                  حمایت مالی، اهدای سند و کتاب، سپردن آثار، یا همراهی داوطلبانه.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3.5 text-sm font-semibold text-white hover:bg-pine-dark"
              >
                <HandHeart className="size-4" aria-hidden />
                راه‌های حمایت
              </Link>
              <Link
                href="/collaborate"
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-6 py-3.5 text-sm font-semibold hover:border-pine/40"
              >
                همکاری
              </Link>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

