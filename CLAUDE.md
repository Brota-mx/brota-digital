@AGENTS.md

# Brota Digital — Sitio propio (Brota Mx)

Sitio de la agencia Brota Digital. Este es el sitio PROPIO, no el de un cliente:
es la demostración del producto y se sostiene con un estándar más alto, no más bajo.

## Contexto

- **Blueprint:** `BLUEPRINT.md` (fuente de verdad — leerlo antes de cualquier cambio grande)
- **Vault:** `G:\My Drive\MiVault\Brota Mx\Brota Digital\` (Plan, Estado, diario)
- **Repo:** `Brota-mx/brota-digital` (PÚBLICO — jamás versionar secretos ni material del cliente)
- **Deploy:** Vercel (cuenta Brota) — **no configurado todavía**, ver "Bloqueantes" abajo

## Stack

Next.js 16 (App Router, SSG) · TypeScript strict · Tailwind v4 · pnpm · monolingüe ES
Formulario: RHF + Zod + honeypot + Upstash rate-limit + Turnstile + Resend (fail-closed)

> El blueprint dice "Next.js 15" porque era la versión vigente al redactarlo.
> El scaffold se hizo con 16.3, que es lo que `next@latest` resuelve hoy. Nada
> del blueprint depende de comportamiento específico de 15.

## Comandos

- `pnpm dev` — dev server en puerto **3400** (no 3000 — se engancha al de otro cliente)
- `pnpm build` — debe salir verde antes de todo push
- `pnpm audit --prod` — **0 vulnerabilidades siempre**
- `pnpm test:e2e` — smoke Playwright (llega en el paso 14; su config va también a **3400**)

## Reglas del proyecto

1. Los design tokens viven en `globals.css` — nunca hex sueltos en componentes.
   La paleta por defecto de Tailwind está desactivada a propósito (`--color-*: initial`):
   si un color no está en `globals.css`, no existe.
2. Todo texto visible sale de `content/` — nada hardcodeado en JSX.
3. Fase de UI terminada = screenshots **móvil primero** + desktop + `/impeccable` pasado.
4. **Contraste AA en todo texto.** Los acentos cálidos son superficie, no letra:
   - `--coral` (3.3:1) y `--gold` (1.5:1) **jamás tocan texto**, a ningún tamaño.
   - `--coral-ink` es el único acento que puede ser texto: 4.5:1 sobre crema,
     4.7:1 con blanco encima (botón primario). El margen es de centésimas.
5. Movimiento: máx. 1-2 elementos animados por vista; `prefers-reduced-motion` apaga todo
   sin perder contenido; solo `transform`/`opacity`/`clip-path`/`stroke-dashoffset`.
6. Cero emojis como iconos. Lucide, trazo 1.5px.
7. Prohibido `scale()` en hover (empuja el layout).
8. Secretos solo en `.env.local` / Vercel. Nunca pedirlos por chat.
9. Responder siempre en español.
10. `ponytail` aplica: solución mínima que funcione; cero dependencias que el BLUEPRINT no pida.
11. `material/` está gitignored y se queda así. Contiene el brief de ingesta con
    precios y condiciones comerciales; el repo es público.

## Bloqueantes — construir sí, publicar no

El sitio tiene requisitos legales y de contenido pendientes antes de publicarse
(blueprint §11). **La lista está en `Plan - Brota Digital`, en el vault** — no aquí:
este repositorio es público y esos pendientes son internos.

**Hasta que esa lista esté cerrada: no se despliega a Vercel ni se apunta el dominio.**
Construir sí; publicar no. Si una sesión llega al paso 15 y la lista sigue abierta, se
detiene y se lo dice a Jesús.

## Estado actual

Pasos 1 a 8 del orden de construcción completados: scaffold + tokens · logo · layout base
y SEO técnico · contenido tipado · sistema de componentes · el trazo que brota · la Home ·
`/servicios` + FAQ. Sigue el paso 9 (`/casos` + las 3 páginas de caso).

`components/sections/` tiene las seis secciones de la home (Hero, Escalera, Casos, Proceso,
CTA, Marquee) y `components/layout/TalloSVG.tsx` el efecto firma, que ahora vive en la home
enhebrando las secciones. `/sistema` **se borró** en el paso 7: era el banco de pruebas de
los componentes y las secciones reales lo dejaron sin trabajo.

⚠️ **El presupuesto de movimiento es más chico de lo que sugiere el blueprint, y el caro
es el tallo.** `animation-timeline: scroll()` **no** saca el efecto del hilo principal
cuando la propiedad animada no es componible, y `stroke-dashoffset` no lo es. Medido a
375px con la CPU frenada 6×, en tiempo de hilo principal por barrido completo de scroll:

| Condición | Tarea | Estilo | Layout |
|---|---|---|---|
| Sin movimiento | 2 295 ms | 0 | 0 |
| Solo el tallo | 5 653 ms | 419 | 362 |
| Todo (tallo + home) | 6 648 ms | 907 | 338 |

El tallo cuesta ~3.4 s del barrido; **todo lo que agregó el paso 7 junto cuesta ~1.0 s**,
un tercio de eso, porque solo anima `transform` y `opacity`. Cero fotogramas por encima de
32 ms en cualquier condición. Antes de sumar efectos, medir — y medir **tiempo de hilo**,
no medianas de intervalo de `requestAnimationFrame`: esas se cuantizan a múltiplos de vsync
y hacen parecer que media décima de milisegundo son cuatro.

⚠️ **Y ojo con lo que se apaga para aislar.** El primer intento de aislar el contador
sustituyó `IntersectionObserver` por un stub, y eso apaga también el prefetch de
`next/link`, que usa el mismo observador: lo medido no era el contador.

⚠️ **El grano de papel no es el 3% del blueprint.** Se midió y ese valor tumba el
contraste AA de `--coral-ink`. El grano se reconstruyó para que solo aclare; el porqué,
con los números, está en `components/ui/Grano.tsx`.

La navegación apunta a `/servicios` —que ya existe—, `/casos` y `/contacto`, que dan 404
hasta los pasos 9-10, y también los enlazan la home y las tarjetas de caso
(`/casos/[slug]`). Es el orden del blueprint, no un descuido: se prefirió eso a sembrar
placeholders.

`/servicios` **no lleva el tallo y no anima nada**. Medido en la misma corrida: la home
gasta 7 457 ms de hilo principal por barrido de scroll a 375px con la CPU 6× y `/servicios`
4 846, con el trabajo de estilo y layout cayendo de 403/359 ms a 36/46. El trazo es la
firma de la home, no un adorno que se repite: es el efecto más caro del sitio.

Su tabla de precios es una `<table>` de verdad con `<caption>` porque es la candidata a
fragmento destacado de «cuánto cuesta una página web en México» (blueprint §6). Va con
**dos columnas y no tres** para que quepa a 375px sin scroll horizontal — sin scroll no
hace falta convertirla en región tabulable, que sería una parada de teclado sin control al
que llevar. El FAQ va **abierto, no en acordeón**: es el sustituto del blog y esconder el
texto por el que la página existe cuesta más de lo que ahorra.

⚠️ **`--coral-ink` no sirve sobre `--cream-2`** (4.13:1, reprueba) ni sobre `--black`
(3.68:1). Solo sobre `--cream`, y con blanco encima. En superficies elevadas o invertidas,
el acento que toca letra no existe: la jerarquía se hace con tamaño.
