import type { CSSProperties } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { home } from "@/content/home";
import { servicios } from "@/content/servicios";

/**
 * La escalera (blueprint §4, efecto #3 · PRODUCT.md §Positioning).
 *
 * Es el argumento estructural del sitio, no una tabla de precios: el visitante
 * se autoclasifica y ve el camino completo por delante.
 *
 * LA PROGRESIÓN ES ALTURA, NO ANIMACIÓN
 *
 * El blueprint pide que las tarjetas escalen 100% → 116% → 134% → 156%. Aquí
 * eso es una altura mínima creciente y nada más: cero JavaScript, cero
 * movimiento, cero presupuesto de fotograma gastado. Con las cuatro alineadas
 * por la base, la silueta ES el gráfico. Ecosistema además invierte a negro,
 * porque es el salto de escala, no un color más.
 *
 * ⚠️ LAS TRES PRIMERAS LLEVAN SUPERFICIE, Y ES LO QUE HACE QUE LA ESCALERA EXISTA
 *
 * Al principio eran transparentes, con solo la regla capilar de 1px arriba, y
 * el efecto no funcionaba: medido en la home, entre el 49% y el 57% de cada
 * tarjeta era aire vacío colgando de una línea al 15% de negro. Una silueta
 * hecha de tres rayitas casi invisibles no es una silueta — la única que se
 * leía era Ecosistema, porque su fondo negro sí tiene cuerpo, y por eso las
 * otras tres parecían huecos de carga en vez de peldaños.
 *
 * Esa superficie ya NO es un `bg-cream-2` opaco. La pinta el `::before` del
 * vidrio con `--color-glass3d`, un `--cream-2` al 62%, y el último peldaño un
 * `--black` al 86%. El cambio no es estético: el `::before` es la capa que
 * lleva el `backdrop-filter`, así que un relleno opaco en el elemento tapaba
 * el desenfoque y del vidrio solo quedaba la sombra — las cuatro tarjetas
 * parecían cartón recortado. La regla capilar se conserva encima, y el
 * lenguaje editorial del blueprint sigue ahí.
 *
 * Y por eso la sección tiene fondo propio (`.malla-escalera`, tres gradientes
 * radiales estáticos en `globals.css`): sin variedad detrás, `backdrop-filter`
 * no tiene nada que mezclar y el vidrio no existe.
 *
 * ⚠️ Y OBLIGA A VIGILAR EL CONTRASTE, ahora más que antes: el texto se apoya
 * en una superficie translúcida sobre un gradiente, así que el número no se
 * puede calcular de dos colores computados — hay que muestrear los píxeles
 * pintados. Medido a 375px, peor píxel bajo cada párrafo:
 *
 *   Siembra 4.59 · Cosecha 4.70 · Selva 4.63   (--gray, mínimo 4.5)
 *   Ecosistema 10.21                           (--cream-2)
 *
 * Márgenes de centésimas. Subir la intensidad de `.malla-escalera` los rompe,
 * y Siembra es donde se rompe primero. `--coral-ink` aquí no toca letra ni de
 * lejos: la jerarquía se hace con tamaño y peso.
 *
 * EN MÓVIL SE APILAN, Y AHORA LITERALMENTE
 *
 * Iban en carrusel horizontal con la siguiente asomando, para poder comparar
 * alturas en el dispositivo por donde entra la mayoría del tráfico. No
 * funcionaba: a 375px solo cabe una tarjeta, así que **no hay nada con qué
 * comparar** — el argumento entero del efecto desaparecía igual, y encima la
 * tarjeta cortada del borde derecho se leía como un error de maquetación.
 *
 * Hoy, por debajo de `md`, cada peldaño es `position: sticky` y se clava 14px
 * más abajo que el anterior: el siguiente le pasa por encima y va quedando una
 * pila con los títulos asomando. Es el efecto de ScrollStack sin ScrollStack —
 * cero dependencias, cero JavaScript, cero rAF. La librería original monta
 * Lenis, que secuestra el scroll de toda la página, no trae guarda de
 * `prefers-reduced-motion` y anima `filter: blur` por fotograma; nada de eso
 * cabe en un sitio cuyo hero ya dejó Lighthouse en 47. Lo que sí se pierde es
 * el escalado y el desenfoque progresivo de las tarjetas de abajo: eso sí
 * necesita trabajo por fotograma.
 *
 * `sticky` no es animación, así que no hay nada que apagar con
 * `prefers-reduced-motion`. Desde `md` se desactiva: ahí caben las cuatro
 * juntas y la silueta de alturas ya es el gráfico.
 *
 * EL SUELO
 *
 * La regla capilar de --coral bajo las cuatro es el suelo del que brotan los
 * peldaños. Era la parte horizontal del trazo del efecto #1, que bajaba por el
 * canalón y al llegar aquí se acostaba; ese trazo se borró el 11-ago y el suelo
 * se queda, porque solo el suelo ya ordena la escalera. Va debajo de las tarjetas y
 * nunca detrás de una letra: --coral está prohibido como texto y como fondo de
 * texto.
 *
 * LA SUPERFICIE ES CLASES, NO UN COMPONENTE
 *
 * Las tarjetas fueron un `<Card>` en `components/ui/`. Se disolvió aquí: en
 * todo el sitio esta sección era su único consumidor, y su única variante
 * —`invertida`— la usaba un solo peldaño. Un componente con un solo llamador no
 * abstrae nada; solo obliga a abrir dos archivos para leer una tarjeta. Si algún
 * día una segunda sección necesita la misma superficie, ahí se vuelve a extraer,
 * y ese día sí sabremos qué tienen en común las dos.
 */

