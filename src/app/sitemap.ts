import type { MetadataRoute } from "next";

import { casos } from "@/content/casos";
import { site } from "@/content/site";

// Solo rutas que existen. Las fijas viven en content/site.ts y cada paso del
// blueprint agrega la suya al aterrizar — un sitemap que anuncia 404 es peor
// que un sitemap corto.
//
// Las de los casos se derivan del mismo array del que `/casos/[slug]` saca sus
// `generateStaticParams`: las páginas que existen y las páginas que se anuncian
// salen de una sola fuente y no pueden discrepar.
export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [...site.sitemap, ...casos.map((caso) => `/casos/${caso.slug}`)];

  return rutas.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date(),
  }));
}
