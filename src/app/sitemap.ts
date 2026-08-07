import type { MetadataRoute } from "next";

import { site } from "@/content/site";

// Solo rutas que existen. La lista vive en content/site.ts y cada paso del
// blueprint agrega la suya al aterrizar — un sitemap que anuncia 404 es peor
// que un sitemap corto.
export default function sitemap(): MetadataRoute.Sitemap {
  return site.sitemap.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date(),
  }));
}
