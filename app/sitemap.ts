import type { MetadataRoute } from "next";
import { site } from "@/config/copy";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/results", "/about", "/contact", "/offer", "/terms"];
  return routes.map((r) => ({
    url: `${site.domain}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
