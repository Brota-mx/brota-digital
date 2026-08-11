import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { noEncontrado } from "@/content/no-encontrado";
import { site } from "@/content/site";

/**
 * 404 (blueprint §3 y paso 11).
 *
 * `not-found.tsx` en la raíz de `app/` y no `global-not-found.tsx`: el segundo
 * es experimental, exige repetir el `<html>`, los estilos y las fuentes, y
 * existe para apps con varios layouts raíz o con segmento dinámico arriba.
 * Este sitio tiene un solo layout, así que el archivo estable cubre lo mismo
 * —Next lo usa para toda URL sin ruta desde 13.3— y hereda header, footer y
 * grano sin duplicar nada.
 *
 * SIN `metadata`: este archivo no es un segmento de ruta y Next no lee un
 * `export const metadata` desde aquí (solo `global-not-found` lo admite). El
 * `<title>` sale del `default` del layout, y el `noindex` lo inyecta Next solo
 * al responder 404 — no hay que escribirlo, y escribirlo a mano en el layout
 * lo pondría en todas las páginas.
 *
 * SIN MOVIMIENTO. Es la página a la que se llega por error: lo único que
 * importa es leer qué pasó y salir. El tallo tampoco: es la firma de la home
 * (§4) y aquí solo sería el efecto más caro del sitio pagado por una página
 * que nadie quería ver.
 */
export default function NotFound() {
  const { eyebrow, titulo, entrada, cta, destinos } = noEncontrado;

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-[1160px] px-6 pt-[clamp(56px,9vw,104px)] pb-[clamp(80px,10vw,140px)]">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[55fr_45fr] lg:items-end">
          <div>
            <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-[14ch] text-[clamp(40px,8vw,80px)] tracking-[-0.03em]">
              {titulo}
            </h1>
          </div>
          <p className="max-w-[46ch] text-gray lg:pb-2">{entrada}</p>
        </div>

        <div className="mt-[clamp(40px,6vw,64px)] border-t border-black/15 pt-10">
          <ButtonLink href={cta.href}>{cta.label}</ButtonLink>

          <p className="mt-12 text-sm text-gray" id="destinos-404">
            {destinos}
          </p>
          {/* Los tres destinos salen de `site.nav`: los mismos del header y del
              footer. Van como lista y no como prosa para que cada uno tenga su
              propia caja de 44px de alto y de ancho (regla 12) sin abrir el
              interlineado de un párrafo — el hallazgo del enlace legal del
              paso 10, aplicado antes de cometerlo. */}
          <ul
            aria-labelledby="destinos-404"
            className="mt-2 flex flex-wrap gap-x-8"
          >
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 min-w-11 items-center text-coral-ink underline decoration-coral-ink/30 underline-offset-[6px] transition-colors duration-200 ease-out hover:decoration-coral-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