// 100% · 116% · 134% · 156% del blueprint, sobre una base de 300px. Es altura
// MÍNIMA: si un peldaño necesita más, crece, y la progresión se mantiene porque
// las cuatro comparten base.
//
// Solo desde `md`. En móvil las tarjetas van apiladas y a su altura natural: la
// altura mínima ahí no dibuja ninguna escalera —no hay dos tarjetas a la vista
// que comparar— y lo único que produce es el vacío que hacía ilegible la
// sección.
const alturas = [
  "md:min-h-[300px]",
  "md:min-h-[348px]",
  "md:min-h-[402px]",
  "md:min-h-[468px]",
];

export function Escalera() {
  const { eyebrow, titulo, entrada, enlace } = home.escalera;

  return (
    // El envoltorio existe solo para que el fondo sea a sangre. La sección va
    // acotada a 1160px, así que una capa `absolute inset-0` dentro de ella se
    // cortaría en el canalón; y estirarla con `w-screen` mete 100vw en una
    // página con barra de scroll, que es desborde horizontal garantizado
    // (regla 17). Un div envolvente de ancho natural no tiene ese problema.
    <div className="relative">
      {/* Lo que las tarjetas desenfocan. Sin esto el vidrio es solo sombra. */}
      <div
        aria-hidden="true"
        className="malla-escalera absolute inset-0 -z-20"
      />

      <section
        aria-labelledby="escalera-titulo"
        className="mx-auto w-full max-w-[1160px] px-6 py-[clamp(80px,10vw,140px)]"
      >
        <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[55fr_45fr] lg:items-end">
          <div>
            <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
            <h2
              id="escalera-titulo"
              className="mt-5 text-[clamp(32px,5.5vw,64px)]"
            >
              {titulo}
            </h2>
          </div>
          <p className="max-w-[46ch] text-gray lg:pb-2">{entrada}</p>
        </div>

        <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-4 md:items-end md:gap-6">
          {servicios.map((servicio, i) => {
            // Ecosistema, el último peldaño. Invierte a negro porque es el salto
            // de escala de la escalera, no un color más — y eso cambia el color
            // de todo lo que lleva dentro.
            const esUltimo = i === servicios.length - 1;

            return (
              <li
                key={servicio.id}
                // La pila por scroll, en la vista de una sola columna. Es
                // `position: sticky` y nada más: cada peldaño se clava un poco
                // más abajo que el anterior y el siguiente le pasa por encima.
                // El índice viaja como variable para que el escalonado no
                // dependa de un `nth-child` que habría que tocar si algún día
                // hay un quinto peldaño.
                //
                // Desde `md` se apaga: ahí las cuatro están una al lado de la
                // otra y la silueta de alturas ya es el gráfico.
                style={{ "--i": i } as CSSProperties}
                className={`flex max-md:sticky max-md:top-[calc(72px+var(--i)*14px)] ${alturas[i]}`}
              >
                <div
                  // `md:justify-end` cuelga el contenido de la base: el aire de
                  // arriba es lo que hace visible el peldaño. En móvil no aplica
                  // — sin altura mínima no hay aire que repartir, y el contenido
                  // se lee de arriba abajo como cualquier tarjeta.
                  // ⚠️ SIN `bg-*`. El relleno lo pinta el `::before` del vidrio
                  // con `--color-glass3d`, que es la misma capa que lleva el
                  // `backdrop-filter`: así el tinte se mezcla con el fondo ya
                  // desenfocado. Con `bg-cream-2` opaco —como estaba— el relleno
                  // tapaba el desenfoque, del efecto solo quedaba la sombra, y
                  // las cuatro tarjetas parecían cartón recortado.
                  //
                  // La superficie que el bloque de arriba declara imprescindible
                  // sigue ahí: el tinte del vidrio es opaco al 62% y la silueta
                  // de la escalera se lee igual. Lo que cambió es quién lo pinta.
                  // El radio es lo que el CSS del vidrio daba por hecho: sus
                  // dos pseudoelementos llevan `border-radius: inherit`, así
                  // que sin radio en la pieza el bisel dibuja una caja de
                  // cantos vivos y el efecto se lee como papel recortado.
                  className={`glass3d flex w-full flex-col rounded-[28px] md:justify-end ${
                    esUltimo
                      ? "glass3d-invertido p-8 text-cream-2 sm:p-10"
                      : "glass3d-crema border-t border-black/15 p-6 sm:p-8"
                  }`}
                >
                  <h3 className="text-[clamp(24px,3vw,34px)]">
                    {servicio.nombre}
                  </h3>
                  <p
                    className={`mt-3 text-sm ${
                      esUltimo ? "text-cream-2" : "text-gray"
                    }`}
                  >
                    {servicio.promesa}
                  </p>
                  {/* En la tarjeta invertida el rango va en --cream-2 (15.2:1) y
                    no en --coral-ink, que sobre negro da 3.7:1 y reprueba AA. */}
                  <p
                    className={`mt-5 text-sm font-medium ${
                      esUltimo ? "text-cream-2" : "text-black"
                    }`}
                  >
                    {servicio.rango}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* El suelo. Pegado a la base de las cuatro tarjetas y con `-mx-6` para
          que llegue hasta el canalón, que es donde empiezan y acaban todas las
          reglas horizontales de la página. */}
        <div aria-hidden="true" className="-mx-6 h-px bg-coral" />

        <div className="mt-10">
          <ButtonLink nivel="terciario" href={enlace.href}>
            {enlace.label}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
