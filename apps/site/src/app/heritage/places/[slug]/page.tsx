import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { getPlace, listPlaces } from "@/lib/api/places";
import { listTimeline } from "@/lib/api/people";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const places = await listPlaces();
  return places.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) {
    return buildPageMetadata({
      title: "مکان یافت نشد",
      path: `/heritage/places/${slug}`,
    });
  }
  return buildPageMetadata({
    title: place.title,
    description: place.description,
    path: `/heritage/places/${place.slug}`,
  });
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const [place, places, timeline] = await Promise.all([
    getPlace(slug),
    listPlaces(),
    listTimeline(),
  ]);
  if (!place) notFound();

  const relatedPlaces = places.filter((p) => p.id !== place.id).slice(0, 3);
  const relatedEvents = timeline
    .filter((event) => event.relatedItems?.includes(place.id))
    .slice(0, 4);

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "میراث و تاریخ", href: "/heritage" },
          { label: "مکان‌ها", href: "/heritage/places" },
          { label: place.title },
        ]}
        eyebrow="مکان"
        title={place.title}
        description={place.description}
        statusLabel={place.status === "coming-soon" ? "به‌زودی" : undefined}
        actions={
          <Link
            href="/heritage/places"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            همه مکان‌ها
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-8">
        <FadeIn>
          <article className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-surface p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {place.location ? <Badge tone="pine">{place.location}</Badge> : null}
            </div>
            {place.historicalSignificance ? (
              <p className="mt-6 text-base leading-9 text-ink-muted">
                {place.historicalSignificance}
              </p>
            ) : place.description ? (
              <p className="mt-6 text-base leading-9 text-ink-muted">
                {place.description}
              </p>
            ) : null}
            {place.source ? (
              <p className="mt-6 text-xs text-ink-muted">منبع: {place.source}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-ink/10 pt-6 text-sm">
              <Link href="/about/timeline" className="font-semibold text-pine hover:underline">
                خط زمان
              </Link>
              <Link href="/about/biography" className="font-semibold text-pine hover:underline">
                زندگی‌نامه
              </Link>
              <Link href="/oral-history" className="font-semibold text-pine hover:underline">
                تاریخ شفاهی
              </Link>
            </div>
          </article>
        </FadeIn>

        {relatedEvents.length > 0 ? (
          <FadeIn>
            <section className="mx-auto max-w-3xl">
              <h2 className="text-display text-xl text-ink">نقاط مرتبط در خط زمان</h2>
              <ul className="mt-4 space-y-2">
                {relatedEvents.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm"
                  >
                    <span className="text-xs text-bronze">{event.year}</span>
                    <p className="mt-1 font-medium text-ink">{event.title}</p>
                  </li>
                ))}
              </ul>
              <Link
                href="/about/timeline"
                className="mt-3 inline-flex text-sm font-semibold text-pine hover:underline"
              >
                مشاهده خط زمان کامل
              </Link>
            </section>
          </FadeIn>
        ) : null}

        {relatedPlaces.length > 0 ? (
          <FadeIn>
            <section className="mx-auto max-w-3xl">
              <h2 className="text-display text-xl text-ink">مکان‌های دیگر</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {relatedPlaces.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/heritage/places/${p.slug}`}
                      className="block rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm transition hover:border-pine/35"
                    >
                      <span className="font-medium text-ink">{p.title}</span>
                      {p.location ? (
                        <span className="mt-1 block text-xs text-ink-muted">
                          {p.location}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
}
