import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const routes = [
  "/",
  "/about",
  "/about/biography",
  "/about/timeline",
  "/about/legacy",
  "/heritage",
  "/heritage/people",
  "/heritage/places",
  "/heritage/institutions",
  "/museum",
  "/museum/collections",
  "/museum/exhibitions",
  "/museum/visit",
  "/complex",
  "/complex/facilities",
  "/complex/architecture",
  "/complex/park",
  "/complex/amphitheater",
  "/events",
  "/news",
  "/education",
  "/archive",
  "/library",
  "/oral-history",
  "/magazine",
  "/memories",
  "/support",
  "/construction",
  "/search",
  "/contact",
  "/visit",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
