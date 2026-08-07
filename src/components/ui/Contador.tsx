"use client";

import { useEffect, useRef } from "react";

/**
 * Contador ascendente de las métricas (blueprint §4, efecto #4).
 *
 * Renderiza SIEMPRE el valor final en el servidor y solo lo recorre desde cero
 * al montar, si el número entra en pantalla. De ahí salen las tres degradaciones
 * sin escribir ninguna a mano:
 *
 * - sin JavaScript → el valor final, ya visible;
 * - `prefers-reduced-motion: reduce` → el valor final, sin recorrido (la guarda
 *   del blueprint: apagar el movimiento SIN perder contenido);
 * - valor no numérico → el valor final, tal cual.
 *
 * Se dispara una sola vez (`io.disconnect()` en el primer cruce) y se apaga
 * solo: no queda ni observador ni `requestAnimationFrame` vivos.
 */
export function Contador({ valor }: { valor: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const destino = Number(valor);
    if (!Number.isFinite(destino)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cuadro = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();

        const inicio = performance.now();
        const DURACION = 900; // §4: secciones 300-500ms; un recorrido numérico
        // necesita más para leerse, y sigue siendo de un solo disparo.
        const paso = (ahora: number) => {
          const avance = Math.min(1, (ahora - inicio) / DURACION);
          // ease-out: llega desacelerando, nunca `linear` (§4).
          const suave = 1 - (1 - avance) ** 3;
          el.textContent = String(Math.round(destino * suave));
          if (avance < 1) cuadro = requestAnimationFrame(paso);
          // El último fotograma escribe el string original, no el redondeo:
          // así un "07" o un "1.5" acaban exactamente como los escribió
          // `content/`, sin que el contador les cambie el formato.
          else el.textContent = valor;
        };
        cuadro = requestAnimationFrame(paso);
      },
      { threshold: 0.6 },
    );

    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(cuadro);
    };
  }, [valor]);

  return <span ref={ref}>{valor}</span>;
}
