import type { Metadata } from "next";

import { FormularioContacto } from "@/components/forms/FormularioContacto";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { contactoPagina } from "@/content/contacto";
import { site } from "@/content/site";

/**
 * `/contacto` — paso 10 del orden de construcción (blueprint §3 y §5).
 *
 * LA PÁGINA ES SERVIDOR; SOLO EL FORMULARIO ES CLIENTE
 *
 * El encabezado, la columna lateral y el JSON-LD se prerrenderizan como
 * cualquier otra página del sitio. `FormularioContacto` es el único `"use
 * client"` y arrastra consigo React Hook Form y el widget de Turnstile — que
 * es exactamente lo que tiene que arrastrar y nada más. Si el encabezado
 * viviera dentro del componente cliente, el H1 dependería de la hidratación.
 *
 * CERO MOVIMIENTO, COMO EN `/servicios`
 *
 * Sin tallo y sin animaciones. El presupuesto medido en el paso 7 dice que el
 * trazo cuesta ~3.4 s de hilo principal por barrido de scroll; en la página
 * donde el visitante está tecleando, cada milisegundo de hilo principal es un
 * carácter que tarda en aparecer. El movimiento aquí no compra nada.
 *
 * SIN BOTÓN FLOTANTE DE WHATSAPP
 *
 * §5 lo describe como botón flotante. En esta página el formulario ES la
 * acción principal y un botón fijo encima de un campo de texto en un teléfono
 * de 375px tapa justo lo que se está escribiendo. El canal rápido está en la
 * columna lateral, a la vista, y en el footer de todo el sitio. Si el flotante
 * entra algún día, entra en las páginas donde no hay formulario.
 */

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Solicitar una cotización a Brota Digital. El formulario pide el rango de presupuesto desde el primer mensaje para responder con una propuesta real. Se opera desde CDMX, Cancún y Playa del Carmen.",
  alternates: { canonical: "/contacto" },
};

// `ContactPage` enlazada al nodo de la agencia que declara el layout. No se
// repite aquí el teléfono ni el `areaServed`: ya están en `#organization` y
// duplicarlos crea dos versiones del mismo dato que se pueden desincronizar.
const contactoJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${site.url}/contacto#pagina`,
  url: `${site.url}/contacto`,
  name: `${contactoPagina.formularioTitulo} | ${site.name}`,
  inLanguage: "es-MX",
  about: { "@id": `${site.url}/#organization` },
};

export default function Contacto() {
  const { eyebrow, titulo, entrada, formularioTitulo, lateral } = contactoPagina;

  return (
    <main className="flex-1">
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pt-[clamp(56px,9vw,104px)] pb-[clamp(40px,5vw,64px)]">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[55fr_45fr] lg:items-end">
          <div>
            <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-[14ch] text-[clamp(40px,8vw,80px)] tracking-[-0.03em]">
              {titulo}
            </h1>
          </div>
          <p className="max-w-[46ch] text-gray lg:pb-2">{entrada}</p>
        </div>
      </section>

      {/* ── Formulario + columna lateral ────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pb-[clamp(80px,10vw,140px)]">
        {/* El formulario va primero en el DOM y primero en la lectura móvil:
            es la acción principal (§1). La columna lateral queda debajo en
            teléfono y al costado en escritorio, sin reordenar nada. */}
        <div className="grid gap-x-16 gap-y-16 lg:grid-cols-[55fr_45fr]">
          <div className="border-t border-black/15 pt-10">
            <h2 className="text-[clamp(24px,3vw,32px)]">{formularioTitulo}</h2>
            {/* Sin JavaScript el formulario se esconde entero y en su lugar
                queda la nota. Dos razones, y la segunda es la que manda:

                1. No puede funcionar. El token anti-robots solo se emite en el
                   navegador, así que el envío moriría en la primera capa.
                2. Un `<form>` sin `action` hace GET a la ruta actual, y eso
                   pondría nombre, correo y teléfono en la barra de direcciones
                   —y en el historial, y en los registros—. El `method="post"`
                   del formulario ya lo evita; esconderlo evita además que
                   alguien llene seis campos para nada.

                El `<style>` dentro de `<noscript>` es la única forma de hacerlo
                sin JavaScript, que es justamente el caso que se atiende. */}
            <noscript>
              <style>{"#formulario-contacto{display:none}"}</style>
              <p className="mt-10 border-l-2 border-coral-ink bg-cream-2 px-5 py-4 text-sm text-black">
                {contactoPagina.sinJavaScript}
              </p>
            </noscript>

            <div id="formulario-contacto" className="mt-10">
              <FormularioContacto />
            </div>
          </div>

          <aside className="flex flex-col gap-12 border-t border-black/15 pt-10">
            <div>
              <Eyebrow as="h2" className="text-black">
                {lateral.whatsappTitulo}
              </Eyebrow>
              <p className="mt-4 max-w-[42ch] text-gray">
                {lateral.whatsappTexto}
              </p>
              <div className="mt-6">
                <ButtonLink
                  nivel="secundario"
                  href={site.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lateral.whatsappBoton}
                </ButtonLink>
              </div>
            </div>

            <div className="border-t border-black/15 pt-8">
              <Eyebrow as="h2" className="text-black">
                {lateral.zonasTitulo}
              </Eyebrow>
              {/* Las zonas son una lista de verdad, no una frase con comas:
                  son el `areaServed` del JSON-LD y se leen una por una. */}
              <ul className="mt-4 space-y-2">
                {site.areaServed.map((zona) => (
                  <li
                    key={zona}
                    className="relative pl-6 font-display text-[clamp(18px,2.2vw,22px)] font-semibold before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-coral"
                  >
                    {zona}
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[42ch] text-sm text-gray">
                {lateral.zonasTexto}
              </p>
            </div>

            <div className="border-t border-black/15 pt-8">
              <Eyebrow as="h2" className="text-black">
                {lateral.horarioTitulo}
              </Eyebrow>
              <p className="mt-4 max-w-[42ch] text-gray">
                {lateral.horarioTexto}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactoJsonLd) }}
      />
    </main>
  );
}
