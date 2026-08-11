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
Formulario: validación nativa del navegador + Zod **en el servidor** + honeypot +
Upstash rate-limit + Turnstile + Resend (fail-closed)

> El blueprint §2 pide React Hook Form. Se quitó en la auditoría ponytail: validaba
> en el cliente con el mismo esquema que el endpoint, y el endpoint ya devuelve un
> mensaje por campo que el formulario ya sabía pintar. Ahora el navegador atrapa lo
> obvio con `required`/`type`/`maxLength` y el servidor sigue siendo la autoridad.
> Efecto secundario que era el objetivo: **Zod ya no viaja al navegador**.

> El blueprint dice "Next.js 15" porque era la versión vigente al redactarlo.
> El scaffold se hizo con 16.3, que es lo que `next@latest` resuelve hoy. Nada
> del blueprint depende de comportamiento específico de 15.

## Comandos

- `pnpm dev` — dev server en puerto **3400** (no 3000 — se engancha al de otro cliente)
- `pnpm build` — debe salir verde antes de todo push
- `pnpm audit --prod` — **0 vulnerabilidades siempre**
- `pnpm start` — build de producción en **3400** (no en 3000: `dev` y `start` van al mismo)
- `pnpm test:e2e` — smoke Playwright. Hace `build` + `start` él solo y **no reutiliza** un
  servidor que ya esté en 3400: uno de una sesión anterior sirve el HTML de un `.next` que
  el build ya reemplazó, y los chunks caen en 404 mientras el rojo señala al código.

## Reglas del proyecto

1. Los design tokens viven en `globals.css` — nunca hex sueltos en componentes.
   La paleta por defecto de Tailwind está desactivada a propósito (`--color-*: initial`):
   si un color no está en `globals.css`, no existe.
2. Todo texto visible sale de `content/` — nada hardcodeado en JSX.
3. Fase de UI terminada = screenshots **móvil primero** + desktop + `/impeccable` pasado.
   Las capturas se toman en `docs/qa/`, que está **gitignored**, y de ahí se archivan
   en el vault. Se toman igual que siempre; lo que no se hace es versionarlas: eran
   118 PNG y 42 MB contra ~4 000 líneas de código.
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
12. **Objetivo táctil 44×44 en ancho Y alto.** `min-h-11` **y** `min-w-11`. Ha fallado dos
    veces —paso 3 en la nav, paso 9 en las migas de pan— y las dos por el ancho, porque el
    alto es el que se escribe solo.
13. Las reglas base de `globals.css` van **dentro de `@layer base`**. Fuera de capa, el CSS
    gana contra **todas** las de Tailwind, incluida `utilities`, y deja de poderse anular
    desde el JSX. Compila verde y solo se ve en la captura (paso 3).
14. **Barrido de texto sobre todo lo versionado antes de cada push**, buscando pendientes
    internos, condiciones comerciales o datos de terceros — **comentarios de código
    incluidos**, que es donde menos se mira. El repo es público: lo que no iría en el sitio
    tampoco va en un comentario. Se corre en cada push, no una vez.
15. **Al verificar una transición, lee la propiedad `scale`, no `transform`.** Tailwind v4
    anima `scale`, así que `transform` devuelve `none` y parece roto cuando funciona. Y
    ninguna herramienta cuenta como prueba si no se la ha visto fallar: el control tiene que
    caer dentro del alcance de la regla que dice probar.
16. **Rama primero. Siempre.** Nunca se commitea directo a `main`: se abre rama, se revisa el
    diff, se empuja la rama, se mergea y se sincroniza. `main` queda para lo revisado, y así
    siempre hay dónde deshacer sin tocar historial público.
17. **Con emulación móvil, `window.innerWidth` no sirve para medir desborde.** Chromium
    ensancha el viewport de layout para acomodar lo que se sale, así que
    `scrollWidth - innerWidth` da 0 justo cuando **sí** hay desborde: con un bloque de 900 px
    metido a propósito en la home, `innerWidth` devolvió **901** y la resta dio 0. La
    referencia que se queda en los 375 pedidos es `documentElement.clientWidth`, y con ella
    ese mismo control da 526 px. Es la regla 15 otra vez, en otra propiedad.
18. **Las capturas no se toman antes de que los contadores terminen.** Duran 900 ms desde que
    el número cruza el 60% de la pantalla (`ui/Contador.tsx`). La primera tanda del paso 14
    salió con **87 y 48** donde `content/casos.ts` dice **94 y 52**: evidencia archivada con
    cifras que el sitio nunca enseña, y justo en la sección que promete que las cifras se
    pueden ir a verificar. El componente estaba bien —sin JS, con `reduce` y al terminar da
    94/2/52, los tres comprobados—; lo que estaba mal era el momento de disparar la cámara.

## Flujo de cada paso del build

Sin excepciones, y en este orden:

**rama → revisar el diff → empujar la rama → mergear → actualizar el vault → dejar el prompt
de la siguiente sesión.**

La revisión del diff incluye el barrido de la regla 14 y las verificaciones de la regla 3
(build, lint, `audit --prod` en 0, capturas, `/impeccable`). Nada de eso se hace después del
merge.

