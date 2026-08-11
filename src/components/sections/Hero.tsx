import type { CSSProperties } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { home } from "@/content/home";

/**
 * Hero (blueprint §4, efecto #2: «revelado desde el suelo»).
 *
 * ⚠️ EL TRAZO QUE ATABA ESTO YA NO EXISTE (11-ago)
 *
 * Aquí vivía `.hero-brote`, un segundo trazo de 1px que decía continuar al
 * tallo de `page.tsx`. En escritorio se veían los dos a la vez, separados ~5px,
 * y el porqué está escrito en `page.tsx`. Se borraron los dos.
 *
 * De la coreografía original queda lo que no dependía del trazo: las frases del
 * titular emergen escalonadas detrás de la máscara, de abajo hacia arriba.
 *
 * MÁSCARA CON `overflow-hidden`, NO CON `clip-path`
 *
 * El blueprint dice «clip-path + translateY». La máscara es un
 * `overflow-hidden` en el envoltorio: mismo resultado visual con UNA propiedad
 * animada en vez de dos, y `transform` es de las que sí compone el navegador.
 *
 * El `pb`/`-mb` de 0.14em no es decorativo: sin él la máscara le corta la cola
 * a las letras con descendente («p» de «Empieza») a 80px.
 *
 * Toda la coreografía es de UNA sola entrada y de un solo disparo al cargar:
 * pasado el segundo, el hero no tiene nada animándose. `prefers-reduced-motion`
 * la apaga entera dejando todo a la vista, en `globals.css`.
 */
export function Hero() {
  const { eyebrow, titulo, entrada, cta, ctaAlterno } = home.hero;

  return (
    <section>
      <div className="relative mx-auto grid w-full max-w-[1160px] gap-x-16 gap-y-12 px-6 pt-[clamp(64px,11vw,120px)] pb-[clamp(80px,10vw,140px)] lg:grid-cols-[55fr_45fr]">
        <div>
          <Eyebrow className="hero-entrada text-gray">{eyebrow}</Eyebrow>

          <h1 className="mt-6 text-[clamp(40px,8vw,80px)] tracking-[-0.03em]">
            {titulo.map((frase, i) => (
              // El envoltorio es la máscara; el `span` de dentro es lo que se
              // mueve. Los dos son `block` para que cada frase ocupe su renglón
              // sin convertir el titular en varios <h1>.
              <span
                key={frase}
                className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"
              >
                <span
                  className="hero-linea block"
                  // El escalonado por índice y no por `nth-child` en el CSS:
                  // si el titular pasa a tres frases, no hay CSS que tocar.
                  style={{ "--retraso": `${180 + i * 180}ms` } as CSSProperties}
                >
                  {frase}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Composición asimétrica 55/45 del blueprint §4: la entrada y las
            acciones cuelgan de la base del titular, no centradas debajo. */}
        <div className="hero-entrada lg:mt-auto lg:pb-2">
          <p className="max-w-[46ch] text-gray">{entrada}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
            <ButtonLink nivel="terciario" href={ctaAlterno.href}>
              {ctaAlterno.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
