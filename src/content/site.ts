/**
 * Constantes únicas del sitio.
 *
 * Regla 2 del CLAUDE.md: todo texto visible sale de `content/`. Este archivo
 * es la única fuente de nombre, URL, navegación, zonas de operación y canales
 * de contacto — si un dato aparece dos veces en el sitio, aparece una vez aquí.
 *
 * `content/servicios.ts` (los 4 peldaños) y `content/casos.ts` (los 3 casos)
 * llegan en el paso 4 del blueprint. Aquí solo vive lo que el layout consume.
 */

// Sin barra final: todas las URLs absolutas se construyen concatenando.
//
// `||` y no `??`: la variable puede llegar DEFINIDA Y VACÍA —es lo que produce
// copiar `.env.example` a `.env.local`, y también crear la variable en Vercel
// antes de tener el valor—. `??` deja pasar la cadena vacía, que muere después
// en `new URL()` de `layout.tsx` con un error que señala al layout y no a la
// configuración, que es donde de verdad está el problema.
const url = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://brotadigital.mx"
).replace(/\/+$/, "");

export const site = {
  name: "Brota Digital",
  url,

  /** Meta description por defecto. Voz de despacho, tercera persona. */
  description:
    "Brota Digital construye sitios web, identidad de marca y sistemas de automatización e IA para negocios mexicanos. Opera desde CDMX y Playa del Carmen.",

  /** Título por defecto de la home. Las internas usan la plantilla `%s | …`. */
  title: "Brota Digital — sitios web y sistemas para negocios mexicanos",

  /**
   * El mecanismo de venta, no el precio: nadie tiene que cambiar de proveedor
   * por haber crecido (PRODUCT.md §Positioning).
   */
  tagline:
    "Sitios web, marca y sistemas de automatización. Todo escala desde lo más básico hasta lo más complejo, con el mismo proveedor.",

  /** Navegación principal del header y columna «Sitio» del footer. */
  nav: [
    { label: "Servicios", href: "/servicios" },
    { label: "Casos", href: "/casos" },
    { label: "Contacto", href: "/contacto" },
  ],

  legal: { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },

  /**
   * Service Area Business: se opera en estas zonas y no se publica dirección.
   * Alimenta también el `areaServed` del JSON-LD.
   */
  areaServed: ["Ciudad de México", "Cancún", "Playa del Carmen"],

  /**
   * ⚠️ Número personal, temporal. Vive aquí para que sustituirlo por el de
   * negocio sea editar una línea (blueprint §5).
   */
  whatsapp: {
    e164: "+529987347034",
    display: "+52 998 734 7034",
    href: "https://wa.me/529987347034?text=Hola%2C%20quiero%20cotizar%20un%20proyecto%20con%20Brota%20Digital.",
  },

  /** La cuenta real lleva doble «a». El sitio anterior enlazaba mal. */
  instagram: {
    handle: "@brotadigitaal",
    href: "https://www.instagram.com/brotadigitaal/",
  },

  /**
   * Rutas que ya existen y se pueden indexar. Cada paso del blueprint agrega
   * la suya al aterrizar; el paso 12 (cierre SEO) verifica que estén todas.
   */
  /**
   * Rutas fijas. Las de los casos NO se listan aquí: son una por entrada de
   * `content/casos.ts` y las agrega `app/sitemap.ts` desde ese array, para que
   * un caso nuevo entre al sitemap sin que haya que acordarse de escribirlo
   * dos veces.
   */
  sitemap: ["/", "/servicios", "/casos", "/contacto"],
} as const;
