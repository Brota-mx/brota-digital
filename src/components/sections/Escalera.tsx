import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
 * por la base, sus reglas capilares superiores dibujan los peldaños — la
 * silueta ES el gráfico. Ecosistema además invierte a negro, porque es el
 * salto de escala, no un color más.
 *
 * EN MÓVIL VA DE LADO, Y NO ES UN CAPRICHO
 *
 * Apilada verticalmente a 375px nunca se ven dos tarjetas juntas y la
 * comparación de alturas —que es el argumento entero del efecto— desaparece
 * justo en el dispositivo por donde entra la mayoría del tráfico. Por eso
 * `scroll-snap` horizontal con la siguiente asomando (`w-[78%]`), que es
 * también el indicio de que hay más a la derecha.
 *
 * Sin `tabIndex` en el contenedor a propósito: cada peldaño lleva su enlace, y
 * al tabular hasta él el navegador desplaza el carrusel solo. Un `tabindex` en
 * el contenedor añadiría una parada de teclado que en escritorio —donde esto
 * es una rejilla y no scrollea— no haría absolutamente nada.
 *
 * EL SUELO
 *
 * La regla capilar de --coral bajo las cuatro es el mismo trazo que baja por el
 * canalón: al llegar aquí se acuesta y se vuelve el suelo del que brotan los
 * peldaños. Es lo que enhebra la escalera con el tallo (blueprint §4, efecto
 * #1: «conecta secciones y enlaza los 4 peldaños»). Va debajo de las tarjetas y
 * nunca detrás de una letra: --coral está prohibido como texto y como fondo de
 * texto.
 */

// 100% · 116% · 134% · 156% del blueprint, sobre una base de 260px en móvil y
// 300px en escritorio. Es altura MÍNIMA: si un peldaño necesita más, crece, y
// la progresión se mantiene porque las cuatro comparten base.
const alturas = [
  "min-h-[260px] md:min-h-[300px]",
  "min-h-[302px] md:min-h-[348px]",
  "min-h-[348px] md:min-h-[402px]",
  "min-h-[406px] md:min-h-[468px]",
];

export function Escalera() {
  const { eyebrow, titulo, entrada, enlace, ayudaScroll } = home.escalera;

  return (
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

      <p className="mt-10 text-sm text-gray md:hidden">{ayudaScroll}</p>

      <ul className="mt-4 flex snap-x snap-mandatory items-end gap-4 overflow-x-auto md:mt-14 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible">
        {servicios.map((servicio, i) => (
          <li
            key={servicio.id}
            className={`w-[78%] shrink-0 snap-start md:w-auto ${alturas[i]} flex`}
          >
            <Card
              invertida={i === servicios.length - 1}
              // `justify-end` cuelga el contenido de la base: el aire de arriba
              // es lo que hace visible el peldaño. El `pb-6` de las tres
              // primeras despega el texto del suelo coral —sin él, la regla se
              // lee como el subrayado del precio—; la invertida ya trae su
              // propio relleno.
              className={`w-full justify-end ${
                i === servicios.length - 1 ? "" : "pb-6"
              }`}
            >
              <h3 className="text-[clamp(24px,3vw,34px)]">{servicio.nombre}</h3>
              <p
                className={`mt-3 text-sm ${
                  i === servicios.length - 1 ? "text-cream-2" : "text-gray"
                }`}
              >
                {servicio.promesa}
              </p>
              {/* En la tarjeta invertida el rango va en --cream-2 (15.2:1) y no
                  en --coral-ink, que sobre negro da 3.7:1 y reprueba AA. */}
              <p
                className={`mt-5 text-sm font-medium ${
                  i === servicios.length - 1 ? "text-cream-2" : "text-black"
                }`}
              >
                {servicio.rango}
              </p>
            </Card>
          </li>
        ))}
      </ul>

      {/* El suelo. Pegado a la base de las cuatro tarjetas y con `-mx-6` para
          que llegue hasta el canalón: ahí es donde se cruza con el tallo que
          baja por la página, que es lo que hace que se lean como una sola
          línea y no como dos adornos. */}
      <div aria-hidden="true" className="-mx-6 h-px bg-coral" />

      <div className="mt-10">
        <ButtonLink nivel="terciario" href={enlace.href}>
          {enlace.label}
        </ButtonLink>
      </div>
    </section>
  );
}
