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

Hay 5 pendientes legales abiertos (blueprint §11 y `Plan - Brota Digital` en el vault):
autorización escrita de Patricia García y Grupo Galarza, aviso de privacidad conforme a
la LFPDPPP reformada, verificar cuál es la autoridad garante vigente (**el INAI desapareció
con la reforma de 2025** — citarlo sería un error fechable), declarar la transferencia
internacional a Resend, y respaldar cada "desde $X" con un paquete real (Art. 7 LFPC).

**Hasta que se resuelvan: no se despliega a Vercel ni se apunta el dominio.**

## Estado actual

Paso 1 del orden de construcción (scaffold + tokens) — completado.
