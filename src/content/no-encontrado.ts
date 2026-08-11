/**
 * Copy del 404 (blueprint §3, fila `/404`).
 *
 * Archivo propio y no una llave más de `site.ts`, por la misma razón que
 * `home.ts`: `site.ts` es la constante de identidad y contacto, y el copy de
 * una página no es una constante del sitio. Son pocas líneas, pero la
 * alternativa es que `site.ts` acumule el texto de las seis páginas.
 *
 * Los destinos NO se escriben aquí: salen de `site.nav`, que es la misma
 * fuente del header y del footer. Un 404 con un enlace roto es la ironía que
 * el paso 12 del blueprint pide verificar, y derivarlos de la nav la hace
 * imposible por construcción en vez de por revisión.
 */

export const noEncontrado = {
  eyebrow: "Error 404",
  titulo: "Esta página no existe.",
  entrada:
    "La dirección está mal escrita, o apunta a algo que cambió de lugar. El sitio completo sigue a un clic de distancia.",
  /** Único primario de la vista (blueprint §4). */
  cta: { label: "Volver al inicio", href: "/" },
  destinos: "O ir directo a:",
} as const;
