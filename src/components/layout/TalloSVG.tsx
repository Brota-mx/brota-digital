"use client";

import { useEffect, useRef } from "react";

/**
 * El trazo que brota (blueprint §4, efecto #1 — la firma del sitio).
 *
 * Un tallo capilar de 1px en --coral que crece de abajo hacia arriba conforme
 * se hace scroll. No aparece: emerge. Es el hilo conductor del sistema visual
 * ("la marca se llama Brota, los efectos crecen") y en el paso 7 será lo que
 * enhebre las secciones de la home y los 4 peldaños de la escalera.
 *
 * CÓMO CRECE
 *
 * `pathLength="1"` normaliza la longitud del trazo a 1 sin importar la forma ni
 * el estiramiento del viewBox, así que el progreso del scroll (0→1) ES el
 * `stroke-dashoffset`, sin una sola multiplicación. Con `stroke-dasharray="1 1"`,
 * offset 1 = nada dibujado y offset 0 = trazo completo.
 *
 * El animado vive en `globals.css` (`.tallo-trazo`) porque tiene que ser CSS:
 *
 *   1. `animation-timeline: scroll(root block)` donde haya soporte. El navegador
 *      lo corre FUERA del hilo principal — es el mandato técnico del blueprint
 *      §4 y la razón de que no haya tirones en móvil de gama media.
 *   2. `@media (prefers-reduced-motion: reduce)` lo apaga dejando el trazo
 *      ENTERO (offset 0), no vacío. La guarda quita el movimiento, nunca el
 *      dibujo.
 *   3. Sin soporte y sin JS, el valor base también es 0: el tallo se ve
 *      completo. Un efecto decorativo jamás degrada a "invisible para siempre".
 *
 * Y ESTE COMPONENTE
 *
 * Es el respaldo del punto 1: listener de scroll + `requestAnimationFrame` para
 * los navegadores sin scroll timelines (hoy Firefox y Safari). Se declara
 * cliente solo por eso; el SVG se sigue sirviendo renderizado desde el servidor.
 *
 * Si el navegador sí soporta la línea de tiempo, el efecto NO monta nada: se
 * sale en la primera línea y el CSS hace todo el trabajo. Y si el usuario pide
 * menos movimiento, escribe el estado final y se queda ahí — la misma guarda
 * que el CSS, porque en esta rama el CSS ya no la puede aplicar.
 *
 * Decoración pura: `aria-hidden` y sin objetivo de puntero. No lleva texto, así
 * que no toca `content/`.
 *
 * ⚠️ MEDIDO: la línea de tiempo de scroll NO saca esto del hilo principal
 *
 * El blueprint pide `animation-timeline: scroll()` para que no haya tirones en
 * gama media, y da a entender que con eso el efecto sale gratis. No sale:
 * `stroke-dashoffset` no es una propiedad que el compositor pueda animar, así
 * que el navegador repinta el SVG en cada fotograma aunque la línea de tiempo
 * sea nativa. A 375px con la CPU frenada 6× (3 vueltas por condición, orden
 * alternado):
 *
 *   sin el tallo            mediana 12.5 ms
 *   tallo presente sin animar  12.6 ms   ← estar ahí no cuesta nada
 *   tallo animado              16.7 ms   ← animar cuesta ~4 ms/fotograma
 *
 * Cuatro milisegundos sobre un presupuesto de 16.7 es un cuarto del fotograma
 * por UN elemento, y los conteos de fotogramas largos se solapan con el
 * control: hoy no hay tirón. Pero el paso 7 mete más movimiento en la misma
 * vista y el presupuesto es compartido — la regla de "máximo 1-2 elementos
 * animados por vista" del blueprint §4 tiene aquí su número, y conviene
 * volver a medir cuando el hero y las métricas se sumen. Si algún día no
 * alcanza, la salida es una técnica que sí componga (`transform` sobre un
 * trazo recto), a costa de la curva.
 *
 * ⚠️ El tallo vive en el canalón de la rejilla (el `px-6` del contenedor), no
 * debajo del texto. Es --coral, que está prohibido como letra: si algún día
 * cruza por detrás de una línea de texto, el par de contraste deja de ser
 * "coral-ink sobre crema" y hay que volver a medir.
 */
export function TalloSVG({ className = "" }: { className?: string }) {
  const trazo = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = trazo.current;
    if (!path) return;

    // El navegador sabe hacerlo solo y mejor (compositor, no hilo principal).
    if (CSS.supports("animation-timeline", "scroll()")) return;

    const menosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const dibujar = () => {
      if (menosMovimiento.matches) {
        // Misma guarda que el CSS: sin movimiento, pero con el trazo completo.
        path.style.strokeDashoffset = "0";
        return;
      }
      // El mismo progreso que `scroll(root block)`: recorrido / recorrido total.
      const recorrido =
        document.documentElement.scrollHeight - window.innerHeight;
      const avance = recorrido > 0 ? window.scrollY / recorrido : 1;
      path.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, avance)));
    };

    let pendiente = false;
    const alHacerScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        dibujar();
      });
    };

    dibujar();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    menosMovimiento.addEventListener("change", dibujar);
    return () => {
      window.removeEventListener("scroll", alHacerScroll);
      menosMovimiento.removeEventListener("change", dibujar);
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 1000"
      // El tallo se estira a lo alto de su contenedor; el trazo NO se deforma
      // con él gracias a `non-scaling-stroke`, que lo deja en 1px real siempre.
      preserveAspectRatio="none"
      // `h-full` no es redundante con `inset-y-0`: un SVG es un elemento
      // reemplazado y, con `height:auto`, la ecuación de posicionamiento
      // absoluto se sobredetermina y el navegador ignora el `bottom`. Sin esta
      // clase el tallo se queda en la altura intrínseca de su viewBox —1000px
      // medidos— y cubre solo el primer tercio de la página.
      className={`pointer-events-none absolute inset-y-0 -z-10 h-full w-6 ${className}`}
    >
      <path
        ref={trazo}
        className="tallo-trazo stroke-coral"
        d="M12 1000 C 4 880, 20 760, 12 640 S 4 400, 12 280 S 20 120, 12 0"
        fill="none"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        strokeDasharray="1 1"
      />
    </svg>
  );
}