## Bloqueantes — construir sí, publicar no

El sitio tiene requisitos legales y de contenido pendientes antes de publicarse
(blueprint §11). **La lista está en `Plan - Brota Digital`, en el vault** — no aquí:
este repositorio es público y esos pendientes son internos.

**Hasta que esa lista esté cerrada: no se despliega a Vercel ni se apunta el dominio.**
Construir sí; publicar no. Si una sesión llega al paso 15 y la lista sigue abierta, se
detiene y se lo dice a Jesús.

## Estado actual

Pasos 1 a 10 del orden de construcción completados: scaffold + tokens · logo · layout base
y SEO técnico · contenido tipado · sistema de componentes · el trazo que brota · la Home ·
`/servicios` + FAQ · `/casos` + las 3 páginas de caso · `/contacto` + el formulario de 6
capas. Y del **paso 11, solo el 404**; el **paso 12 (cierre SEO)**, el **paso 13 (cierre de
seguridad)** y el **paso 14 (cierre de QA visual)** completos. Solo queda el **paso 15
(deploy)**, y ese está bloqueado a propósito — ver «Bloqueantes» arriba.

⚠️ **El smoke de `e2e/` no prueba que el sitio se vea bien: prueba lo que se rompe sin
fallar en rojo.** JSON-LD en línea que una CSP puede borrar, cabeceras que son
configuración y no código, objetivos táctiles de 44×44 y desborde a 320/375. Todo lo
demás —que la escalera se entienda, que la jerarquía funcione— sigue saliendo de mirar las
capturas, que es de donde han salido casi todas las correcciones del proyecto.

Lighthouse móvil contra el build de producción, en las 5 rutas medidas: **95-96** de
rendimiento y **100** en accesibilidad, buenas prácticas y SEO. El listón de ≥90 del
blueprint §7 se cumple con margen, y conviene que siga así: la home publica «94 Lighthouse
móvil, como mínimo» como métrica de un caso.

⚠️ **La CSP y las cinco cabeceras viven en `next.config.ts` y se sirven en TODA respuesta**
—páginas, 404, estáticos y `/api/contacto`—. Dos cosas antes de tocarlas:

- **`script-src` lleva `'unsafe-inline'` y no es un descuido.** El porqué —y por qué los
  hashes no son implementables y el nonce costaría el SSG entero— está escrito en el propio
  archivo. Endurecerla sin leer eso rompe la hidratación de Next.
- **El JSON-LD de los pasos 3 y 12 va en `<script>` en línea.** Si la política se aprieta,
  ese marcado desaparece **sin que nada falle en rojo**: el build sale verde, la página se ve
  igual y el marcado no está. Se comprueba cargando las rutas y contando los
  `script[type="application/ld+json"]`, nunca leyendo la política.

⚠️ **`/aviso-de-privacidad` sigue sin construirse, y es a propósito.** Su borrador está en
las notas internas del proyecto, sin cerrar y con huecos por llenar; publicarlo así sería
peor que no tenerlo. Por eso el enlace legal —footer y formulario— es el **único** enlace
del sitio que apunta a un 404, y ahora ese 404 al menos es una página del sitio y no la de
Next. No llenar esos huecos ni redactar texto legal de relleno.

`components/sections/` tiene las seis secciones de la home (Hero, Escalera, Casos, Proceso,
CTA, Marquee) y `components/layout/TalloSVG.tsx` el efecto firma, que ahora vive en la home
enhebrando las secciones. `/sistema` **se borró** en el paso 7: era el banco de pruebas de
los componentes y las secciones reales lo dejaron sin trabajo.

⚠️ **Una auditoría ponytail (11-ago) borró todo lo que no se usaba.** Lo que hay que saber
antes de "restaurarlo" por costumbre:

- **`ui/Card.tsx` ya no existe.** Su único consumidor en todo el sitio era `Escalera`, y su
  única variante la usaba un solo peldaño. Las clases viven ahí ahora. Si una segunda
  sección necesita la misma superficie, se vuelve a extraer *ese día*, sabiendo qué
  comparten las dos.
- **`TalloSVG` ya no lleva `"use client"`.** Tenía un respaldo de `scroll` + rAF para
  Firefox y Safari; sin él, esos navegadores ven el trazo completo y quieto, que es el
  estado que el propio archivo ya declaraba aceptable. Y era la versión cara del efecto:
  la que sí corre en el hilo principal en cada fotograma.
- **`Metrica` ya no tiene `invertida`**, porque ninguno de sus tres llamadores la pasaba.
- **`LIMITES` se mudó a `content/contacto.ts`.** No es capricho de orden: leerlo desde
  `lib/contacto.ts` obligaría al formulario a importar el archivo que importa Zod, y
  arrastraría Zod entero al navegador para leer seis números.
- **En `route.ts` no hay `.slice()` tras el saneo.** Zod ya cortó por `LIMITES` y las tres
  funciones de saneo solo pueden acortar. Volver a ponerlos no protege de nada.
