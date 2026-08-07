import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Jerarquía de botones del blueprint §4. Un solo primario por vista.
 *
 * Dos componentes en vez de uno polimórfico: un `<button>` y un `<a>` no
 * aceptan las mismas props, y unificarlos obliga a un cast que apaga
 * justamente la verificación que hace útil TypeScript strict aquí. La
 * apariencia sí es una sola: `estilo()`.
 */
type Nivel = "primario" | "secundario" | "terciario";

// `min-h-11 min-w-11` = el objetivo táctil de 44×44 del blueprint, ALTO Y
// ANCHO. El ancho no es redundante: un terciario de una palabra corta se queda
// en ~40px y ya falló así una vez en la nav del header.
//
// `transition-colors` y nada más: la regla de movimiento (§4) prohíbe animar
// propiedades que provocan layout; el color es pintura, no movimiento, y por
// eso tampoco lo apaga `prefers-reduced-motion` — no hay nada que se mueva.
// Prohibido `scale()` en hover: empuja el layout.
const base =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 text-center font-body text-sm font-medium transition-colors duration-200 ease-out";

const niveles: Record<Nivel, string> = {
  // Relleno --coral-ink con texto blanco: 4.7:1 ✅ AA. Con --coral daría 3.5:1
  // y reprobaría, que es la razón entera de que exista el token -ink.
  // Hover a --black en vez de aclarar el coral: aclararlo baja el contraste.
  primario:
    "bg-coral-ink px-7 py-3 text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray disabled:hover:bg-gray",
  secundario:
    "border border-black px-7 py-3 text-black hover:bg-black hover:text-cream",
  // Enlace en línea: sin relleno ni borde, subrayado al hover. El padding
  // horizontal es mínimo para no separarlo del texto que lo rodea; la altura
  // táctil la da `min-h-11`.
  terciario: "px-1 text-coral-ink underline-offset-4 hover:underline",
};

// El estado deshabilitado solo está resuelto para el primario porque es el
// único que se deshabilita: el botón de envío del formulario mientras manda
// (paso 10). --gray con texto blanco da 5.2:1, así que el estado sigue siendo
// legible en vez de un 60% de opacidad que reprueba AA.
const estilo = (nivel: Nivel, className: string) =>
  `${base} ${niveles[nivel]} ${className}`;

type Comun = { nivel?: Nivel; className?: string; children: ReactNode };

export function Button({
  nivel = "primario",
  className = "",
  children,
  ...rest
}: Comun & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    // `type="button"` por defecto: dentro de un formulario, el default del HTML
    // es `submit` y un botón secundario enviaría el formulario sin querer.
    <button type="button" className={estilo(nivel, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  nivel = "primario",
  className = "",
  children,
  ...rest
}: Comun & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={estilo(nivel, className)} {...rest}>
      {children}
    </Link>
  );
}
