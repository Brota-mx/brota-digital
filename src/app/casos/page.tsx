import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Metrica } from "@/components/ui/Metrica";
import { casos, casosPagina } from "@/content/casos";

/**
 * `/casos` — índice de los tres casos (blueprint §3, paso 9).
 *
 * QUÉ CAMBIA RESPECTO A LA SECCIÓN CASOS DE LA HOME
 *
 * La home muestra los mismos tres casos en tres columnas: ahí compiten por la
 * atención con otras cinco secciones y su trabajo es que se vean de un vistazo.
 * Aquí no compiten con nada, así que cada uno ocupa una franja completa y le
 * cabe el resumen entero más su lista de resultados. Es la misma información
 * con más aire, no información nueva: todo sale de `content/casos.ts`, igual
 * que en la home.
 *
 * EL BARRIDO CORAL SE REPITE, EL TALLO NO
 *
 * El barrido (blueprint §4, efecto #6) recorre una regla capilar de 1px con
 * `transform`, que es de las dos propiedades que el compositor sí resuelve
 * solo. Repetirlo aquí no mueve el presupuesto medido en el paso 7. El tallo sí
 * lo movería —cuesta ~3.4 s de hilo principal por barrido de scroll, tres veces
 * lo que cuesta la home entera— y por eso se queda en la home, igual que en
 * `/servicios`: es la firma de una página, no un adorno que se repite.
 *
 * SIN CAPTURAS
 *
 * El porqué, con las dos condiciones que faltan, está en `content/casos.ts`.
 * El hueco natural es debajo del resumen de cada franja.
 */

export const metadata: Metadata = {
  title: "Casos",
  description:
    "Tres sitios en producción: un grupo de construcción e inmobiliaria, un consultorio médico y un despacho fiscalista. Qué necesitaba cada negocio, qué se construyó y qué quedó medido.",
  alternates: { canonical: "/casos" },
};

export default function Casos() {
  const { eyebrow, titulo, entrada, verCaso, cta, cierre, seccion } =
    casosPagina;

  return (
    <main className="flex-1">
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pt-[clamp(56px,9vw,104px)] pb-[clamp(48px,6vw,80px)]">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[55fr_45fr] lg:items-end">
          <div>
            <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-[16ch] text-[clamp(40px,8vw,80px)] tracking-[-0.03em]">
              {titulo}
            </h1>
          </div>
          <p className="max-w-[46ch] text-gray lg:pb-2">{entrada}</p>
        </div>
      </section>

      {/* ── Los tres casos ──────────────────────────────────────────────── */}
      <ul>
        {casos.map((caso) => (
          <li key={caso.slug}>
            <article className="group relative mx-auto w-full max-w-[1160px] px-6 pb-[clamp(64px,8vw,104px)]">
              <div className="relative grid gap-x-16 gap-y-10 border-t border-black/15 pt-10 lg:grid-cols-[45fr_55fr]">
                {/* El barrido: recorre la regla superior de la franja al pasar
                    el cursor y también con `focus-within`, para que quien
                    navega con teclado vea la misma señal. `-top-px` lo pone
                    encima de la regla base, no debajo. --coral no puede tocar
                    letra, y aquí no toca ninguna: es un píxel de alto. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-coral transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:transition-none"
                />

                <Metrica
                  valor={caso.metrica.valor}
                  etiqueta={caso.metrica.etiqueta}
                />

                <div>
                  <h2 className="text-[clamp(28px,4vw,44px)] tracking-[-0.02em]">
                    {/* El `<Link>` va en el título y un `::after` lo estira
                        sobre la franja entera: el nombre accesible del enlace
                        es el del caso —no los tres párrafos— y el área de toque
                        es toda la fila. Mismo patrón que la home. */}
                    <Link
                      href={`/casos/${caso.slug}`}
                      className="inline-flex min-h-11 min-w-11 items-center underline-offset-[8px] after:absolute after:inset-0 group-hover:underline group-hover:decoration-coral"
                    >
                      {caso.cliente ?? caso.industria}
                    </Link>
                  </h2>

                  {/* El caso anónimo ya usa su giro como título: repetirlo
                      debajo sobraría. */}
                  {caso.cliente ? (
                    <p className="mt-2 text-sm text-gray">{caso.industria}</p>
                  ) : null}

                  <p className="mt-6 max-w-[52ch] text-gray">{caso.resumen}</p>

                  <div className="mt-8">
                    <Eyebrow as="h3" className="text-black">
                      {seccion.resultados}
                    </Eyebrow>
                    <ul className="mt-4 space-y-3">
                      {caso.resultados.map((resultado) => (
                        // La viñeta es una regla capilar de --coral: lenguaje
                        // de la marca, no un icono. No hay librería de iconos
                        // instalada y esto no la justifica.
                        <li
                          key={resultado}
                          className="relative max-w-[52ch] pl-6 text-sm before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-coral"
                        >
                          {resultado}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Redundante con el enlace del título a propósito: es la
                      señal visible de «esto continúa», que un título subrayado
                      solo al hover no da. Es un `<p>` y no un segundo enlace:
                      `aria-hidden` lo deja fuera del árbol de accesibilidad
                      —el destino ya se anunció en el título— y al no ser
                      enlace no agrega una segunda parada de tabulación que
                      llevaría exactamente al mismo sitio. */}
                  <p
                    aria-hidden="true"
                    className="mt-8 text-sm font-medium text-coral-ink underline decoration-coral-ink/30 underline-offset-[6px] group-hover:decoration-coral-ink"
                  >
                    {verCaso}
                  </p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* ── Cierre ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cierre-titulo"
        className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(80px,10vw,140px)]"
      >
        <div className="border-t border-black/15 pt-10">
          <Eyebrow className="text-gray">{cierre.eyebrow}</Eyebrow>
          <h2
            id="cierre-titulo"
            className="mt-5 max-w-[16ch] text-[clamp(36px,7vw,80px)] tracking-[-0.03em]"
          >
            {cierre.titulo}
          </h2>
          <p className="mt-8 max-w-[52ch] text-gray">{cierre.entrada}</p>
          <div className="mt-10">
            <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
