import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { home } from "@/content/home";
import { site } from "@/content/site";

/**
 * Cierre de la home: la acción principal del visitante (PRODUCT.md §Purpose).
 *
 * Sobre crema y no invertida a negro, por dos razones concretas:
 *
 * - El botón primario es relleno --coral-ink con texto blanco, y su hover pasa
 *   a --black. Sobre una banda negra ese hover haría desaparecer el botón. La
 *   salida barata habría sido un hover distinto solo aquí; la buena es no
 *   crear el problema.
 * - El pie ya es negro. Una banda negra pegada a él se lee como un solo bloque
 *   y el cierre pierde el peso que se le quiso dar. El único negro del cuerpo
 *   de la página es el peldaño Ecosistema, y ahí sí significa algo.
 *
 * Un solo primario por vista (blueprint §4): el segundo canal, WhatsApp, va
 * como terciario.
 */
export function CTA() {
  const { eyebrow, titulo, entrada, boton, whatsapp } = home.cta;

  return (
    <section
      aria-labelledby="cta-titulo"
      className="mx-auto w-full max-w-[1160px] px-6 py-[clamp(80px,10vw,140px)]"
    >
      <div className="border-t border-black/15 pt-10">
        <Eyebrow className="text-gray">{eyebrow}</Eyebrow>
        <h2
          id="cta-titulo"
          className="mt-5 max-w-[16ch] text-[clamp(36px,7vw,80px)] tracking-[-0.03em]"
        >
          {titulo}
        </h2>
        <p className="mt-8 max-w-[52ch] text-gray">{entrada}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href={boton.href}>{boton.label}</ButtonLink>
          <ButtonLink
            nivel="terciario"
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {whatsapp}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
