/**
 * Grano de papel (blueprint §4, efecto #5): ruido SVG al 3% sobre el crema.
 *
 * Se genera en el navegador con `feTurbulence`: no hay imagen de textura que
 * descargar, así que el costo de red es cero y no hay un PNG de 200KB que
 * mantener. Un solo elemento para todo el sitio, montado en el layout.
 *
 * Dos decisiones que sostienen el efecto:
 *
 * - `-z-10` en vez de una capa encima del contenido. El fondo crema del `body`
 *   se pinta en el lienzo de la página, que va por debajo incluso de los
 *   z-index negativos: el grano queda sobre el crema pero DEBAJO de todo lo
 *   demás. Efecto: se ve sobre el lienzo y desaparece bajo las superficies
 *   opacas —el footer negro, las tarjetas invertidas—, que es justo lo que pide
 *   «grano sobre el crema». Encima de todo, ensuciaría el texto y le quitaría
 *   contraste a un sitio que promete AA.
 * - `fixed`: el grano no se desplaza con el scroll. Es la textura del papel,
 *   no un elemento de la página; además evita repintar un filtro caro mientras
 *   se hace scroll.
 *
 * Es decoración pura: `aria-hidden` y sin objetivo de puntero.
 *
 * ⚠️ POR QUÉ EL GRANO SOLO ACLARA, Y POR QUÉ NO ES EL 3% DEL BLUEPRINT
 *
 * El blueprint pide ruido al 3% sobre el crema. Se implementó así, se midió
 * decodificando los píxeles de la captura real, y reprobaba:
 *
 *   crema limpio           4.542  ✅
 *   ruido 3% (media)       4.500  ← justo en el límite, sin margen
 *   ruido 3% (percentil 5) 4.466  ❌ AA
 *   ruido 3% (peor píxel)  4.408  ❌ AA
 *
 * El ruido neutro oscurece el crema ~2/255, y --coral-ink sobre crema tiene
 * 4.542: un margen de 0.042 sobre el mínimo de 4.5. El presupuesto para
 * oscurecer el lienzo es de ~0.6/255. Es decir: CUALQUIER grano que oscurezca
 * tumba el contraste de todos los enlaces y botones terciarios del sitio.
 *
 * Como el contraste AA es requisito de producto (PRODUCT.md) y el grano es un
 * efecto estético, cede el grano: la matriz de arriba lo obliga a aclarar. El
 * peor píxel medido queda en 4.542 —el mismo del crema limpio, porque por
 * construcción no puede bajar de ahí— y la media sube a 4.599.
 *
 * Se ve menos que el 3% original. Es la intensidad que el presupuesto de
 * contraste permite. Subirla obligaría a cambiar `--coral-ink`, que es
 * identidad de marca heredada: no es un ajuste de implementación y no se hace
 * sin decisión de marca.
 */
export function Grano() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    >
      <filter id="grano-papel">
        {/* `stitchTiles` evita costuras visibles al mosaicar el ruido.
            baseFrequency alta = grano fino, de papel; bajo de más se lee como
            nube sucia. */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
          result="ruido"
        />
        {/* El grano SOLO aclara. La matriz fija RGB en blanco (la columna
            constante) y conserva el alfa turbulento, así que el ruido no puede
            oscurecer un píxel: lo empuja hacia el blanco o lo deja igual.
            No es capricho estético; está medido — ver el bloque de arriba. */}
        <feColorMatrix
          in="ruido"
          type="matrix"
          values="0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 0.6 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grano-papel)" />
    </svg>
  );
}
