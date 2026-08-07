import type { Metadata } from "next";

import { TalloSVG } from "@/components/layout/TalloSVG";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Metrica } from "@/components/ui/Metrica";
import { casos } from "@/content/casos";
import { servicios } from "@/content/servicios";

/**
 * Banco de pruebas del sistema de componentes (paso 5).
 *
 * No es una página del sitio: es el andamio contra el que se toman las capturas
 * de evidencia y se audita contraste, foco y objetivos táctiles sin esperar a
 * que existan las secciones. Por eso NO está en `site.sitemap`, NO tiene
 * canonical y va con `noindex, nofollow`.
 *
 * Sobre la regla 2 del CLAUDE.md («todo texto visible sale de content/»): todo
 * lo que aquí es copy del sitio —peldaños, métricas de caso— sale de `content/`.
 * Los rótulos de cada bloque son nombres de componente, no copy: identifican
 * qué se está mirando en la captura. Si esta página sobreviviera al paso 7,
 * sobra: se borra.
 */
export const metadata: Metadata = {
  title: "Sistema de componentes",
  robots: { index: false, follow: false },
};

const siembra = servicios[0];
const ecosistema = servicios[3];
const galarza = casos[0];

function Bloque({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-black/15 pt-8">
      <Eyebrow as="h2" className="text-gray">
        {rotulo}
      </Eyebrow>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function Sistema() {
  return (
    <main className="relative mx-auto flex w-full max-w-[1160px] flex-1 flex-col gap-20 px-6 py-20">
      {/* El tallo del paso 6 se prueba aquí porque aquí hay scroll real y la
          evidencia corresponde a código commiteado. Va en el canalón izquierdo
          —el ancho del `px-6`—, nunca por detrás del texto. En el paso 7 pasa a
          la home a enhebrar las secciones y la escalera, y esta página se borra. */}
      <TalloSVG className="left-0" />

      <h1 className="text-[clamp(40px,9vw,88px)]">Sistema</h1>

      <Bloque rotulo="Button — primario · secundario · terciario">
        <div className="flex flex-wrap items-center gap-6">
          <ButtonLink href="/contacto">Solicitar cotización</ButtonLink>
          <ButtonLink href="/casos" nivel="secundario">
            Ver los casos
          </ButtonLink>
          <ButtonLink href="/servicios" nivel="terciario">
            Ver la escalera completa
          </ButtonLink>
        </div>

        {/* El deshabilitado solo existe en primario: es el botón de envío del
            formulario mientras manda (paso 10). --gray con blanco = 5.2:1. */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button disabled>Enviando…</Button>
        </div>
      </Bloque>

      <Bloque rotulo="Card — regla capilar e invertida">
        <div className="grid gap-10 sm:grid-cols-2">
          <Card>
            <h3 className="text-[clamp(28px,3vw,40px)]">{siembra.nombre}</h3>
            <p className="mt-4 max-w-[42ch] text-gray">{siembra.promesa}</p>
            <p className="mt-6 text-sm font-medium">{siembra.rango}</p>
          </Card>

          <Card invertida>
            <h3 className="text-[clamp(28px,3vw,40px)]">{ecosistema.nombre}</h3>
            <p className="mt-4 max-w-[42ch]">{ecosistema.promesa}</p>
            <p className="mt-6 text-sm font-medium">{ecosistema.rango}</p>
          </Card>
        </div>
      </Bloque>

      <Bloque rotulo="Metrica — sobre crema y sobre negro">
        <div className="grid gap-10 sm:grid-cols-2">
          <Metrica
            valor={galarza.metrica.valor}
            etiqueta={galarza.metrica.etiqueta}
          />
          <Card invertida>
            <Metrica
              valor={casos[2].metrica.valor}
              etiqueta={casos[2].metrica.etiqueta}
              invertida
            />
          </Card>
        </div>
      </Bloque>

      <Bloque rotulo="Eyebrow — etiqueta de sección">
        <Eyebrow>{galarza.industria}</Eyebrow>
      </Bloque>
    </main>
  );
}
