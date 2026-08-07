import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faq, servicios, serviciosPagina } from "@/content/servicios";
import { site } from "@/content/site";

/**
 * `/servicios` — paso 8 del orden de construcción (blueprint §3 y §6).
 *
 * QUÉ HACE ESTA PÁGINA Y QUÉ NO
 *
 * No escribe contenido: los cuatro peldaños están tipados desde el paso 4 en
 * `content/servicios.ts` y aquí solo se dibujan. Lo único nuevo es el FAQ, que
 * también vive en `content/` — es el sustituto deliberado del blog (§6), no un
 * adorno de esta plantilla.
 *
 * LA TABLA ES EL FRAGMENTO DESTACADO
 *
 * El blueprint §6 la señala como candidata natural a fragmento destacado de
 * «cuánto cuesta una página web en México». Por eso es una `<table>` de verdad
 * con `<caption>` y `<th scope="col">`, y por eso son DOS columnas y no tres:
 * el buscador extrae mejor un par nombre → precio, y de paso la tabla cabe
 * entera a 375px sin scroll horizontal. Sin scroll no hace falta convertirla en
 * región tabulable (`tabindex="0"` + `role="region"`), que es una parada de
 * teclado que aquí no llevaría a ningún control. La promesa de cada peldaño no
 * se pierde: está veinte píxeles más abajo, en su bloque de detalle.
 *
 * CERO MOVIMIENTO NUEVO, Y ES DELIBERADO
 *
 * El presupuesto medido en el paso 7 dice que el tallo cuesta ~3.4 s de hilo
 * principal por barrido de scroll y todo lo que anima la home junto ~1.0 s.
 * Esta página no anima nada y tampoco lleva el tallo: el trazo es la firma de
 * la home, donde enhebra las secciones y los peldaños, y repetirlo aquí sería
 * pagar el efecto más caro del sitio por un gesto decorativo. La jerarquía la
 * hacen el tamaño, el aire y las reglas capilares.
 *
 * SIN BLOQUE INVERTIDO PARA ECOSISTEMA
 *
 * En la home el cuarto peldaño invierte a negro porque ahí compite con otros
 * tres a la vista y la inversión ES el salto de escala. Aquí cada peldaño ocupa
 * su propia franja y no hay comparación que hacer; además sobre `--black` el
 * único acento que toca letra (`--coral-ink`, 3.68:1) reprueba AA, así que la
 * jerarquía tendría que rehacerse con tamaño de todos modos. Se hace con tamaño
 * y ya, sin la superficie que obliga a ello.
 */

export const metadata: Metadata = {
  // La plantilla del layout lo completa a «… | Brota Digital».
  title: "Servicios y precios",
  description:
    "Cuánto cuesta una página web en México: cuatro peldaños con rango de precio, qué incluye y qué no incluye cada uno. Desarrollo web y automatización con IA en CDMX, Cancún y Playa del Carmen.",
  alternates: { canonical: "/servicios" },
};

// El marcado que pide el blueprint §6 para esta página. Se arma del mismo
// array que se renderiza: si una respuesta cambia en `content/`, el marcado
// cambia con ella y no pueden desincronizarse — que es justo lo que Google
// penaliza (marcado que no corresponde al contenido visible).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ p, r }) => ({
    "@type": "Question",
    name: p,
    acceptedAnswer: { "@type": "Answer", text: r },
  })),
};

