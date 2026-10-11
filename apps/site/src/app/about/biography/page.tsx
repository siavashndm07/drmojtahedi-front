import type { Metadata } from "next";
import Link from "next/link";
import {
  EditorialQuote,
  RelatedContent,
} from "@/components/shared/ContentExtras";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";
import { listTimeline } from "@/lib/api/people";
import {
  mockArchive,
  mockArticles,
  mockBiographySections,
  mockPeople,
  mockPlaces,
} from "@/lib/mock";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits, toPersianIndex } from "@/lib/utils/digits";

export const metadata: Metadata = buildPageMetadata({
  title: "زندگی‌نامه",
  description:
    "زندگی‌نامه دکتر محمدعلی مجتهدی گیلانی — معلم البرز و بنیان‌گذار دانشگاه صنعتی شریف.",
  path: "/about/biography",
});

const chapterNav = mockBiographySections.map((section) => ({
  id: section.id,
  title: section.title,
}));

export default async function BiographyPage() {
  const timeline = await listTimeline();
  const previewMilestones = timeline.slice(0, 5);

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "دکتر مجتهدی", href: "/about" },
          { label: "زندگی‌نامه" },
        ]}
        eyebrow="زندگی و میراث"
        title={siteConfig.personTitle}
        description={`${siteConfig.personRoles.join(" · ")} — روایت فصل‌به‌فصل از لاهیجان تا البرز و دانشگاه شریف (${siteConfig.birthYear}–${siteConfig.deathYear}).`}
        actions={
          <>
            <Link
              href="/about/timeline"
              className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
            >
              مشاهده خط زمان
            </Link>
            <Link
              href="/archive"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              آرشیو مرتبط
            </Link>
          </>
        }
      />

      <div className="content-shell section-pad !pt-8">
        <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 text-xs font-medium tracking-[0.16em] text-bronze uppercase">
              فصل‌ها
            </p>
            <nav aria-label="فصل‌های زندگی‌نامه">
              <ol className="space-y-1 border-s border-ink/10">
                {chapterNav.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      className="block border-s-2 border-transparent py-2 ps-4 text-sm text-ink-muted transition-colors hover:border-pine/40 hover:text-pine"
                    >
                      <span className="me-2 text-xs text-bronze">{toPersianDigits(index + 1)}</span>
                      {chapter.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#timeline-preview"
                    className="block border-s-2 border-transparent py-2 ps-4 text-sm text-ink-muted hover:border-pine/40 hover:text-pine"
                  >
                    خط زمان
                  </a>
                </li>
                <li>
                  <a
                    href="#sources"
                    className="block border-s-2 border-transparent py-2 ps-4 text-sm text-ink-muted hover:border-pine/40 hover:text-pine"
                  >
                    منابع
                  </a>
                </li>
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 space-y-16">
            <FadeIn>
              <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
                <div className="relative min-h-72 overflow-hidden border border-ink/10 bg-pine-dark">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(255_255_255/0.12),transparent_50%),linear-gradient(160deg,rgb(var(--accent))_0%,rgb(var(--accent-deep))_100%)]" />
                  <div className="relative flex h-full min-h-72 flex-col justify-between p-6 text-white">
                    <Badge tone="bronze">لاهیجان · تهران · فرانسه</Badge>
                    <div>
                      <p className="text-display text-3xl">{siteConfig.personName}</p>
                      <p className="mt-2 text-sm text-white/75">
                        {siteConfig.birthYear}–{siteConfig.deathYear} · معلم البرز · بنیان‌گذار شریف
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <EditorialQuote attribution="خاطرات دکتر محمدعلی مجتهدی · تاریخ شفاهی ایران">
                    من متعلق به ایرانم… من به مملکتم مدیونم، من باید برگردم به ایران.
                  </EditorialQuote>
                  <p className="mt-6 text-base leading-8 text-ink-muted">
                    این صفحه زندگی او را به فصل‌های خوانا تقسیم می‌کند و به خط زمان، افراد،
                    مکان‌ها و اسناد مرتبط پیوند می‌دهد.
                  </p>
                </div>
              </section>
            </FadeIn>

            {mockBiographySections.map((section, index) => (
              <FadeIn key={section.id} delayMs={40 * index}>
                <section id={section.id} className="scroll-mt-28">
                  <div className="mb-4 flex items-baseline gap-3">
                    <span className="text-sm text-bronze">
                      {toPersianIndex(index + 1)}
                    </span>
                    <h2 className="text-display text-2xl text-ink md:text-3xl">
                      {section.title}
                    </h2>
                  </div>
                  <p className="max-w-3xl text-base leading-9 text-ink-muted md:text-lg">
                    {section.body}
                  </p>
                </section>
              </FadeIn>
            ))}

            <FadeIn>
              <section id="timeline-preview" className="scroll-mt-28">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.16em] text-bronze uppercase">خط زمان</p>
                    <h2 className="text-display mt-2 text-2xl md:text-3xl">نقاط عطف منتخب</h2>
                  </div>
                  <Link href="/about/timeline" className="text-sm font-medium text-pine hover:underline">
                    مشاهده کامل خط زمان
                  </Link>
                </div>
                <ol className="grid gap-4 md:grid-cols-2">
                  {previewMilestones.map((item) => (
                    <li key={item.id} className="border border-ink/10 bg-paper/80 p-5">
                      <p className="text-xs text-bronze">{item.year}</p>
                      <h3 className="mt-2 font-medium text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-ink-muted">{item.description}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </FadeIn>

            <FadeIn>
              <section>
                <h2 className="text-display text-2xl md:text-3xl">اسناد و منابع منتخب</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {mockArchive.map((item) => (
                    <Link
                      key={item.id}
                      href={`/archive/${item.slug}`}
                      className="group border border-ink/10 bg-surface transition-colors hover:border-pine/40"
                    >
                      <div className="flex aspect-[4/3] items-end bg-[linear-gradient(145deg,rgb(var(--accent-soft)),rgb(var(--paper)))] p-4">
                        <Badge tone={item.status === "coming-soon" ? "placeholder" : "pine"}>
                          {item.status === "coming-soon" ? "به‌زودی" : item.type}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-ink-muted">{item.collection}</p>
                        <h3 className="mt-1 font-medium group-hover:text-pine">{item.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </FadeIn>

            <FadeIn>
              <RelatedContent
                title="افراد مرتبط"
                items={mockPeople.map((person) => ({
                  href: `/heritage/people/${person.slug}`,
                  label: person.name,
                  meta: person.role,
                }))}
              />
            </FadeIn>

            <FadeIn>
              <RelatedContent
                title="مکان‌های مرتبط"
                items={mockPlaces.map((place) => ({
                  href: `/heritage/places/${place.slug}`,
                  label: place.title,
                  meta: place.location,
                }))}
              />
            </FadeIn>

            <FadeIn>
              <RelatedContent
                title="مقالات مرتبط"
                items={mockArticles.map((article) => ({
                  href: `/magazine/${article.slug}`,
                  label: article.title,
                  meta: article.category,
                }))}
              />
            </FadeIn>

            <FadeIn>
              <section id="sources" className="scroll-mt-28 border border-ink/10 bg-surface p-6 md:p-8">
                <h2 className="text-display text-xl md:text-2xl">منابع</h2>
                <p className="mt-3 text-sm leading-7 text-ink-muted">
                  این روایت بر منابع عمومی و مستند استوار است. اسناد تصویری و جزئیات تکمیلی
                  به‌تدریج از آرشیو بنیاد افزوده می‌شوند.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  <li>• خاطرات دکتر محمدعلی مجتهدی، به کوشش حبیب لاجوردی — تاریخ شفاهی ایران</li>
                  <li>• محمدعلی مجتهدی، «به مملکتتون خدمت کنید»، انتشارات امین‌الضرب</li>
                  <li>• سده‌نامهٔ دبیرستان البرز، چاپ اقبال ۱۳۵۴</li>
                  <li>• Bayani, Bahram. «Mohammad-Ali Mojtahedi: His Life and Work». Iranian Studies</li>
                  <li>• ویکی‌پدیا فارسی: محمدعلی مجتهدی گیلانی</li>
                </ul>
              </section>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
