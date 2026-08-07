import type { MetadataRoute } from "next";

import { site } from "@/content/site";

// Los previews de Vercel se bloquean: compiten contra producción por las
// mismas keywords (blueprint §6). En local `VERCEL_ENV` no existe, así que el
// robots.txt de desarrollo es el mismo que se va a publicar y se puede revisar.
const isVercelPreview =
  Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";

export default function robots(): MetadataRoute.Robots {
  if (isVercelPreview) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
