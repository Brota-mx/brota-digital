import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { avisoCompleto, avisoPrivacidad, IDENTIDAD } from "@/content/legal";
import { site } from "@/content/site";

/**
 * `/aviso-de-privacidad` — paso 11 del orden de construcción (blueprint §11).
 *
 * LA RUTA EXISTE SOLO SI EL AVISO ESTÁ COMPLETO
 *
 * `notFound()` cuando falta cualquiera de los datos de identidad de
 * `content/legal.ts`. No es defensivo por costumbre: es el guardarraíl que
 * sustituye a «acordarse de no publicar». Un aviso de privacidad con marcadores
 * a la vista es peor que no tener aviso —dice de la agencia lo contrario de lo
 * que el sitio entero intenta decir— y el porqué de esta forma y no de romper
 * el build está escrito en `content/legal.ts`.
 *
 * Mientras tanto el enlace legal del footer y del formulario cae en el 404 del
 * sitio, que es exactamente lo que hacía antes de que esta página existiera.
 * Nada empeora, y el día que se llenen los cinco campos la página aparece sola
 * —también en el sitemap, que lee la misma condición.
 *
 * SIN MOVIMIENTO Y SIN TALLO, como `/servicios` y `/contacto`. Es un documento
 * que se lee o se busca con Ctrl+F; el trazo es la firma de la home (§4) y aquí
 * solo sería el efecto más caro del sitio pagado por una página de referencia.
 *
 * TIPOGRAFÍA DE LECTURA LARGA
 *
 * Una sola columna con medida limitada (~68 caracteres) en vez del ancho de
 * 1160 del resto del sitio: es el único texto largo y seguido que hay, y a
 * ancho completo en escritorio se vuelve ilegible.
 */

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad de Brota Digital: qué datos se recaban en el formulario de contacto, para qué se usan, cuánto se conservan y cómo ejercer los derechos ARCO.",
  alternates: { canonical: "/aviso-de-privacidad" },
};

export default function AvisoDePrivacidad() {
  if (!avisoCompleto) notFound();

  const { eyebrow, titulo, actualizacionEtiqueta, secciones } =
    avisoPrivacidad;

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-[1160px] px-6 pt-[clamp(56px,9vw,104px)] pb-[clamp(40px,5vw,64px)]">
        <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[14ch] text-[clamp(40px,8vw,80px)] tracking-[-0.03em]">
          {titulo}
        </h1>
        <p className="mt-6 text-sm text-gray">
          {actualizacionEtiqueta} {IDENTIDAD.ultimaActualizacion}
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(80px,10vw,140px)]">
        {/* `max-w-[68ch]`: medida de lectura, no de layout. */}
        <div className="max-w-[68ch] border-t border-black/15">
          {secciones.map((seccion) => (
            <section
              key={seccion.id}
              id={seccion.id}
              className="border-b border-black/15 py-10"
            >
              <h2 className="text-[clamp(24px,3vw,32px)]">{seccion.titulo}</h2>

              {"parrafos" in seccion &&
                seccion.parrafos?.map((parrafo) => (
                  <p key={parrafo} className="mt-5 text-gray">
                    {parrafo}
                  </p>
                ))}

              {"lista" in seccion && seccion.lista && (
                // La marca es una regla capilar en coral, como las zonas de
                // `/contacto`: el mismo recurso para la misma idea, y sin
                // depender de la viñeta del navegador.
                <ul className="mt-6 space-y-3">
                  {seccion.lista.map((punto) => (
                    <li
                      key={punto}
                      className="relative pl-6 text-gray before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-coral"
                    >
                      {punto}
                    </li>
                  ))}
                </ul>
              )}

              {"proveedores" in seccion && seccion.proveedores && (
                <ul className="mt-8 space-y-6">
                  {seccion.proveedores.map((proveedor) => (
                    <li
                      key={proveedor.nombre}
                      className="border-l-2 border-black/15 pl-5"
                    >
                      <h3 className="font-display text-[clamp(18px,2.2vw,22px)] font-semibold">
                        {proveedor.nombre}
                      </h3>
                      {/* `<dl>` y no párrafos sueltos: son pares de dato y
                          valor, y así un lector de pantalla los anuncia como
                          tales en vez de como prosa corrida. */}
                      <dl className="mt-3 space-y-2 text-sm">
                        {[
                          ["Para qué", proveedor.para],
                          ["Qué recibe", proveedor.recibe],
                          ["Dónde se procesa", proveedor.donde],
                        ].map(([etiqueta, valor]) => (
                          <div key={etiqueta} className="sm:flex sm:gap-3">
                            <dt className="text-black sm:min-w-[9.5rem]">
                              {etiqueta}
                            </dt>
                            <dd className="text-gray">{valor}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              )}

              {"parrafosFinales" in seccion &&
                seccion.parrafosFinales?.map((parrafo) => (
                  <p key={parrafo} className="mt-5 text-gray">
                    {parrafo}
                  </p>
                ))}
            </section>
          ))}
        </div>
      </section>

      {/* `WebPage` y no `PrivacyPolicy`: schema.org no tiene un tipo para avisos
          de privacidad, y `about` lo enlaza al nodo de la agencia igual que en
          `/contacto`. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${site.url}${site.legal.href}#pagina`,
            url: `${site.url}${site.legal.href}`,
            name: `${avisoPrivacidad.titulo} | ${site.name}`,
            inLanguage: "es-MX",
            about: { "@id": `${site.url}/#organization` },
          }),
        }}
      />
    </main>
  );
}
