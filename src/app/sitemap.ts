import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const routes = [
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
  "/collaborate",
  "/sponsors",
  "/support",
  "/donate",
  "/account/membership",
  "/account/login",
  "/account/register",
  "/search",
  "/contact",
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
