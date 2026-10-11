import type { Metadata } from "next";
import { ContentCardGrid } from "@/components/foundation/ContentCards";
import { PlacesMap } from "@/components/heritage/PlacesMap";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { listPlaces } from "@/lib/api/places";
import { coverByIndex } from "@/lib/mock/covers";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "مکان‌ها",
  description: "مکان‌های تاریخی و فرهنگی مرتبط با مسیر زندگی دکتر مجتهدی.",
  path: "/heritage/places",
});

export default async function PlacesPage() {
  const places = await listPlaces();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "میراث و تاریخ", href: "/heritage" },
          { label: "مکان‌ها" },
        ]}
        eyebrow="جغرافیای میراث"
        title="مکان‌ها"
        description="از لاهیجان تا البرز و شریف — مکان‌های کلیدی در زندگی و میراث دکتر مجتهدی."
      />
      <div className="content-shell section-pad !pt-8 space-y-10">
        <FadeIn>
          <PlacesMap
            places={places.map((place) => ({
              slug: place.slug,
              title: place.title,
              description: place.description,
              location: place.location,
              coordinates: place.coordinates,
            }))}
          />
        </FadeIn>
        <ContentCardGrid
          items={places.map((place, index) => {
            const cover = coverByIndex(index + 1, place.title);
            return {
              key: place.id,
              href: `/heritage/places/${place.slug}`,
              title: place.title,
              description: place.description,
              meta: place.location,
              comingSoon: place.status === "coming-soon",
              image: { src: cover.src, alt: cover.alt },
            };
          })}
        />
      </div>
    </div>
  );
}
