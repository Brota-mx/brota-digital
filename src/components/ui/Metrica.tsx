import { Contador } from "@/components/ui/Contador";

/**
 * Métrica de caso (blueprint §4, efecto #4): número descomunal en Fraunces con
 * una regla capilar creciendo debajo.
 *
 * El estado que ves escrito aquí ES el estado final: número completo y regla
 * con su ancho de destino. Las dos piezas de movimiento se montan encima y
 * cada una sabe volver sola a este estado —`Contador` si no hay JavaScript o
 * el usuario pide menos movimiento, `.metrica-regla` si el navegador no tiene
 * líneas de tiempo de scroll—. Es la guarda del blueprint («apagar el
 * movimiento sin perder contenido») construida como un solo estado que
 * mantener, no como dos.
 *
 * `font-display` es explícito porque el valor es un `<p>`, y Fraunces solo está
 * puesta por defecto en h1-h3. `tabular-nums` evita que el número baile de
 * ancho mientras el contador lo recorre.
 *
 * El texto sale de `content/casos.ts` (`metrica.valor` / `metrica.etiqueta`).
 *
 * Los tres llamadores —la home, `/casos` y `/casos/[slug]`— la pintan sobre
 * crema. Tuvo una variante `invertida` para superficies negras que ninguno de
 * los tres llegó a usar nunca: se borró. Si algún día una métrica cae sobre
 * `--black`, el color de las dos líneas se decide entonces, sabiendo cuál es la
 * superficie — y no antes, adivinando.
 */
export function Metrica({
  valor,
  etiqueta,
}: {
  valor: string;
  etiqueta: string;
}) {
  return (
    <div>
      <p className="font-display text-[clamp(48px,8vw,96px)] leading-[0.95] font-semibold tracking-[-0.02em] text-black tabular-nums">
        <Contador valor={valor} />
      </p>
      {/* La regla crece con `animation-timeline: view()` — cero JavaScript, y
          donde no hay soporte se queda con su ancho final. Ver `globals.css`. */}
      <div className="metrica-regla mt-5 h-px w-14 origin-left bg-coral" />
      <p className="mt-5 max-w-[24ch] text-sm text-gray">{etiqueta}</p>
    </div>
  );
}
