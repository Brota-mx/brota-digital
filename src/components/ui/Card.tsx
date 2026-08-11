import type { ReactNode } from "react";

/**
 * Superficie de tarjeta (blueprint §4).
 *
 * Es `--cream-2` —el token de «superficie elevada»— rematada arriba por una
 * regla capilar de 1px. La regla es el lenguaje editorial que pide el blueprint
 * (reglas capilares en vez de bordes de caja por los cuatro lados); el fondo es
 * lo que le da cuerpo.
 *
 * ⚠️ El fondo NO estaba al principio: la tarjeta era transparente y solo tenía
 * la regla de arriba. En la escalera de la home eso no funcionaba, y se vio
 * midiendo, no leyendo: entre el 49% y el 57% de cada tarjeta era aire vacío
 * colgando de una línea al 15% de negro, así que las tres tarjetas claras se
 * leían como huecos y la única que se entendía era la invertida. Una superficie
 * que no se ve no delimita nada.
 *
 * ⚠️ Y cambia el presupuesto de contraste de lo que va dentro. Sobre
 * `--cream-2`, `--gray` cae de 5.1:1 a 4.65:1 —pasa AA, con menos margen— y
 * `--coral-ink` **reprueba** (4.13:1). Dentro de una tarjeta el acento no toca
 * letra: la jerarquía se hace con tamaño y peso.
 *
 * `invertida` no es una variante decorativa: el peldaño Ecosistema invierte a
 * fondo negro porque es el salto de escala de la escalera (§4, efecto #3). El
 * texto va en --cream-2 (15.2:1 sobre --black) y no en --gray, que sobre negro
 * da 3.3:1 y reprueba.
 *
 * Sin `as`: quien la use dentro de una lista la envuelve en el `<li>` o el
 * `<article>` que corresponda. Un elemento de más en el DOM cuesta menos que un
 * componente que tiene que saber de semántica que no es suya.
 */
export function Card({
  invertida = false,
  className = "",
  children,
}: {
  invertida?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col ${
        invertida
          ? "bg-black p-8 text-cream-2 sm:p-10"
          : "border-t border-black/15 bg-cream-2 p-6 sm:p-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