- Los SVG de `public/logo/` salieron del repo (nadie los cargaba: los paths están
  inlineados en `Wordmark.tsx`, `opengraph-image.tsx` e `icon.svg`). La salida del
  generador vive en `material/logo-tooling/salida/`, gitignored.

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

La navegación ya no tiene ningún 404. El único enlace que apunta a una ruta inexistente es
el del aviso de privacidad —footer y formulario—, y llega en el paso 11.

⚠️ **El endpoint del formulario no lleva ningún SDK: tres `fetch` y cero dependencias.**
Resend, Upstash y Turnstile entran por su API REST. El blueprint §2 nombra tres *servicios*,
no tres paquetes, y cada uno es una petición de diez líneas (regla 10). Antes de sumar un
SDK «para simplificar», leer el porqué en `app/api/contacto/route.ts`.

⚠️ **El widget de Turnstile impone 300 px y no encoge.** A 320 px la columna solo tiene 272
y el widget estiraba la rejilla entera: 19 px de desborde en el documento. Se resuelve
pidiendo `size: "compact"` cuando el hueco medido es menor que 300. Lo cazó la medición a
320, no la vista — a 375 no se nota.

⚠️ **El foco dentro del widget vive en un shadow DOM cerrado.** Tres paradas de teclado
seguidas que `:focus-visible` no alcanza y ninguna regla del sitio puede estilizar. Es de
Cloudflare, no del sitio: se comprobó escribiendo la regla, viéndola no aplicar y borrándola.
No volver a intentarlo.

⚠️ **Un `<form>` sin `action` hace GET a la ruta actual.** Sin JavaScript eso pondría nombre,
correo y teléfono en la barra de direcciones y en el historial. Por eso el formulario lleva
`method="post"` y la página lo esconde entero con un `<noscript>`: sin JavaScript el token
anti-robots no se puede emitir, así que el formulario no podría enviarse de todas formas.

⚠️ **`transition-colors` de Tailwind v4 también anima `outline-color`.** Leer el anillo de
foco justo después de un `Tab` devuelve un color intermedio y parece que la regla no aplica.
Hay que dejar asentar la transición antes de medir — es la regla 15 otra vez, en otra
propiedad.

⚠️ **El detector de `/impeccable` nunca estuvo roto: el control del paso 10 estaba fuera de
su alcance.** Se le pidió que fallara con hex sueltos, un emoji, `hover:scale-105` y
`shadow-lg` —que son reglas de **este** `CLAUDE.md`, no del detector— y devolvió 0, que era
la respuesta correcta. Con un control dentro de su alcance (`border-l-4` en una tarjeta
redondeada, `bg-clip-text` con gradiente, `animate-bounce`, `font-family: Inter`) devuelve 4
hallazgos y **exit 2**. La CLI es `scripts/detect.mjs`, no `scripts/detect-antipatterns.mjs`
—esa ruta no existe y `node` sale con **0** al no encontrar el módulo, que es la mitad de
cómo se leyó como «gate en verde»—. La regla 15 aplica a la regla 15: un control que no cae
dentro del alcance de la herramienta no prueba que la herramienta esté rota.

⚠️ **No hay OG por página, y el blueprint §6 la pide.** Rendirla exige meter un binario de
fuente al repo o bajar Google Fonts en el build, para dibujar dentro de la imagen el mismo
titular que la plataforma ya pinta como texto al lado, desde el `title` y la `description`
que sí son únicos por ruta. Se queda la OG de marca única. Si algún día se hace, que sea
porque el titular dentro de la imagen aporta algo que el de al lado no.

`/casos` y `/casos/[slug]` **no llevan capturas**, aunque el blueprint §4 defina su
tratamiento y §3 las liste como contenido pendiente: entran cuando se cierren los
requisitos previos de §11, y hasta entonces la página se construye sin el bloque en vez de
sembrar imágenes de relleno. El hueco natural es debajo del resumen de cada caso.

Las tres páginas de caso siguen el orden de lectura del blueprint §6 al pie —H1 con
cliente + industria + servicio, contexto, métricas duras, stack, enlace al peldaño y a
`/contacto`— y llevan `BreadcrumbList` + `CreativeWork` con `about` apuntando a la
industria. **En el marcado nunca va el nombre del cliente**: para el caso anónimo, un
nombre en el JSON-LD es un nombre publicado aunque no se vea en la página.

⚠️ **El bloque del peldaño muestra nombre y rango, nunca la promesa.** Un peldaño promete
todo lo que *puede* incluir y ningún proyecto usa todo: la promesa de Selva habla de dos
idiomas, gestor de contenido y agenda, y el caso del despacho fiscal no lleva ninguna de
las tres. Al pie de un caso, esa promesa se lee como descripción de *ese* trabajo.

Dos correcciones salieron de mirar las capturas, no de leer el código: las migas de pan
daban **34×44 y 40×44** —la altura bien y el ancho no, exactamente el hallazgo del paso
3—, y el nombre del cliente aparecía tres veces en el mismo golpe de vista (miga, eyebrow
y encabezado). Se resolvió metiendo el nombre **dentro** del H1, que es lo que §6 pedía
desde el principio, y quitando la eyebrow de esa página.

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
