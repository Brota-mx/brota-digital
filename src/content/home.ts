/**
 * Copy de la home (blueprint §3, fila `/`).
 *
 * ⚠️ Es un cuarto archivo en `content/`, y el blueprint §7 solo declara tres.
 * La alternativa era meter el copy de la home en `site.ts`, que es la constante
 * de identidad y contacto: en cinco pasos más tendría dentro el texto de las
 * seis páginas y dejaría de ser la «constante única» que dice ser. Los peldaños
 * y los casos siguen viviendo en sus archivos; aquí solo está lo que es de esta
 * página y de ninguna otra.
 *
 * Reglas al tocar este archivo:
 * - Voz de despacho, tercera persona. Nunca femenino plural ni primera persona
 *   (PRODUCT.md §Brand Commitments — el sitio anterior mezclaba las dos).
 * - Cero cifras de trayectoria, testimonios o adjetivos de calidad que no se
 *   puedan señalar en producción. Lo verificable vive en `casos.ts`.
 */

export const home = {
  hero: {
    /** El espacio duro evita que «IA» quede sola en un renglón a 375px. */
    eyebrow: "Sitios web · Marca · Automatización con IA",
    /**
     * Dos frases, dos bloques. Se revelan escalonados detrás de una máscara,
     * en el mismo sentido en que crece el tallo. Si algún día son tres, el
     * componente no cambia: recorre el array.
     */
    titulo: ["Empieza donde estás.", "Crece sin cambiar de proveedor."],
    entrada:
      "Brota Digital construye sitios web, identidad de marca y sistemas de automatización para negocios mexicanos. La misma exigencia técnica en una página de aterrizaje que en un sistema que opera solo.",
    cta: { label: "Cotizar un proyecto", href: "/contacto" },
    ctaAlterno: { label: "Ver los casos", href: "/casos" },
  },

  escalera: {
    eyebrow: "La escalera",
    titulo: "Cuatro peldaños, un solo proveedor",
    entrada:
      "Se empieza por el peldaño que corresponde al momento del negocio y se sube cuando toca. Nadie tiene que cambiar de agencia por haber crecido.",
    enlace: { label: "Ver los cuatro peldaños a detalle", href: "/servicios" },
    /**
     * En móvil los peldaños se recorren de lado. El aviso es visible —no solo
     * para lectores de pantalla—: un carrusel sin indicio de que hay más a la
     * derecha es un carrusel que nadie desliza.
     */
    ayudaScroll: "Desliza para ver los cuatro peldaños",
  },

  casos: {
    eyebrow: "Trabajo en producción",
    titulo: "Los números se pueden ir a verificar",
    entrada:
      "Tres sitios en línea, con lo que cada uno resolvió y lo que se puede comprobar en él. Ninguna cifra de esta página es una estimación.",
    enlace: { label: "Ver los tres casos", href: "/casos" },
  },

  proceso: {
    eyebrow: "Cómo se trabaja",
    titulo: "Cuatro pasos, sin sorpresas a medio camino",
  },

  cta: {
    eyebrow: "Siguiente paso",
    titulo: "Cotiza con el presupuesto sobre la mesa",
    entrada:
      "El formulario pide un rango de presupuesto desde el primer mensaje. Es lo que permite responder con una propuesta real en vez de una ronda previa de «¿cuánto cuesta?».",
    boton: { label: "Solicitar cotización", href: "/contacto" },
    /** El segundo canal es WhatsApp; el número vive en `site.ts`. */
    whatsapp: "Escribir por WhatsApp",
  },

  /**
   * Marquee (blueprint §4, efecto #7): la tira que ya existía en el sitio
   * anterior, con la tipografía nueva y más lenta. Es lo que la agencia hace,
   * y dónde. Nada que prometa un resultado.
   */
  marquee: [
    "Sitios web",
    "Identidad de marca",
    "Gestión de redes",
    "Automatización con IA",
    "Ciudad de México",
    "Cancún",
    "Playa del Carmen",
  ],
} as const;
