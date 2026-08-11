import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Metrica } from "@/components/ui/Metrica";
import { casos, casosPagina, type Caso } from "@/content/casos";
import { servicios } from "@/content/servicios";
import { site } from "@/content/site";

/**
 * `/casos/[slug]` — las tres páginas de caso (blueprint §3 y §6, paso 9).
 *
 * NO SON PORTAFOLIO BONITO
 *
 * El blueprint §6 fija el orden de lectura y esta página lo respeta al pie:
 * H1 con cliente + industria + servicio → contexto y problema → métricas duras
 * → stack → enlace interno al peldaño de la escalera usado y a `/contacto`.
 * Cada una ataca una búsqueda vertical distinta (`seo.keyword` en el
 * contenido), y ese orden es el que hace que la página responda la búsqueda
 * antes de pedir nada.
 *
 * SIN TESTIMONIO, Y NO ES UN OLVIDO
 *
 * El esquema original de §6 pedía además un testimonio atribuido con nombre y
 * rol por la señal E-E-A-T. Se retiró del blueprint porque no existe ninguno
 * real, y la regla es que no se inventa —ni como texto provisional, porque el
 * relleno se queda—. Se agrega el día que un cliente escriba uno.
 *
 * PROHIBIDO `Review` Y `AggregateRating` en el marcado de esta página por la
 * misma razón (blueprint §6). El `CreativeWork` de abajo describe el trabajo
 * entregado, que sí es verificable: está publicado.
 *
 * CERO MOVIMIENTO PROPIO
 *
 * Lo único que se mueve aquí es la métrica, que trae su contador y su regla
 * desde `components/ui/Metrica.tsx` y aparece una sola vez por página. Sin
 * tallo, por lo mismo que `/servicios` y `/casos` no lo llevan: es el efecto
 * más caro del sitio y la firma de la home.
 */

// Las tres páginas se generan en el build y ninguna otra existe: un slug que no
// esté en `content/casos.ts` es un 404, no una página renderizada a petición.
export const dynamicParams = false;

export function generateStaticParams() {
  return casos.map((caso) => ({ slug: caso.slug }));
}

