import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Grano } from "@/components/ui/Grano";
import { site } from "@/content/site";
import "./globals.css";

// next/font descarga las fuentes en tiempo de build y las sirve desde el
// propio dominio: cero requests a Google Fonts en runtime.
//
// `axes: ["opsz"]` conserva el eje de tamaño óptico de Fraunces. Sin él,
// next/font lo fija en su valor por defecto (14) y el hero a 148px se
// renderizaría con el dibujo pensado para texto chico. Con el eje presente,
// `font-optical-sizing: auto` —que es el valor inicial del navegador— lo
// ajusta solo en toda la escala, de la etiqueta de 12px al display de 148px.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.name,
    url: site.url,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

// Nodo de entidad de la agencia. ProfessionalService es subtipo de
// Organization, así que un solo nodo cubre el `Organization` que pide el
// blueprint §6. Sin `address` a propósito: es un Service Area Business y la
// dirección no se publica; la señal geográfica va en `areaServed`.
//
// 🔴 Prohibido agregar `aggregateRating` o `review` mientras no existan
// reseñas verificables reales (PRODUCT.md §Evidence on Hand).
//
// ponytail: falta `logo`. Google no soporta SVG para ese campo y el logo
// rasterizado se genera en el paso 12 (cierre SEO), que es donde el JSON-LD
// se valida con Rich Results Test. Se agrega ahí, no antes.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  description: site.description,
  priceRange: "$$-$$$$",
  inLanguage: "es-MX",
  areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
  sameAs: [site.instagram.href],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: site.whatsapp.e164,
    availableLanguage: "Spanish",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Textura del sitio entero, una sola vez. Va antes del Header por
            orden de pintado, no porque se vea arriba: es una capa fija. */}
        <Grano />
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
