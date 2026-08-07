import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Metrica } from "@/components/ui/Metrica";
import { casos } from "@/content/casos";
import { home } from "@/content/home";

/**
 * Casos (blueprint §4, efecto #6: «barrido coral» al hover).
 *
 * Es el único argumento verificable del sitio: tres sitios en producción con
 * métricas que se pueden ir a comprobar. Cero testimonios, cero calificaciones
 * (PRODUCT.md §Evidence on Hand — la regla no tiene excepción de plazo).
 *
 * EL BARRIDO ES UN TRAZO, NO UNA VELADURA
 *
 * El blueprint pide un `clip-path` que barra de izquierda a derecha al pasar el
 * cursor. Lo que barre es la regla capilar superior de la tarjeta, que se pinta
 * de --coral de un lado al otro. Dos razones para que sea eso y no un lienzo de
 * color:
 *
 * - --coral no puede quedar DEBAJO de una letra a ningún tamaño (3.3:1). Un
 *   barrido que pase por detrás del texto rompe el par de contraste de toda la
 *   tarjeta; uno que recorre la regla no toca un solo píxel de texto.
 * - `transform: scaleX` compone en el navegador y `clip-path` sobre una caja
 *   grande no siempre. Es un píxel de alto: el efecto es el mismo y el costo
 *   de fotograma es cero, que es lo que el presupuesto medido en el paso 6
 *   pide gastar con cuidado.
 *
 * Se dispara con `group-hover` y también con `group-focus-within`: quien navega
 * con teclado ve la misma señal que quien usa el ratón. `motion-reduce` la deja
 * instantánea — la señal se conserva, el movimiento no. Prohibido `scale()`
 * sobre la tarjeta: empujaría el layout.
 *
 * ENLACE: el título lleva el `<Link>` y un `::after` lo estira sobre la tarjeta
 * entera. Así el nombre accesible del enlace es el del caso —y no los tres
 * párrafos— pero el área de toque es toda la tarjeta.
 *
 * ⚠️ `/casos/[slug]` da 404 hasta el paso 9, igual que la navegación del
 * header desde el paso 3. Es el orden del blueprint, no un descuido: se
 * prefiere eso a sembrar páginas de relleno que después hay que acordarse de
 * borrar.
 */
export function Casos() {
  const { eyebrow, titulo, entrada, enlace } = home.casos;

  return (
    <section
      aria-labelledby="casos-titulo"
      className="mx-auto w-full max-w-[1160px] px-6 py-[clamp(80px,10vw,140px)]"
    >
      <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[55fr_45fr] lg:items-end">
        <div>
          <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
          <h2 id="casos-titulo" className="mt-5 text-[clamp(32px,5.5vw,64px)]">
            {titulo}
          </h2>
        </div>
        <p className="max-w-[46ch] text-gray lg:pb-2">{entrada}</p>
      </div>

      <ul className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {casos.map((caso) => (
          <li
            key={caso.slug}
            className="group relative border-t border-black/15 pt-8"
          >
            {/* El barrido. `-top-px` lo pone exactamente encima de la regla
                base, no debajo de ella. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-coral transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:transition-none"
            />

            <Metrica valor={caso.metrica.valor} etiqueta={caso.metrica.etiqueta} />

            <h3 className="mt-8 text-[clamp(22px,2.6vw,28px)]">
              <Link
                href={`/casos/${caso.slug}`}
                className="inline-flex min-h-11 min-w-11 items-center underline-offset-[6px] after:absolute after:inset-0 group-hover:underline group-hover:decoration-coral"
              >
                {caso.cliente ?? caso.industria}
              </Link>
            </h3>

            {/* El caso anónimo ya usa su giro como título: repetirlo debajo
                sobraría. */}
            {caso.cliente ? (
              <p className="mt-1 text-sm text-gray">{caso.industria}</p>
            ) : null}

            <p className="mt-4 max-w-[38ch] text-sm text-gray">{caso.resumen}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14">
        <ButtonLink nivel="terciario" href={enlace.href}>
          {enlace.label}
        </ButtonLink>
      </div>
    </section>
  );
}
