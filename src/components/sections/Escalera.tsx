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
 * `--cream-2` es el token de «superficie elevada» y este es exactamente su
 * trabajo. La regla capilar se conserva encima: el lenguaje editorial del
 * blueprint (reglas capilares en vez de bordes de caja) sigue ahí, pero ahora
 * delimita una superficie en lugar de flotar sobre el lienzo.
 *
 * ⚠️ Y OBLIGA A VIGILAR EL CONTRASTE. `--gray` sobre `--cream-2` da 4.65:1
 * contra los 5.1:1 que da sobre `--cream`: sigue pasando AA, pero con menos
 * margen. Es la misma frontera donde `--coral-ink` ya reprueba (4.13:1), así
 * que en estas tarjetas el acento no toca letra y la jerarquía se hace con
 * tamaño y peso.
 *
 * El 4.65 sale de los colores computados de los dos elementos, NO de muestrear
 * los píxeles pintados: no incluye el grano de papel. El grano solo aclara
 * (ver `ui/Grano.tsx`), así que sobre fondo claro solo puede subir esa cifra —
 * pero si algún día el grano vuelve a oscurecer, este número se cae y hay que
 * remedirlo con muestreo real.
 *
 * EN MÓVIL SE APILAN
 *
 * Iban en carrusel horizontal con la siguiente asomando, para poder comparar
 * alturas en el dispositivo por donde entra la mayoría del tráfico. No
 * funcionaba: a 375px solo cabe una tarjeta, así que **no hay nada con qué
 * comparar** — el argumento entero del efecto desaparecía igual, y encima la
 * tarjeta cortada del borde derecho se leía como un error de maquetación.
 *
 * Apiladas y sin altura mínima, cada peldaño se lee completo y el vacío se
 * acaba. La escalera es un efecto de escritorio: donde caben las cuatro juntas
 * y la comparación es posible.
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
            <li key={servicio.id} className={`flex ${alturas[i]}`}>
              <div
                // `md:justify-end` cuelga el contenido de la base: el aire de
                // arriba es lo que hace visible el peldaño. En móvil no aplica
                // — sin altura mínima no hay aire que repartir, y el contenido
                // se lee de arriba abajo como cualquier tarjeta.
                // `glass3d`: sombra proyectada + bisel interior. El relleno
                // opaco se QUEDA — `bg-cream-2` y `bg-black` son lo que hace
                // legible la silueta de la escalera, y quitarlo para que el
                // desenfoque tuviera algo que hacer devolvería el problema que
                // documenta el bloque de arriba (tarjetas que se leían como
                // huecos de carga). Detrás de esta sección solo hay crema
                // plano: el desenfoque no tiene variedad que mezclar y lo que
                // se ve del vidrio es el relieve, no lo esmerilado.
                className={`glass3d flex w-full flex-col md:justify-end ${
                  esUltimo
                    ? // `glass3d-invertido` apaga el grano del vidrio. El grano
                      // solo aclara, y sobre esta tarjeta negra subía tanto la
                      // luminancia del fondo que --cream-2 caía de 15.2:1 a
                      // 2.90:1. Es la misma trampa de `ui/Grano.tsx` con el
                      // signo cambiado: allí el problema era oscurecer el
                      // crema, aquí es aclarar el negro.
                      "glass3d-invertido bg-black p-8 text-cream-2 sm:p-10"
                    : "border-t border-black/15 bg-cream-2 p-6 sm:p-8"
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
  );
}
