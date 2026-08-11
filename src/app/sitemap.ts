import type { MetadataRoute } from "next";

import { casos } from "@/content/casos";
import { avisoCompleto } from "@/content/legal";
import { site } from "@/content/site";

// Solo rutas que existen. Las fijas viven en content/site.ts y cada paso del
// blueprint agrega la suya al aterrizar — un sitemap que anuncia 404 es peor
// que un sitemap corto.
//
// Las de los casos se derivan del mismo array del que `/casos/[slug]` saca sus
// `generateStaticParams`: las páginas que existen y las páginas que se anuncian
// salen de una sola fuente y no pueden discrepar.
// El aviso de privacidad entra por la MISMA condición que decide si su página
// existe (`content/legal.ts`): mientras le falte un dato de identidad,
// `/aviso-de-privacidad` responde 404 y anunciarla aquí sería mandar al
// buscador a una página que no está. Cuando se llenen los datos, entra sola.
export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    ...site.sitemap,
    ...casos.map((caso) => `/casos/${caso.slug}`),
    ...(avisoCompleto ? [site.legal.href] : []),
  ];

  return rutas.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date(),
  }));
}
