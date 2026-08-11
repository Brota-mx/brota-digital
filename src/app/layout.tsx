import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Grano } from "@/components/ui/Grano";
import { servicios } from "@/content/servicios";
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
// `logo` apunta a `/logo.png`, que no es un archivo sino una respuesta de
// `next/og` (ver `app/logo.png/route.tsx`): Google no acepta SVG en ese campo
// y el único SVG del icono ya vive inlineado. Un PNG generado del mismo path
// no puede desincronizarse de un PNG dibujado a mano.
//
// `makesOffer` es el diagrama del blueprint §6: los cuatro peldaños salen de
// `content/servicios.ts`, la misma fuente de la escalera de la home, de
// `/servicios` y del select de presupuesto. Un peldaño nuevo entra al marcado
// sin que nadie tenga que acordarse. Sin `price`: el rango es texto de display
// («$3,500 – $6,000 MXN») y un precio en el marcado es un precio anunciado que
// obliga (Art. 7 LFPC). El diagrama del blueprint pide Service, no Offer con
// importe, y `priceRange` del nodo ya da la señal de nivel.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  description: site.description,
  priceRange: "$$-$$$$",
  inLanguage: "es-MX",
  logo: `${site.url}/logo.png`,
  areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
  makesOffer: servicios.map((servicio) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: servicio.nombre,
      description: servicio.promesa,
      areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
      provider: { "@id": `${site.url}/#organization` },
    },
  })),
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
