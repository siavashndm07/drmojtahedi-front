import type { Metadata } from "next";
import { HomeHeroSlider } from "@/components/homepage/HomeHeroSlider";
import { TimelinePreview } from "@/components/homepage/TimelinePreview";
import {
  ArchiveHighlights,
  MagazinePreview,
  NewsPreview,
  PartnersPreview,
  ProjectsPreview,
  SponsorsPreview,
  SupportCTA,
} from "@/components/homepage/sections";
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
      <NewsPreview />
      <ProjectsPreview />
      <ArchiveHighlights />
      <MagazinePreview />
      <SponsorsPreview />
      <PartnersPreview />
      <SupportCTA />
    </>
  );
}
