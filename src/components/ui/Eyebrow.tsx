import type { ReactNode } from "react";

/**
 * Etiqueta / eyebrow (blueprint §4): DM Sans 12px, peso 500, tracking 0.18em,
 * mayúsculas.
 *
 * `font-body` es explícito y no sobra: `globals.css` pone Fraunces en h1-h3 por
 * defecto, así que un eyebrow marcado como `h2` —el caso del footer, donde
 * etiqueta una nav y necesita ser encabezado real— saldría en Fraunces sin él.
 *
 * `as` existe por eso mismo: la etiqueta es un rol tipográfico, no un nivel de
 * documento. Quien la usa decide si además encabeza algo.
 */
export function Eyebrow({
  as: Tag = "p",
  id,
  className = "",
  children,
}: {
  as?: "p" | "h2" | "span";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={`font-body text-[11px] font-medium tracking-[0.18em] uppercase sm:text-xs ${className}`}
    >
      {children}
    </Tag>
  );
}
