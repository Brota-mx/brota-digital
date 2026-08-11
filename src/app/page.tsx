import type { Metadata } from "next";

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
 * ⚠️ AQUÍ VIVÍA EL TALLO, Y SE BORRÓ A PROPÓSITO (11-ago)
 *
 * `TalloSVG` era el efecto #1 del blueprint §4: un trazo capilar por el canalón
 * de la rejilla que cosía las secciones creciendo con el scroll, y el hero lo
 * continuaba con un segundo trazo propio (`.hero-brote`).
 *
 * En escritorio se veían LOS DOS a la vez en el hero, separados ~5px: el brote
 * clavado en x=12 y el tallo pasando por x≈17 a esa altura. No era un desajuste
 * de CSS que se pudiera calibrar: el path oscila entre x=4 y x=20 dentro de un
 * viewBox de 24 de ancho, y en escritorio ese SVG se estira a ~4000px de alto
 * conservando los 24, así que la curva se vuelve una vertical torcida y por
 * dónde cruza el hero depende de cuánto mida la página.
 *
 * `Hero.tsx` argumentaba largo y bien que eran «una sola línea contada en dos
 * tiempos» y que iban «en la MISMA columna». Nadie lo midió hasta que se vio en
 * pantalla. Si algún día vuelve el trazo: medir la x de los dos a varios anchos
 * ANTES de escribir el porqué.
 */
export default function Home() {
  return (
    <main className="relative flex-1">
      <Hero />
      <Escalera />
      <Casos />
      <Proceso />
      <CTA />
      <Marquee />
    </main>
  );
}
