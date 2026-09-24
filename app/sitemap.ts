import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gallery.web.orvia.org.uk";
  return ["", "/work", "/collections", "/about", "/exhibitions", "/commissions", "/contact", "/demo-information"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7
  }));
}
