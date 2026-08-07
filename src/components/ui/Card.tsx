import type { ReactNode } from "react";

/**
 * Superficie de tarjeta (blueprint §4).
 *
 * Por defecto NO es una caja: es una regla capilar de 1px arriba y el contenido
 * colgando de ella. Es lenguaje editorial, no de dashboard — el blueprint pide
 * reglas capilares en vez de bordes de tarjeta donde se pueda, y aquí se puede.
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
          : "border-t border-black/15 pt-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
