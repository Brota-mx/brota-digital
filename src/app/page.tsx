import type { Metadata } from "next";

import { site } from "@/content/site";

// El canonical se declara por página, no en el layout: puesto en el layout lo
// heredarían todas las rutas y cada una se anunciaría como la home.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Placeholder. La home real (Hero · Escalera · Casos · Proceso · CTA ·
// Marquee) se construye en el paso 7 del blueprint.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1160px] flex-1 flex-col justify-center px-6 py-24">
      <h1 className="text-[clamp(40px,9vw,88px)] tracking-[-0.03em]">
        {site.tagline}
      </h1>
      <p className="mt-8 max-w-[52ch] text-gray">
        Sitio en construcción — paso 3 de 15: layout base y SEO técnico.
      </p>
    </main>
  );
}