export default function Servicios() {
  const { eyebrow, titulo, entrada, cta, whatsapp, tabla, detalle, faqTitulo, cierre } =
    serviciosPagina;

  return (
    <main className="flex-1">
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pt-[clamp(56px,9vw,104px)] pb-[clamp(48px,6vw,80px)]">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[55fr_45fr] lg:items-end">
          <div>
            <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-[14ch] text-[clamp(40px,8vw,80px)] tracking-[-0.03em]">
              {titulo}
            </h1>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-[46ch] text-gray">{entrada}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
              <ButtonLink
                nivel="terciario"
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {whatsapp}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── La tabla de precios ─────────────────────────────────────────── */}
      <section
        aria-labelledby="tabla-titulo"
        className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(72px,9vw,120px)]"
      >
        <table className="w-full border-collapse text-left">
          {/* Visible a propósito: es el texto que explica la tabla al lector
              y el que el buscador lee para titular el fragmento destacado.
              Escondido para lectores de pantalla sería perder las dos cosas. */}
          <caption
            id="tabla-titulo"
            className="mb-8 text-left font-display text-[clamp(22px,3vw,30px)] font-semibold text-black"
          >
            {tabla.caption}
          </caption>
          <thead>
            <tr className="border-b border-black">
              {tabla.encabezados.map((encabezado, i) => (
                <th
                  key={encabezado}
                  scope="col"
                  className={`pb-3 font-body text-[11px] font-medium tracking-[0.18em] text-gray uppercase sm:text-xs ${
                    i === 1 ? "text-right" : ""
                  }`}
                >
                  {encabezado}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="border-b border-black/15">
                <th
                  scope="row"
                  className="py-5 pr-4 align-baseline font-display text-[clamp(20px,2.6vw,28px)] font-semibold"
                >
                  {/* Ancla estable: `/servicios#selva` cae en el bloque de
                      detalle de ese peldaño, y desde la tabla se llega de un
                      salto en vez de buscándolo con el scroll.

                      Lleva subrayado tenue EN REPOSO, no solo al hover: sin él
                      es un enlace que no se ve que lo sea —no hay prosa
                      alrededor de la que distinguirse por color, y el color
                      tampoco puede ser la señal—. Lo delató la captura. */}
                  <a
                    href={`#${servicio.id}`}
                    className="inline-flex min-h-11 min-w-11 cursor-pointer items-center underline decoration-black/25 underline-offset-[6px] hover:decoration-black"
                  >
                    {servicio.nombre}
                  </a>
                </th>
                <td className="py-5 text-right align-baseline text-sm tabular-nums">
                  {servicio.rango}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 max-w-[62ch] text-sm text-gray">{tabla.nota}</p>
      </section>

      {/* ── Los cuatro peldaños a detalle ───────────────────────────────── */}
      {servicios.map((servicio, i) => (
        <section
          key={servicio.id}
          id={servicio.id}
          aria-labelledby={`${servicio.id}-titulo`}
          // `scroll-mt` deja el título despegado del borde superior cuando se
          // llega por el ancla; sin él queda pegado al canto de la ventana.
          className="mx-auto w-full max-w-[1160px] scroll-mt-8 px-6 pb-[clamp(72px,9vw,120px)]"
        >
          <div className="grid gap-x-16 gap-y-10 border-t border-black/15 pt-10 lg:grid-cols-[55fr_45fr]">
            <div>
              <Eyebrow className="text-gray">
                {detalle.peldano} {String(i + 1).padStart(2, "0")}
              </Eyebrow>
              <h2
                id={`${servicio.id}-titulo`}
                className="mt-5 text-[clamp(32px,5.5vw,64px)]"
              >
                {servicio.nombre}
              </h2>
              {/* La promesa es la línea grande de cada peldaño: sin ella la
                  jerarquía dependería del color, y el acento no puede cargar
                  ese trabajo. */}
              <p className="mt-6 max-w-[34ch] font-display text-[clamp(20px,2.6vw,28px)] leading-[1.25] font-semibold">
                {servicio.promesa}
              </p>
              <p className="mt-8 text-sm font-medium tabular-nums">
                {servicio.rango}
              </p>

              <div className="mt-8 border-t border-black/15 pt-5">
                <Eyebrow className="text-gray">{detalle.paraQuien}</Eyebrow>
                <p className="mt-3 max-w-[46ch] text-gray">
                  {servicio.paraQuien}
                </p>
              </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <Eyebrow as="h3" className="text-black">
                  {detalle.incluye}
                </Eyebrow>
                <ul className="mt-4 space-y-3">
                  {servicio.incluye.map((linea) => (
                    // La marca de viñeta es una regla capilar de --coral, que
                    // es lenguaje de la marca y no un icono: no hay librería de
                    // iconos instalada y esto no la justifica. `aria-hidden` no
                    // hace falta: es un pseudo-elemento y no entra al árbol de
                    // accesibilidad.
                    <li
                      key={linea}
                      className="relative pl-6 text-sm before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-coral"
                    >
                      {linea}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Eyebrow as="h3" className="text-black">
                  {detalle.noIncluye}
                </Eyebrow>
                {/* En gris y con la viñeta en el mismo gris: la diferencia no
                    la lleva el color solo —eso sería depender del color para
                    transmitir información—, la lleva el encabezado de la
                    lista, que dice literalmente qué es. */}
                <ul className="mt-4 space-y-3">
                  {servicio.noIncluye.map((linea) => (
                    <li
                      key={linea}
                      className="relative pl-6 text-sm text-gray before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-gray"
                    >
                      {linea}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="faq-titulo"
        className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(72px,9vw,120px)]"
      >
        <h2
          id="faq-titulo"
          className="border-t border-black/15 pt-10 text-[clamp(32px,5.5vw,64px)]"
        >
          {faqTitulo}
        </h2>

        {/* Abierto, no en acordeón. El acordeón esconde justo el texto por el
            que esta página existe —el FAQ es el sustituto del blog— y añade
            una interacción para leer prosa. Estático se lee de corrido, se
            imprime, se busca con Ctrl+F y no cuesta un solo fotograma. */}
        <dl className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-2">
          {faq.map(({ p, r }) => (
            <div key={p} className="border-t border-black/15 pt-6">
              <dt className="font-display text-[clamp(20px,2.2vw,24px)] leading-[1.2] font-semibold">
                {p}
              </dt>
              {/* En cuerpo normal y no en `text-sm`: es el texto por el que
                  esta página existe y el que más se lee de corrido. Las listas
                  de arriba sí van chicas porque se escanean, no se leen. */}
              <dd className="mt-4 max-w-[52ch] text-gray">{r}</dd>
            </div>
          ))}
        </dl>
      </section>

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
            {/* Un solo primario por vista: el de arriba está a una pantalla de
                distancia y éste es el que cierra la lectura. */}
            <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
