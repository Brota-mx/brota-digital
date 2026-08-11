/**
 * El trazo que brota (blueprint §4, efecto #1 — la firma del sitio).
 *
 * Un tallo capilar de 1px en --coral que crece de abajo hacia arriba conforme
 * se hace scroll. No aparece: emerge. Es el hilo conductor del sistema visual
 * ("la marca se llama Brota, los efectos crecen") y en la home enhebra las
 * secciones y los 4 peldaños de la escalera.
 *
 * CÓMO CRECE
 *
 * `pathLength="1"` normaliza la longitud del trazo a 1 sin importar la forma ni
 * el estiramiento del viewBox, así que el progreso del scroll (0→1) ES el
 * `stroke-dashoffset`, sin una sola multiplicación. Con `stroke-dasharray="1 1"`,
 * offset 1 = nada dibujado y offset 0 = trazo completo.
 *
 * TODO EL MOVIMIENTO VIVE EN `globals.css` (`.tallo-trazo`), Y NO HAY RESPALDO
 *
 * Son tres estados, y los tres los resuelve el CSS:
 *
 *   1. Con `animation-timeline: scroll(root block)` — el trazo crece con el
 *      avance del documento. Es el mandato técnico del blueprint §4.
 *   2. Con `prefers-reduced-motion: reduce` — el trazo ENTERO (offset 0), no
 *      vacío. La guarda quita el movimiento, nunca el dibujo.
 *   3. Sin soporte de líneas de tiempo de scroll y sin JavaScript — el valor
 *      base también es 0: el trazo se ve completo, quieto.
 *
 * El tercer caso (hoy Firefox y Safari) tuvo durante un tiempo un respaldo de
 * `scroll` + `requestAnimationFrame` que replicaba el crecimiento a mano. Se
 * borró: 45 líneas y una frontera de cliente para que un adorno se mueva en dos
 * navegadores, cuando el estado sin respaldo ya era el que este mismo archivo
 * declaraba aceptable — «un efecto decorativo jamás degrada a invisible», y no
 * degrada: degrada a dibujado y quieto. Además el respaldo era la versión cara
 * del efecto, la que sí corre en el hilo principal en cada fotograma de scroll.
 *
 * Sin ese respaldo el componente es de servidor: no manda un byte de JavaScript.
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
 * Es el efecto más caro del sitio y por eso solo vive en la home. Si algún día
 * no alcanza el presupuesto, la salida es una técnica que sí componga
 * (`transform` sobre un trazo recto), a costa de la curva.
 *
 * ⚠️ El tallo vive en el canalón de la rejilla (el `px-6` del contenedor), no
 * debajo del texto. Es --coral, que está prohibido como letra: si algún día
 * cruza por detrás de una línea de texto, el par de contraste deja de ser
 * "coral-ink sobre crema" y hay que volver a medir.
 */
export function TalloSVG({ className = "" }: { className?: string }) {
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