// El `find` devuelve el tipo unión de los tres casos, y los campos opcionales
// —`cliente` es `string | null`, `nota` solo existe en uno— salen de ahí, no de
// un tipo escrito a mano que podría desviarse del contenido.
function buscarCaso(slug: string): Caso | undefined {
  return casos.find((caso) => caso.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/casos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const caso = buscarCaso(slug);
  if (!caso) return {};

  return {
    // La plantilla del layout lo completa a «… | Brota Digital».
    title: caso.seo.title,
    description: caso.seo.description,
    alternates: { canonical: `/casos/${caso.slug}` },
  };
}

export default async function CasoPage({ params }: PageProps<"/casos/[slug]">) {
  const { slug } = await params;
  const caso = buscarCaso(slug);
  // `dynamicParams = false` ya cubre el build, pero el tipo de `find` es
  // `Caso | undefined` y esto es lo que se lo demuestra a TypeScript sin un
  // aserto que apague la verificación.
  if (!caso) notFound();

  const { seccion, migas, peldano, cta, cierre } = casosPagina;
  // El `!` es seguro por construcción: `content/casos.ts` cierra con un
  // `satisfies` que obliga a `peldano` a ser un `ServicioId`, así que un peldaño
  // inexistente rompe en compilación y nunca llega hasta aquí.
  const escalon = servicios.find((servicio) => servicio.id === caso.peldano)!;
  const nombreVisible = caso.cliente ?? caso.industria;

  // Migas de pan que pide el blueprint §6 para las internas. Se arma de la
  // misma lista que se dibuja abajo: marcado y contenido visible no pueden
  // desincronizarse.
  const migasDePan = [
    { name: migas.inicio, item: `${site.url}/` },
    { name: migas.casos, item: `${site.url}/casos` },
    { name: nombreVisible, item: `${site.url}/casos/${caso.slug}` },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: migasDePan.map((miga, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: miga.name,
        item: miga.item,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${site.url}/casos/${caso.slug}#caso`,
      name: caso.seo.title,
      description: caso.seo.description,
      inLanguage: "es-MX",
      // `about` apunta a la industria del cliente, que es lo que pide el
      // blueprint §6: es la señal de para qué vertical es este trabajo. Va la
      // industria y nunca el nombre del cliente — para el caso anónimo, un
      // nombre en el marcado es un nombre publicado aunque no se vea en la
      // página; para los otros dos, el marcado no es el lugar donde esa
      // decisión se toma.
      about: { "@type": "Thing", name: caso.industria },
      creator: { "@id": `${site.url}/#organization` },
    },
  ];

  return (
    <main className="flex-1">
      {/* ── Migas de pan ────────────────────────────────────────────────── */}
      <nav
        aria-label={migas.casos}
        className="mx-auto w-full max-w-[1160px] px-6 pt-[clamp(32px,5vw,56px)]"
      >
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray">
          <li>
            <Link
              href="/"
              className="inline-flex min-h-11 min-w-11 items-center justify-center underline decoration-black/20 underline-offset-[6px] hover:decoration-black"
            >
              {migas.inicio}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/casos"
              className="inline-flex min-h-11 min-w-11 items-center justify-center underline decoration-black/20 underline-offset-[6px] hover:decoration-black"
            >
              {migas.casos}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {/* El último no es enlace: es la página en la que ya se está. */}
          <li className="text-black" aria-current="page">
            {nombreVisible}
          </li>
        </ol>
      </nav>

      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pt-[clamp(32px,5vw,56px)] pb-[clamp(48px,6vw,80px)]">
        {/* Sin eyebrow, a diferencia de `/casos` y `/servicios`. Aquí el
            nombre del cliente ya viene en la miga de pan justo encima y abre el
            H1: una tercera aparición del mismo texto en el mismo golpe de vista
            no es jerarquía, es eco. Lo delató la captura a 375px, no el código. */}
        <h1 className="max-w-[20ch] text-[clamp(36px,6.5vw,72px)] leading-[1.02] tracking-[-0.03em]">
          {caso.titulo}
        </h1>
        <p className="mt-8 max-w-[52ch] text-gray">{caso.resumen}</p>

        {/* Solo el caso anónimo la trae. Va aquí arriba y no al pie: la
            ausencia de nombre y logo se explica antes de que el lector se
            pregunte por ella, no después. */}
        {"nota" in caso && caso.nota ? (
          <p className="mt-6 max-w-[52ch] border-l border-coral pl-5 text-sm text-gray">
            {caso.nota}
          </p>
        ) : null}
      </section>

      {/* ── Métrica destacada ───────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(64px,8vw,104px)]">
        <div className="border-t border-black/15 pt-10">
          <Metrica valor={caso.metrica.valor} etiqueta={caso.metrica.etiqueta} />
        </div>
      </section>

      {/* ── Reto y solución ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="reto-titulo"
        className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(64px,8vw,104px)]"
      >
        <div className="grid gap-x-16 gap-y-10 border-t border-black/15 pt-10 lg:grid-cols-2">
          <div>
            <Eyebrow as="h2" id="reto-titulo" className="text-gray">
              {seccion.reto}
            </Eyebrow>
            {/* Cuerpo normal y no `text-sm`: son los dos párrafos que se leen
                de corrido de esta página. Las listas de abajo sí van chicas
                porque se escanean. */}
            <p className="mt-6 max-w-[52ch]">{caso.reto}</p>
          </div>
          <div>
            <Eyebrow as="h2" className="text-gray">
              {seccion.solucion}
            </Eyebrow>
            <p className="mt-6 max-w-[52ch]">{caso.solucion}</p>
          </div>
        </div>
      </section>

      {/* ── Resultados y stack ──────────────────────────────────────────── */}
      <section
        aria-labelledby="resultados-titulo"
        className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(64px,8vw,104px)]"
      >
        <div className="grid gap-x-16 gap-y-12 border-t border-black/15 pt-10 lg:grid-cols-[55fr_45fr]">
          <div>
            <h2
              id="resultados-titulo"
              className="text-[clamp(28px,4.5vw,48px)] tracking-[-0.02em]"
            >
              {seccion.resultados}
            </h2>
            <ul className="mt-8 space-y-4">
              {caso.resultados.map((resultado) => (
                <li
                  key={resultado}
                  className="relative max-w-[52ch] border-b border-black/10 pb-4 pl-6 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-coral"
                >
                  {resultado}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow as="h2" className="text-gray">
              {seccion.stack}
            </Eyebrow>
            {/* Lista y no «chips»: son nombres de herramientas, no filtros ni
                controles, y darles aspecto de botón invita a hacerles clic. */}
            <ul className="mt-6 space-y-3">
              {caso.stack.map((herramienta) => (
                <li key={herramienta} className="text-sm">
                  {herramienta}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Peldaño usado + cierre ──────────────────────────────────────── */}
      <section
        aria-labelledby="cierre-titulo"
        className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(80px,10vw,140px)]"
      >
        <div className="grid gap-x-16 gap-y-12 border-t border-black/15 pt-10 lg:grid-cols-[45fr_55fr]">
          {/* El enlace interno a la escalera que pide el blueprint §6: dice en
              qué peldaño cae este trabajo y cuánto cuesta, que es la pregunta
              que deja abierta un caso que se acaba de leer. */}
          <div>
            <Eyebrow className="text-gray">{peldano.eyebrow}</Eyebrow>
            <p className="mt-5 font-display text-[clamp(28px,4vw,44px)] leading-[1.1] font-semibold">
              {escalon.nombre}
            </p>
            {/* Aquí NO va la promesa del peldaño, aunque esté a mano en
                `content/servicios.ts`. Un peldaño promete todo lo que puede
                incluir y ningún proyecto usa todo: la de Selva habla de dos
                idiomas, gestor de contenido y agenda, y el caso del despacho
                fiscal no lleva ninguna de las tres. Puesta al pie de un caso,
                la promesa se lee como descripción de ESE trabajo y estaría
                describiendo cosas que no se entregaron. El rango sí va: es el
                dato que deja abierto un caso recién leído. El alcance completo
                está a un clic, en la página donde sí corresponde. */}
            <p className="mt-4 text-sm font-medium tabular-nums">
              {escalon.rango}
            </p>
            <div className="mt-6">
              <ButtonLink
                nivel="terciario"
                href={`/servicios#${escalon.id}`}
              >
                {peldano.enlace}
              </ButtonLink>
            </div>
          </div>

          <div>
            <Eyebrow className="text-gray">{cierre.eyebrow}</Eyebrow>
            <h2
              id="cierre-titulo"
              className="mt-5 max-w-[16ch] text-[clamp(32px,5.5vw,64px)] tracking-[-0.03em]"
            >
              {cierre.titulo}
            </h2>
            <p className="mt-8 max-w-[46ch] text-gray">{cierre.entrada}</p>
            <div className="mt-10">
              {/* Un solo primario por vista. */}
              <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
