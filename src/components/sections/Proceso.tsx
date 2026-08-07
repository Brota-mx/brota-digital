import { Eyebrow } from "@/components/ui/Eyebrow";
import { home } from "@/content/home";
import { proceso } from "@/content/servicios";

/**
 * Proceso comercial en cuatro pasos.
 *
 * `id="proceso"` no es decorativo: el sitio anterior publica `#proceso` como
 * ancla y el plan de migración del blueprint §6 la redirige a `/#proceso`. Si
 * este identificador cambia, hay que cambiar también el mapa de 301 del paso 12.
 *
 * Sección sin una sola línea de movimiento, y es deliberado: el presupuesto de
 * fotograma medido en el paso 6 se gasta donde el efecto significa algo. Aquí
 * la jerarquía la hacen el número, la regla capilar y el aire.
 */
export function Proceso() {
  const { eyebrow, titulo } = home.proceso;

  return (
    <section
      id="proceso"
      aria-labelledby="proceso-titulo"
      className="mx-auto w-full max-w-[1160px] px-6 py-[clamp(80px,10vw,140px)]"
    >
      <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
      <h2
        id="proceso-titulo"
        className="mt-5 max-w-[18ch] text-[clamp(32px,5.5vw,64px)]"
      >
        {titulo}
      </h2>

      <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {proceso.map((paso) => (
          <li key={paso.n} className="border-t border-black/15 pt-6">
            {/* El número es dato de contenido (`content/servicios.ts`), no un
                contador del marcado: la lista se puede reordenar sin que la
                numeración visible mienta. */}
            <p className="font-display text-2xl font-semibold text-coral-ink tabular-nums">
              {paso.n}
            </p>
            <h3 className="mt-4 text-[clamp(20px,2.2vw,24px)]">{paso.titulo}</h3>
            <p className="mt-3 text-sm text-gray">{paso.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
