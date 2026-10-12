import type { MetadataRoute } from "next";

import { visibleJobs } from "@/lib/careers";
import { productHref, products } from "@/lib/content/products";
import { solutionHref, solutions } from "@/lib/content/solutions";
import { publishedRoutes } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });

  return [
    ...publishedRoutes.map(({ path, priority }) => entry(path, priority)),
    ...solutions.map((s) => entry(solutionHref(s.slug), 0.9)),
    ...products.map((p) => entry(productHref(p.slug), 0.6)),
    // Solo convocatorias reales (las de ejemplo no se indexan)
    ...visibleJobs()
      .filter((j) => !j.example)
      .map((j) => entry(`/trabaja-con-nosotros/${j.slug}`, 0.5)),
  ];
}
