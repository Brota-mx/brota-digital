import { home } from "@/content/home";

/**
 * Marquee (blueprint §4, efecto #7): la tira que ya existía en el sitio
 * anterior, con la tipografía nueva y más lenta.
 *
 * DOS COPIAS EXACTAS, Y POR QUÉ IMPORTA
 *
 * El bucle es un `translateX(-50%)` sobre una pista que contiene el mismo
 * grupo dos veces, así que a mitad del recorrido la pista se ve idéntica al
 * inicio y el salto no existe. Para que el 50% caiga EXACTAMENTE en la costura,
 * la separación entre palabras es padding de cada elemento y no `gap` de la
 * pista: con `gap`, el ancho total lleva un hueco de más y las dos mitades
 * dejan de medir lo mismo. La segunda copia va `aria-hidden`: es la misma
 * lista, y un lector de pantalla no tiene por qué oírla dos veces.
 *
 * `linear` es de las poquísimas excepciones a la regla de easing del blueprint
 * §4. Un desplazamiento continuo con `ease` acelera y frena en cada vuelta, que
 * es justo el tirón que la regla intenta evitar en las micro-interacciones.
 *
 * PAUSA: es un requisito, no una cortesía
 *
 * Contenido en movimiento que dura más de cinco segundos necesita una forma de
 * detenerlo (WCAG 2.2.2). El hover la da con el ratón y no con el teclado, así
 * que la tira es enfocable y también se detiene al recibir el foco: una parada
 * de tabulación, con su anillo visible, que hace evidente que se puede parar.
 * Y `prefers-reduced-motion` la deja quieta desde el principio, con las
 * palabras a la vista — apagar el movimiento sin perder contenido.
 */
export function Marquee() {
  const palabras = home.marquee;

  const copia = (
    <div className="flex items-center">
      {palabras.map((palabra) => (
        <span key={palabra} className="flex items-center">
          <span className="px-6 text-sm whitespace-nowrap sm:px-9">
            {palabra}
          </span>
          {/* Separador como forma y no como carácter: --coral está prohibido
              para texto a cualquier tamaño, y un «·» sería texto. */}
          <span
            aria-hidden="true"
            className="h-1 w-1 shrink-0 rounded-full bg-coral"
          />
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-label={palabras.join(", ")}
      tabIndex={0}
      // `bg-cream` no es decorativo: es la única sección cuyo texto se desplaza
      // a lo ancho, así que las palabras pasan por el canalón por donde baja el
      // tallo. Un fondo opaco lo tapa aquí —el tallo vive en `-z-10`— y evita
      // que --coral quede detrás de una letra, que está prohibido a cualquier
      // tamaño. Es el mismo comportamiento que ya tenían el pie y las tarjetas
      // invertidas con el grano.
      className="marquee overflow-hidden border-y border-black/15 bg-cream py-5"
    >
      <div className="marquee-pista flex w-max">
        {copia}
        <div aria-hidden="true" className="flex">
          {copia}
        </div>
      </div>
    </section>
  );
}
