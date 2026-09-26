import type { Metadata } from "next";
import { HomeHeroSlider } from "@/components/homepage/HomeHeroSlider";
import { TimelinePreview } from "@/components/homepage/TimelinePreview";
import {
  ArchiveHighlights,
  ComplexPreview,
  EducationPreview,
  MagazinePreview,
  MemoryCTA,
  MuseumPreview,
  NewsPreview,
  SupportCTA,
} from "@/components/homepage/sections";
import { EventsPreview } from "@/components/homepage/EventsPreview";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "خانه",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHeroSlider />
      <TimelinePreview />
      <MuseumPreview />
      <ComplexPreview />
      <ArchiveHighlights />
      <EventsPreview />
      <NewsPreview />
      <EducationPreview />
      <MagazinePreview />
      <MemoryCTA />
      <SupportCTA />
    </>
  );
}
