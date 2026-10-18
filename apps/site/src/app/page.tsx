import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { visibleHomeSections, type HomeSectionKey } from "@drmojtahedi/shared";
import { HomeHeroSlider } from "@/components/homepage/HomeHeroSlider";
import { TimelinePreview } from "@/components/homepage/TimelinePreview";
import {
  ArchiveHighlights,
  DonationPreview,
  MagazinePreview,
  NewsPreview,
  PartnersPreview,
  ProjectsPreview,
  SponsorsPreview,
  SupportCTA,
} from "@/components/homepage/sections";
import { getDonateHighlights } from "@/lib/api/donate";
import { listProjects, listSponsors } from "@/lib/api/foundation";
import { listHeroSlides } from "@/lib/api/hero";
import { listArticles } from "@/lib/api/magazine";
import { listNews } from "@/lib/api/news";
import { listTimeline } from "@/lib/api/people";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { loadSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = buildPageMetadata({
  title: "خانه",
  path: "/",
});

export default async function HomePage() {
  const [site, news, articles, timeline, projects, sponsors, heroSlides, donate] =
    await Promise.all([
      loadSiteSettings(),
      listNews(),
      listArticles(),
      listTimeline(),
      listProjects(),
      listSponsors(),
      listHeroSlides(),
      getDonateHighlights(),
    ]);

  const sections: Partial<Record<HomeSectionKey, ReactNode>> = {
    hero: (
      <HomeHeroSlider
        slides={heroSlides.length ? heroSlides : undefined}
        template={site.heroTemplate}
        autoplayDelay={site.heroAutoplayDelay}
      />
    ),
    donate: <DonationPreview message={donate.message} goals={donate.goals} />,
    timeline: <TimelinePreview items={timeline} />,
    news: <NewsPreview items={news} />,
    projects: <ProjectsPreview items={projects} />,
    archive: <ArchiveHighlights />,
    magazine: <MagazinePreview articles={articles} />,
    sponsors: <SponsorsPreview items={sponsors} />,
    partners: <PartnersPreview />,
    supportCta: <SupportCTA />,
  };

  const visible = visibleHomeSections(site.homeSectionOrder, site.homeSections);

  return (
    <>
      {visible.map((key) => {
        const node = sections[key];
        return node ? <Fragment key={key}>{node}</Fragment> : null;
      })}
    </>
  );
}
