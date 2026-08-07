/**
 * Métrica de caso (blueprint §4, efecto #4): número descomunal en Fraunces con
 * una regla capilar creciendo debajo.
 *
 * Aquí queda en su estado final y estático. El contador ascendente llega en el
 * paso 7, y la regla ya está dibujada con el ancho de destino a propósito: el
 * blueprint manda que `prefers-reduced-motion` apague el movimiento **sin
 * perder contenido**, así que el estado sin animación tiene que ser este mismo,
 * no un hueco esperando JavaScript.
 *
 * `font-display` es explícito porque el valor es un `<p>`, y Fraunces solo está
 * puesta por defecto en h1-h3. `tabular-nums` evita que el número baile de
 * ancho cuando el contador del paso 7 lo recorra.
 *
 * El texto sale de `content/casos.ts` (`metrica.valor` / `metrica.etiqueta`).
 */
export function Metrica({
  valor,
  etiqueta,
  invertida = false,
}: {
  valor: string;
  etiqueta: string;
  invertida?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-display text-[clamp(48px,8vw,96px)] leading-[0.95] font-semibold tracking-[-0.02em] tabular-nums ${
          invertida ? "text-cream-2" : "text-black"
        }`}
      >
        {valor}
      </p>
      <div className="mt-5 h-px w-14 bg-coral" />
      <p
        className={`mt-5 max-w-[24ch] text-sm ${
          invertida ? "text-cream-2" : "text-gray"
        }`}
      >
        {etiqueta}
      </p>
    </div>
  );
}
