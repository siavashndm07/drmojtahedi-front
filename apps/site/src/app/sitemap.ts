import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  mockArchive,
  mockArticles,
  mockBooks,
  mockNews,
  mockOralHistory,
  mockPeople,
  mockPlaces,
  mockProjects,
  mockSponsors,
} from "@/lib/mock";

const staticRoutes = [
  "/",
  "/about",
  "/about/biography",
  "/about/timeline",
  "/about/legacy",
  "/foundation",
  "/foundation/charter",
  "/foundation/organs",
  "/heritage",
  "/heritage/people",
  "/heritage/students",
  "/heritage/places",
  "/heritage/institutions",
  "/news",
  "/magazine",
  "/library",
  "/library/books",
  "/projects",
  "/gallery",
  "/archive",
  "/archive/photographs",
  "/archive/video",
  "/oral-history",
  "/collaborate",
  "/contribute",
  "/sponsors",
  "/links",
  "/support",
  "/donate",
  "/transparency",
  "/press",
  "/newsletter",
  "/account/membership",
  "/account/login",
  "/account/register",
  "/search",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: (route === "/" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const slugs = [
    ...mockNews.map((i) => `/news/${i.slug}`),
    ...mockArticles.map((i) => `/magazine/${i.slug}`),
    ...mockBooks.map((i) => `/library/${i.slug}`),
    ...mockPeople.map((i) => `/heritage/people/${i.slug}`),
    ...mockPlaces.map((i) => `/heritage/places/${i.slug}`),
    ...mockArchive.map((i) => `/archive/${i.slug}`),
    ...mockSponsors.map((i) => `/sponsors/${i.slug}`),
    ...mockProjects.map((i) => `/projects/${i.slug}`),
    ...mockOralHistory.map((i) => `/oral-history/${i.slug}`),
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...slugs];
}
