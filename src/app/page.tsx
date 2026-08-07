import type { Metadata } from "next";

import { TalloSVG } from "@/components/layout/TalloSVG";
import { Casos } from "@/components/sections/Casos";
import { CTA } from "@/components/sections/CTA";
import { Escalera } from "@/components/sections/Escalera";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Proceso } from "@/components/sections/Proceso";

// El canonical se declara por página, no en el layout: puesto en el layout lo
// heredarían todas las rutas y cada una se anunciaría como la home.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * La home (blueprint §3 y paso 7 del orden de construcción).
 *
 * El orden de las secciones es el argumento: quién es (Hero) → dónde te
 * clasificas y hasta dónde llega (Escalera) → por qué creerlo (Casos) → cómo
 * se trabaja (Proceso) → qué hacer (CTA).
 *
 * EL TALLO ENHEBRA LA PÁGINA
 *
 * `TalloSVG` estaba en `/sistema` desde el paso 6 y aquí ocupa su sitio real:
 * un solo trazo capilar que baja por el canalón de la rejilla y cose las cinco
 * secciones, creciendo con el avance del documento (`scroll(root block)`). El
 * envoltorio comparte la caja de 1160px de las secciones para que el trazo caiga
 * exactamente en el canalón —y no bajo el texto, que con --coral está prohibido—
 * a cualquier ancho de ventana.
 *
 * En el hero lo continúa el brote (`Hero.tsx`) y en la escalera se acuesta y se
 * vuelve el suelo del que crecen los peldaños (`Escalera.tsx`). Es una sola
 * línea contada en tres tiempos, que es lo que pide el blueprint §4 para el
 * efecto #1: «conecta secciones y enlaza los 4 peldaños».
 */
export default function Home() {
  return (
    <main className="relative flex-1">
      {/* `inset-0 mx-auto max-w-[1160px]`: el centrado automático sí funciona
          en un elemento absoluto cuando izquierda y derecha están fijadas, y
          es lo que alinea el trazo con el canalón de las secciones. */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1160px]">
        <TalloSVG className="left-0" />
      </div>

      <Hero />
      <Escalera />
      <Casos />
      <Proceso />
      <CTA />
      <Marquee />
    </main>
  );
}
