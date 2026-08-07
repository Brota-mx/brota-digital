import Link from "next/link";

import { Wordmark } from "@/components/layout/Wordmark";
import { site } from "@/content/site";

// Cero JavaScript: tres enlaces cortos caben en una fila a 375px, así que no
// hay menú hamburguesa que hidratar. Si la navegación crece, se replantea.
export function Header() {
  return (
    <header className="border-b border-black/10">
      {/* `flex-wrap`: por debajo de ~340px (un 320 real, o zoom 200% sobre
          640) el wordmark y los tres enlaces ya no caben en una fila y la
          página desbordaba en horizontal. Envuelto, la nav baja a un segundo
          renglón y nada se corta. */}
      <div className="mx-auto flex w-full max-w-[1160px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-6 py-3">
        <Link
          href="/"
          aria-label={`${site.name} — inicio`}
          className="flex min-h-11 items-center"
        >
          <Wordmark className="h-6 w-auto sm:h-7" />
        </Link>

        <nav aria-label="Principal">
          <ul className="flex items-center gap-4 sm:gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  // min-w-11 además de min-h-11: «Casos» es tan corta que sin
                  // esto el objetivo táctil mide 40px de ancho.
                  className="flex min-h-11 min-w-11 items-center justify-center text-[11px] font-medium tracking-[0.1em] uppercase underline-offset-4 hover:underline hover:decoration-coral sm:text-xs sm:tracking-[0.14em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
