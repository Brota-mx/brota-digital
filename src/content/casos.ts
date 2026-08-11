/**
 * Los 3 casos con trabajo en producción (blueprint §3 y §6).
 *
 * No son portafolio bonito: son el único argumento verificable del sitio y
 * cada uno ataca su propia búsqueda vertical. De aquí salen la sección Casos
 * de la home, el índice `/casos` y las tres páginas `/casos/[slug]`.
 *
 * Reglas al tocar este archivo:
 * - `resultados` solo admite hechos señalables en el sitio en producción.
 *   Ni una cifra que no se pueda apuntar con el dedo (PRODUCT.md §Principles 2).
 * - Prohibido agregar testimonios, reseñas o calificaciones. No existen todavía
 *   y no se inventan ni como texto provisional, porque el relleno se queda.
 * - El caso `despacho-fiscal` se publica sin nombre ni logo, solo el giro.
 * - Las capturas NO llegaron en el paso 9: ver la nota al pie de este archivo.
 */

import type { ServicioId } from "./servicios";

export const casos = [
  {
    slug: "grupo-galarza",
    /** Nombre visible. `null` = el caso se publica sin identificar al cliente. */
    cliente: "Grupo Galarza",
    industria: "Construcción y desarrollo inmobiliario",
    /**
     * El H1 de la página del caso. Lleva cliente + industria + servicio en una
     * sola línea, que es lo que pide el blueprint §6: la página compite por una
     * búsqueda vertical y el encabezado tiene que decir de qué es sin que haya
     * que leer el párrafo de abajo. Se escribe entero aquí y no se arma
     * concatenando campos: un título es una frase, no una plantilla.
     *
     * Que el nombre del cliente vaya DENTRO del título es lo que permite que la
     * página no lo repita tres veces (miga de pan, eyebrow y titular) — lo
     * delató la captura a 375px.
     */
    titulo:
      "Grupo Galarza: sitio bilingüe para construcción y desarrollo inmobiliario",
    /** Métrica de portada, para el índice y la home. */
    metrica: { valor: "94", etiqueta: "Lighthouse móvil, como mínimo" },
    resumen:
      "Seis ramas de negocio bajo una sola marca, en español e inglés, con la misma exigencia técnica en cada entrega.",
    reto: "El grupo opera varias líneas de negocio y necesitaba presentarlas en un solo sitio, en dos idiomas, sin que ninguna quedara enterrada detrás de las demás ni la marca se fragmentara en seis sitios distintos.",
    solucion:
      "Una arquitectura que le da a cada rama su propio espacio y mantiene una sola marca al frente, servida completa en español e inglés. Cada cambio pasa por la misma batería antes de publicarse: pruebas automatizadas de punta a punta, auditoría de accesibilidad y revisión de cabeceras de seguridad.",
    resultados: [
      "84 casos de prueba automatizados de punta a punta",
      "Lighthouse móvil de 94 como mínimo",
      "Seis cabeceras de seguridad configuradas",
      "Contraste AA verificado en todo el texto",
      "Sitio completo en español e inglés",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Playwright", "Vercel"],
    peldano: "selva",
    seo: {
      keyword: "página web para constructora e inmobiliaria en México",
      title: "Sitio bilingüe para un grupo de construcción e inmobiliaria",
      description:
        "Caso: sitio bilingüe para un grupo con seis ramas de negocio, con 84 pruebas automatizadas, Lighthouse móvil 94 y contraste AA verificado.",
    },
  },
  {
    slug: "dra-patricia-garcia",
    cliente: "Dra. Patricia García",
    industria: "Medicina general y estética",
    titulo:
      "Dra. Patricia García: sitio bilingüe con agenda para un consultorio médico",
    metrica: { valor: "2", etiqueta: "idiomas, un solo sitio que ella opera" },
    resumen:
      "Un consultorio que publica su propio contenido, agenda en línea y atiende en dos idiomas.",
    reto: "El consultorio atiende a pacientes que consultan en español y en inglés, y necesitaba un sitio en ambos idiomas donde agendar una cita fuera parte del sitio y no un trámite aparte, con contenido que la propia doctora pudiera actualizar sin pedirle nada a nadie.",
    solucion:
      "Sitio bilingüe con gestor de contenido para la parte editorial, agenda integrada y contacto directo por WhatsApp. La configuración de seguridad y el marcado estructurado se auditaron antes de publicar, no después.",
    resultados: [
      "Sitio completo en español e inglés",
      "Gestor de contenido: publica y edita sin tocar código",
      "Agenda de citas integrada al sitio",
      "Política de seguridad de contenido y cabeceras configuradas",
      "4 items válidos en la prueba de resultados enriquecidos de Google",
    ],
    stack: ["Next.js", "TypeScript", "Sanity", "Cal.com", "Vercel"],
    peldano: "selva",
    seo: {
      keyword: "página web para consultorio médico",
      title: "Sitio bilingüe con agenda para un consultorio médico",
      description:
        "Caso: sitio bilingüe para un consultorio de medicina general y estética, con gestor de contenido, agenda en línea y auditoría de seguridad.",
    },
  },
  {
    slug: "despacho-fiscal",
    cliente: null,
    industria: "Despacho fiscalista",
    /** Sin nombre: el giro ocupa el lugar que en los otros dos ocupa el cliente. */
    titulo:
      "Despacho fiscalista: sitio de dos sedes con formulario protegido",
    metrica: { valor: "52", etiqueta: "pruebas automatizadas antes de publicar" },
    resumen:
      "Un despacho fiscalista con dos sedes, con el formulario de contacto protegido en capas.",
    reto: "El despacho necesitaba una presencia a la altura del perfil de sus clientes y un formulario de contacto que resistiera el abuso automatizado sin poner obstáculos a quien escribe de verdad.",
    solucion:
      "Sitio con las dos sedes presentadas como parte de una sola operación y un formulario protegido por capas: validación en el servidor, límite de solicitudes por IP y verificación anti-bots. Una suite de pruebas corre antes de cada publicación.",
    resultados: [
      "52 pruebas automatizadas de punta a punta",
      "Límite de solicitudes por IP en el formulario",
      "Verificación anti-bots antes de aceptar un envío",
      "Dos sedes presentadas en un solo sitio",
    ],
    stack: ["Next.js", "TypeScript", "Turnstile", "Vercel"],
    peldano: "selva",
    /** Se muestra en la página del caso: explica la ausencia de nombre y logo. */
    nota: "Este caso se publica sin identificar al despacho.",
    seo: {
      keyword: "página web para despacho de abogados fiscalistas",
      title: "Sitio con formulario protegido para un despacho fiscalista",
      description:
        "Caso: sitio de dos sedes para un despacho fiscalista, con formulario protegido en capas y 52 pruebas automatizadas de punta a punta.",
    },
  },
  // El `satisfies` existe por una sola razón: que `peldano` no pueda apuntar a
  // un peldaño que no existe. El enlace interno caso → escalera lo pide el
  // blueprint §6, y un slug mal escrito rompería en silencio, no en compilación.
] as const satisfies readonly { peldano: ServicioId; [k: string]: unknown }[];

export type Caso = (typeof casos)[number];

/**
 * Copy propio de `/casos` y de las tres páginas de caso (blueprint §3 y §6).
 *
 * Vive aquí, junto a los casos que rotula, por la misma razón que
 * `serviciosPagina` vive junto a los peldaños: los rótulos y el contenido que
 * rotulan se editan en la misma pasada o se desincronizan.
 *
 * ⚠️ SIN CAPTURAS, Y SE DICE
 *
 * El blueprint §4 define un tratamiento de capturas (16:10, esquinas de 8px,
 * móvil y desktop en composición escalonada) y §3 las marca como contenido
 * pendiente. Siguen pendientes: entran cuando se cierren los requisitos previos
 * del blueprint §11, no antes. Se resolvió construir la página sin el bloque
 * en vez de sembrar imágenes de relleno, porque el relleno se queda. El hueco
 * natural, cuando toque, es debajo del resumen de cada caso.
 */
export const casosPagina = {
  eyebrow: "Casos",
  titulo: "Tres sitios en producción, con lo que se puede comprobar",
  entrada:
    "Cada caso dice qué necesitaba el negocio, qué se construyó y qué quedó medido. Sin testimonios: lo que sostiene el argumento son las métricas, y cada una se puede ir a verificar en el sitio publicado.",
  /** Rótulo del enlace de cada tarjeta del índice al caso completo. */
  verCaso: "Ver el caso",

  /** Rótulos de las secciones de cada página de caso, en su orden de lectura. */
  seccion: {
    reto: "El reto",
    solucion: "La solución",
    resultados: "Resultados",
    stack: "Con qué está hecho",
  },

  /** Migas de pan: rótulo visible y el que va al `BreadcrumbList`. */
  migas: { inicio: "Inicio", casos: "Casos" },

  /** Enlace interno caso → peldaño de la escalera (blueprint §6). */
  peldano: {
    eyebrow: "Peldaño de la escalera",
    /** El nombre del peldaño y su rango los pone `content/servicios.ts`. */
    enlace: "Ver qué incluye este peldaño",
  },

  cta: { label: "Cotizar un proyecto", href: "/contacto" },

  cierre: {
    eyebrow: "Siguiente paso",
    titulo: "El siguiente caso puede ser el de tu negocio",
    entrada:
      "El formulario pide el rango de presupuesto desde el primer mensaje. Con eso y el contexto del negocio se responde con una propuesta real.",
  },
} as const;
