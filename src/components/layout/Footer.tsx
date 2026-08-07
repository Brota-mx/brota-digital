import Link from "next/link";

import { Wordmark } from "@/components/layout/Wordmark";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/content/site";

// Sección invertida: fondo --black. Ahí --gray da 3.3:1 y reprueba AA, así que
// TODO el texto del footer va en --cream-2 (15.2:1) y la jerarquía se hace con
// tamaño, no con color. Un tono atenuado obligaría a recalcular contraste cada
// vez que alguien toque el footer.

// Objetivo táctil de 44px del blueprint, alto Y ancho: «Casos» sola mide 40px
// de ancho. El texto sigue alineado a la izquierda; solo crece la caja.
const link =
  "inline-flex min-h-11 min-w-11 items-center text-sm underline-offset-4 hover:underline hover:decoration-coral";

export function Footer() {
  return (
    <footer className="bg-black text-cream-2">
      <div className="mx-auto w-full max-w-[1160px] px-6 py-16 sm:py-20">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between sm:gap-16">
          <div>
            <Wordmark className="h-8 w-auto" />
            {/* Regla capilar coral: el mismo lenguaje del trazo que brota. */}
            <div className="mt-6 h-px w-16 bg-coral" />
            <p className="mt-6 max-w-[38ch] text-sm">{site.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:gap-x-16">
            <nav aria-labelledby="footer-sitio">
              <Eyebrow as="h2" id="footer-sitio">
                Sitio
              </Eyebrow>
              <ul className="mt-2">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <Eyebrow as="h2">Contacto</Eyebrow>
              <ul className="mt-2">
                <li>
                  <a
                    href={site.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link}
                  >
                    WhatsApp {site.whatsapp.display}
                  </a>
                </li>
                <li>
                  <a
                    href={site.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link}
                  >
                    Instagram {site.instagram.handle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-cream-2/15 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>{site.areaServed.join(" · ")}</p>
          {/* El separador «·» es el mismo de la línea de zonas: sin él, el
              enlace legal se lee como continuación del copyright. */}
          <p className="flex flex-wrap items-center gap-x-3">
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <span aria-hidden="true">·</span>
            <Link href={site.legal.href} className={link}>
              {site.legal.label}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
