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
import { listProjects, listSponsors } from "@/lib/api/foundation";
import { listArticles } from "@/lib/api/magazine";
import { listNews } from "@/lib/api/news";
import { listTimeline } from "@/lib/api/people";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "خانه",
  path: "/",
});

export default async function HomePage() {
  const [news, articles, timeline, projects, sponsors] = await Promise.all([
    listNews(),
    listArticles(),
    listTimeline(),
    listProjects(),
    listSponsors(),
  ]);

  return (
    <>
      <HomeHeroSlider />
      <TimelinePreview items={timeline} />
      <NewsPreview items={news} />
      <ProjectsPreview items={projects} />
      <ArchiveHighlights />
      <MagazinePreview articles={articles} />
      <SponsorsPreview items={sponsors} />
      <PartnersPreview />
      <SupportCTA />
    </>
  );
}
