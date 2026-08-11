# Brota Digital — Blueprint

> Generado por Brota Architect el 2026-08-06
> Cliente: **Brota Digital** (sitio propio de la agencia) · Carpeta: `Desktop\Brota\Proyectos\Brota Mx` · Repo: `Brota-mx/brota-digital`

---

## 1. El negocio y el objetivo

**Brota Digital** es una agencia mexicana de marketing digital y desarrollo web, operada por dos socios desde CDMX y Cancún/Playa del Carmen. Construye sitios web, identidad de marca, gestión de redes y —el nivel nuevo— sistemas de automatización e IA.

**El giro que este sitio debe ejecutar.** La agencia viene de venderse como opción barata para negocios pequeños. El trabajo que realmente entrega es de otro nivel: sitios bilingües con CMS, suites de 50-84 pruebas automatizadas, Lighthouse móvil 94, auditorías de seguridad y accesibilidad. El sitio nuevo debe comunicar ese nivel sin abandonar la puerta de entrada económica.

- **Objetivo #1:** generar solicitudes de cotización calificadas, con el presupuesto declarado desde el primer contacto.
- **Acción principal del visitante:** enviar el formulario de contacto (canal principal) o escribir por WhatsApp (canal rápido).
- **Diferenciador a comunicar:** *el trabajo es verificable.* No "hacemos páginas bonitas", sino métricas concretas de sitios en producción. Es lo que ninguna agencia del segmento muestra.

**Tono:** profesional, serio, de excelencia. Voz de despacho en tercera persona ("Brota"), **nunca** en femenino plural ni en primera persona singular — el sitio anterior mezclaba ambas. La marca no declara número de integrantes.

**Fuentes de este brief:** sitio anterior `brotadigital.mx` (extracción en vivo del DOM + skillui), Instagram `@brotadigitaal`, notas del vault de Brota Mx, y sesión de descubrimiento del 6-ago-2026.

---

## 2. Stack

Parte del default de Brota. Solo se documentan las **desviaciones**:

| Capa | Tecnología | Nota |
|---|---|---|
| Framework | Next.js 15 · App Router · SSG | Default |
| Lenguaje | TypeScript strict | Default |
| Estilos | Tailwind CSS v4 | Default |
| i18n | **Ninguno — solo español** | ⚠️ *Desviación:* clientes 100% mexicanos. Los casos ya demuestran capacidad bilingüe; no hace falta demostrarla con el sitio propio. `next-intl` se puede añadir después sin rehacer |
| CMS | **Ninguno** | ⚠️ *Desviación confirmada:* no hay quien mantenga un blog. Contenido tipado en `content/` |
| Formulario | React Hook Form + Zod | Default |
| Email | Resend | Requiere dominio verificado |
| Anti-abuso | Upstash rate-limit + Turnstile + honeypot, fail-closed | Default |
| Analytics | Vercel Analytics | Sin cookies → sin banner |
| Hosting | Vercel (cuenta Brota) | ⚠️ Migra desde **GitHub Pages** |
| Base de datos | Ninguna | Default |
| Paquetes | pnpm | Default |
| **Puerto dev** | **3400** | Registrado en el hub del vault |

---

## 3. Mapa del sitio y contenido

| Ruta | Página | Secciones | Fuente del contenido |
|---|---|---|---|
| `/` | Home | Hero · Escalera (4 peldaños) · Casos con métricas · Proceso (4 pasos) · CTA | Ingesta + redactar |
| `/servicios` | Servicios | Los 4 peldaños a detalle, qué incluye cada uno, precios, para quién es · **bloque FAQ** (sustituye al blog, ver §6) | Ingesta (planes existentes) + redactar Ecosistema |
| `/casos` | Casos | Índice de los 3, con métrica destacada de cada uno | Redactar desde datos del vault |
| `/casos/grupo-galarza` | Caso | Reto · solución · resultados · capturas | Vault + capturas del sitio en producción |
| `/casos/dra-patricia-garcia` | Caso | Reto · solución · resultados · capturas | Vault + capturas |
| `/casos/despacho-fiscal` | Caso | **Sin nombre ni logo — solo el giro** | Vault + capturas sin elementos identificables |
| `/contacto` | Contacto | Formulario + WhatsApp + zonas de operación | Redactar |
| `/aviso-de-privacidad` | Legal | Obligatorio (LFPDPPP) | Redactar — ver §11 |
| `/404` | No encontrado | Personalizada | Redactar |

### La escalera de servicios

| Peldaño | Qué es | Rango | Origen |
|---|---|---|---|
| **Siembra** | Landing de 1 página, responsiva, WhatsApp | $3,500 – 6,000 MXN | Ya existía |
| **Cosecha** | Sitio multipágina, SEO on-page, analítica | $12,000 – 18,000 MXN | Ya existía (precio revisado) |
| **Selva** | Sitio completo: bilingüe, CMS, agenda, seguridad, suite E2E | $35,000 – 60,000 MXN | Ya existía (precio revisado) |
| **Ecosistema** | Sistemas que trabajan solos: agentes de IA, automatización, integraciones | desde $80,000 MXN + mensualidad | **Nuevo** |

### Contenido que falta

- 🔴 **Capturas de los 3 sitios en producción** (desktop + móvil). Se generan con `playwright-cli` contra las URLs vivas.
- 🟡 **Fotos del equipo**: por definir. El sitio funciona sin ellas.
- Las páginas de caso que identifican al cliente tienen requisitos previos: ver §11.

> **Sin testimonios.** No existe ninguno atribuible a un cliente real, y **jamás se escribe uno que no exista** — ni como relleno provisional, porque el relleno se queda. Los casos con métricas duras sostienen la prueba por sí solos. Aplica igual a reseñas, calificaciones y al marcado `Review`/`AggregateRating`.

---

## 4. Sistema visual (confirmado con Jesús)

**Principio: editorial exagerado.** Tipografía descomunal, espacio negativo extremo, un solo acento usado con decisión. El trabajo es el héroe.

Rechazados deliberadamente: glassmorphism, liquid glass, skeuomorfismo, gradientes morado/azul, bento grids, sopa de logos. Caros en rendimiento, riesgosos en contraste, y genéricos precisamente por ubicuos.

### Colores

| Token | Hex | Origen | Uso | Contraste sobre crema |
|---|---|---|---|---|
| `--cream` | `#FDFAF5` | Muestreado del DOM | Lienzo base | — |
| `--cream-2` | `#F5EFE4` | Muestreado del DOM | Superficie elevada | — |
| `--black` | `#1A1A1A` | Muestreado del DOM | Texto principal, secciones invertidas | 15.6:1 ✅ |
| `--coral` | `#E85D3A` | Muestreado del DOM | Acento decorativo y **texto grande** (≥24px) | 3.33:1 ⚠️ |
| `--coral-ink` | `#C94828` | Muestreado del DOM (era `--coral-d`) | **Texto chico, botones, enlaces** | 4.73:1 ✅ |
| `--gold` | `#F5C97A` | Muestreado del DOM | **Solo decorativo — prohibido para texto** | 1.6:1 ❌ |
| `--gray` | `#6B6B6B` | Muestreado del DOM | Texto secundario | 5.12:1 ✅ |

> **Todos los colores salen del CSS real del sitio anterior.** Ninguno fue inventado ni derivado de una descripción.

**Regla dura:** `--coral` nunca se usa para texto menor a 24px ni como relleno de botón con texto blanco (da 3.47:1, reprueba AA). Para eso existe `--coral-ink`, que da 4.73:1 y aprueba.

### Tipografía

| Rol | Fuente | Tamaño | Peso | Tracking |
|---|---|---|---|---|
| Display (hero) | **Fraunces** | `clamp(56px, 11vw, 148px)` | 600 | `-0.03em` |
| H2 | Fraunces | `clamp(40px, 6vw, 88px)` | 600 | `-0.02em` |
| H3 | Fraunces | `clamp(28px, 3vw, 40px)` | 600 | `-0.01em` |
| Etiqueta / eyebrow | DM Sans | 12px | 500 | `0.18em` MAYÚSCULAS |
| Cuerpo | DM Sans | 17px (16px móvil) | 400 | `line-height: 1.65` |
| Métrica | Fraunces | `clamp(48px, 8vw, 96px)` | 600 | `-0.02em` |

**Decisión de tipografía:** el sitio anterior usaba Cormorant Garamond peso 400. Se cambia a **Fraunces**: serif contemporánea, variable, con curvas orgánicas coherentes con la metáfora de la marca, y sin la connotación de invitación de boda que carga Cormorant. **Cormorant sobrevive únicamente dentro del SVG del logo**, con trazos convertidos a curvas — no se carga como fuente.

Ambas fuentes self-hosted con `next/font`. Cero requests a Google Fonts en runtime.

### Logo

Tres piezas, todas SVG:

1. **Wordmark** `brota.` — Cormorant vectorizado, punto en `--coral`.
2. **Lockup horizontal** `brota. digital`.
3. **Icono cuadrado** — la "b" del wordmark sobre `--coral` o `--black`, para favicon e Instagram.

No se diseña símbolo botánico nuevo: sería inventar un activo de marca que no existe, y eso requiere decisión de ambos socios, no de una sesión técnica.

### Efectos

**Hilo conductor: la marca se llama Brota, los efectos crecen.** Nada aparece de la nada; todo emerge. El movimiento es significado, no decoración.

| # | Efecto | Implementación |
|---|---|---|
| 1 | 🌱 **El trazo que brota** *(firma del sitio)* | SVG capilar 1px coral que crece hacia arriba con el scroll, como un tallo. Conecta secciones y enlaza los 4 peldaños. `stroke-dasharray` + `stroke-dashoffset` |
| 2 | **Revelado desde el suelo** | El titular del hero emerge tras máscara (`clip-path` + `translateY`). **Atado visualmente al trazo #1** — no es un reveal suelto |
| 3 | **La escalera que crece** | Las tarjetas escalan 100% → 116% → 134% → 156%. Ecosistema invierte a fondo negro. La progresión física comunica la escalera antes que los números |
| 4 | **Métricas vivas** | Contadores ascendentes en Fraunces 96px, con regla capilar que crece bajo el número |
| 5 | **Grano de papel** | Ruido SVG (`feTurbulence`) al 3% sobre el crema. Un elemento, cero costo de red |
| 6 | **Barrido coral** | Hover en tarjetas de caso: `clip-path` barre de izquierda a derecha. **Prohibido `scale()`** — empuja el layout |
| 7 | **Marquee** | Conservado del sitio anterior, tipografía nueva, menor velocidad, pausa al hover |

### Reglas duras de movimiento

1. **Máximo 1-2 elementos animados por vista.**
2. `prefers-reduced-motion: reduce` → todo el movimiento se apaga **sin perder contenido**. Contadores en valor final, reveals ya visibles.
3. Solo `transform`, `opacity`, `clip-path`, `stroke-dashoffset`. **Jamás** `width`/`height`/`top`.
4. Micro-interacciones 150-300ms · secciones 300-500ms. `ease-out` al entrar, `ease-in` al salir. Nunca `linear`.
5. **Sin scroll-jacking.**
6. **Mandato técnico del scroll:** `animation-timeline: scroll()` donde haya soporte, con respaldo a listener + `requestAnimationFrame`. Sin esto hay tirones en móvil de gama media.

### Layout y componentes

- Ancho máximo **1160px**. Rejilla de 4px. Ritmo vertical `clamp(80px, 10vw, 140px)`.
- **Composición asimétrica**: hero 55/45, nunca centrado con dos botones debajo.
- Reglas capilares de 1px en vez de bordes de tarjeta donde se pueda — lenguaje editorial, no de dashboard.
- **Móvil primero.** La escalera a 375px va con **scroll-snap horizontal y la siguiente tarjeta asomando** — apilada verticalmente el efecto de progresión se pierde.

### Jerarquía de botones

| Nivel | Estilo | Uso |
|---|---|---|
| Primario | Relleno `--coral-ink`, texto blanco | Un solo primario por vista |
| Secundario | Borde 1px `--black`, texto `--black`, fondo transparente | Acción alterna |
| Terciario | Texto `--coral-ink` con subrayado al hover | Enlaces en línea |

- Altura mínima táctil **44×44px** en todos.
- `:focus-visible` obligatorio: anillo de 2px `--coral-ink` con 2px de separación. **Nunca `outline: none` sin reemplazo.**
- `cursor: pointer` en todo lo clicable.

### Tratamiento de las capturas de caso

Proporción 16:10, esquinas de 8px, borde 1px `--black` al 8%, sin marco de navegador simulado. Sombra sutil de una sola capa. Móvil y desktop juntos en composición escalonada.

### Iconografía

Lucide, viewBox 24×24, trazo 1.5px, color `--black` o `--gray` (coral solo para estado activo). **Cero emojis como iconos** — el sitio anterior usa 💬 en su CTA principal.

---

## 5. Formulario / conversión

### Campos

| Campo | Tipo | Validación Zod | Obligatorio |
|---|---|---|---|
| Nombre | text | `min(2).max(80)` | Sí |
| Correo | email | `email().max(120)` | Sí |
| Teléfono / WhatsApp | tel | `regex` 10 dígitos MX, opcional +52 | Sí |
| Negocio | text | `max(100)` | No |
| **Presupuesto aproximado** | select | enum de 4 rangos | Sí |
| Mensaje | textarea | `min(10).max(1500)` | Sí |
| `website` | hidden | honeypot — si viene lleno → 200 silencioso | — |

**El campo de presupuesto es el que hace trabajar a la escalera.** Opciones: `$3,500–6,000` · `$12,000–18,000` · `$35,000–60,000` · `Más de $80,000` · `No estoy seguro`. Sin él, la escalera es decorativa.

### Seguridad — 6 capas obligatorias, en este orden

1. **Validación Zod** en el endpoint (nunca confiar en el cliente).
2. **Sanitización anti-injection**: strip de headers de email, HTML y URLs sospechosas.
3. **Honeypot**: campo oculto lleno → descartar en silencio con 200.
4. **Rate limiting** Upstash por IP, ventana corta.
5. **Turnstile** verificado server-side.
6. **Fail-closed**: falta cualquier secreto → **503**, jamás procesar sin protecciones.

Envío por Resend. **Batería de ≥10 casos curl** antes de cerrar la fase: happy path, honeypot lleno, sin token, token inválido, rate limit excedido, payloads de injection, campos gigantes, email malformado, presupuesto fuera de enum, cuerpo vacío.

### Estados visibles

Reposo · enviando (botón deshabilitado, sin salto de layout) · éxito · error de validación (mensaje junto al campo) · error de servidor · rate-limited. Los seis se capturan en QA.

### WhatsApp

Botón flotante a `wa.me/529987347034` con mensaje pre-llenado.
⚠️ **Número temporal** (personal de Jesús). Vive en `content/` como constante única — cambiarlo después es editar una línea.

---

## 6. SEO

### Estrategia de palabras clave

**No pelear** (competencia imposible para un dominio que migra, e intención mixta que atrae curiosos, no compradores): "agencia de marketing digital", "diseño de páginas web", "marketing digital CDMX".

**Sí pelear — mid-tail con intención de compra:**

| Término | Dónde |
|---|---|
| "cuánto cuesta una página web en México" | `/servicios` — la tabla de la escalera es candidata natural a fragmento destacado |
| "precio de página web para negocio" · "página web para pymes precio" | `/servicios` |
| "desarrollo web Cancún" · "diseño web Playa del Carmen" | `/servicios` — competencia real baja, nadie serio la ataca |
| "agentes de WhatsApp con IA para negocios" · "automatización con IA para pymes" | `/servicios`, peldaño Ecosistema |

**Long-tail vertical — la que trae al cliente correcto.** Volumen bajo, pero quien busca eso ya es el prospecto exacto. Cada página de caso ataca la suya:

| Página | Término objetivo |
|---|---|
| `/casos/grupo-galarza` | "página web para constructora / inmobiliaria México" |
| `/casos/dra-patricia-garcia` | "página web para consultorio médico" · "diseño web para doctores México" |
| `/casos/despacho-fiscal` | "página web para despacho de abogados fiscalistas" |

**Regla de filtrado:** cada término se mapea a un peldaño de la escalera. Un keyword de alto volumen que trae gente buscando "gratis" o "plantilla" atrae al comprador de Wix, no al de $35,000. No vale la pena.

### Base técnica

- Metadata API de Next.js por ruta: `title` con plantilla `%s | Brota Digital`, `description` única, `canonical`.
- OG image por página vía `next/og`.
- `sitemap.ts` y `robots.ts` generados por Next.
- Sin `hreflang` (monolingüe).
- ⚠️ **`noindex` en los previews de Vercel** — o compiten contra producción.

### SEO local en dos zonas, sin canibalizar

- **Un solo Google Business Profile**, configurado como *Service Area Business* con la dirección oculta y `areaServed` cubriendo CDMX + Cancún + Playa del Carmen + Solidaridad.
  ⚠️ **No crear dos perfiles.** Sin ubicación física distinta va contra las guías de Google y arriesga suspensión.
- ⚠️ **No crear `/desarrollo-web-cdmx` y `/desarrollo-web-cancun`.** Contenido casi idéntico = duplicado que Google fusiona, y las dos páginas se canibalizan. Una sola `/servicios` menciona ambas zonas con naturalidad; la señal geográfica vive en el schema y en las páginas de caso (Dra. Patricia García ya es señal fuerte de Playa del Carmen).
- Landing por ciudad solo si algún día se hace campaña pagada con contenido genuinamente distinto.

### JSON-LD

```
Organization (layout raíz)
 ├─ ProfessionalService (subtipo, sin address pública, priceRange "$$-$$$$")
 └─ makesOffer → Service ×4 (Siembra · Cosecha · Selva · Ecosistema)
      └─ areaServed → Place (CDMX) · Place (Cancún/Playa del Carmen)
```

Más: `BreadcrumbList` en internas · `FAQPage` en `/servicios` · `CreativeWork` en cada caso con `about` apuntando a la industria del cliente.

> 🔴 **Prohibido `AggregateRating` y `Review`** mientras no existan reseñas verificables reales. Google detecta el marcado de reseñas falsas y penaliza. Dado el historial de este sitio, esta regla no es negociable.

### Estructura de las páginas de caso

No son portafolio bonito: son contenido con intención de búsqueda vertical.

`H1` con cliente + industria + servicio → contexto y problema → métricas duras → stack usado → enlace interno al peldaño de la escalera usado y a `/contacto`.

> Este esquema pedía además un testimonio atribuido con nombre y rol, por la señal E-E-A-T. **Se retiró**: no existe ninguno real y la señal no vale inventarlo. Se agrega el día que un cliente escriba uno, no antes.

### FAQ en lugar de blog

La decisión de no llevar CMS es correcta: **un blog abandonado a los 3 meses es peor señal que no tener blog.** El sustituto sin infraestructura son bloques de FAQ estáticos en `/servicios`, editados por código, capturando las preguntas reales que la gente busca ("cuánto cuesta", "cuánto tarda", "qué incluye"). Las páginas de caso ya funcionan como contenido fresco: cada cliente nuevo es una página evergreen de alta intención.

Si en 12 meses quieren más volumen, la ruta es **MDX en el repo** (publicación por commit, cero CMS) — nunca una base de datos que nadie mantendrá.

### Migración desde GitHub Pages

> ⚠️ **Corregido en el paso 12 (11-ago-2026).** Lo que sigue reemplaza al mapeo
> original de anclas, que no era implementable. El porqué está abajo y en
> `next.config.ts`.

El dominio ya sirve un sitio con URLs de anclas (`#servicios`, `#paquetes`, `#proceso`, `#contacto`).

**Las anclas no se redirigen, porque no se puede.** El fragmento de una URL lo
resuelve el navegador y **nunca viaja en la petición**: el servidor de
`brotadigital.mx/#servicios` recibe `/` y nada más. Una regla `source:
"/#servicios"` en `next.config.ts` compila y no se ejecuta jamás. Lo que sí
llega de esas visitas es `/`, que se conserva.

De las cuatro anclas, la única con destino propio en el sitio nuevo es
`#proceso`, y ya funciona sin redirección: la sección Proceso de la home lleva
`id="proceso"` desde el paso 7.

**Sí hay una URL real que redirigir, y no estaba en este documento.** El
`sitemap.xml` del sitio viejo declara dos: `/` y **`/brief.html`** — un
formulario de brief que responde 200 y no lleva `noindex`, así que es
indexable. Es la única que se queda sin destino al cortar:

| URL vieja | Destino | Cómo |
|---|---|---|
| `/` | `/` | Se conserva |
| `/brief.html` | `/contacto` | **301 en `next.config.ts`** ✅ montado |
| `#servicios` · `#paquetes` · `#contacto` | — | No implementable: el fragmento no llega al servidor |
| `#proceso` | `/#proceso` | Ya funciona: `id="proceso"` en la home |

Procedimiento de cutover:

1. Exportar de Search Console las URLs indexadas y las páginas con clics **antes** de cortar — aunque sea poco tráfico, es equity ganado. Sirve además para confirmar si `/brief.html` acumuló algo.
2. **Conservar la misma propiedad de Search Console**, no crear una nueva.
3. Reenviar el `sitemap.xml` nuevo y forzar reindexación de las páginas clave.
4. Vigilar el reporte de cobertura 2-4 semanas por picos de 404.

El dominio ya tiene historial: **no se lanza sin esto.**

### Rendimiento

SSG puro, cero JS innecesario. `next/image` con WebP/AVIF, `priority` solo en el LCP. Fuentes self-hosted. **Meta: Lighthouse móvil ≥ 90 en las 4 categorías** — la agencia presume 94 en el sitio de un cliente; el suyo no puede salir peor.

---

## 7. Estructura de directorios

```
brota-digital/
  src/
    app/
      layout.tsx                  # metadata base, fuentes, JSON-LD Organization
      page.tsx                    # home
      servicios/page.tsx
      casos/page.tsx
      casos/[slug]/page.tsx       # 3 casos desde content/
      contacto/page.tsx
      aviso-de-privacidad/page.tsx
      not-found.tsx
      api/contact/route.ts        # 6 capas
      globals.css                 # design tokens — única fuente de hex
    components/
      layout/                     # Header, Footer, TalloSVG
      sections/                   # Hero, Escalera, Casos, Proceso, CTA, Marquee
      ui/                         # Button, Card, Metrica, Eyebrow, Grano
      forms/                      # ContactForm
    content/
      servicios.ts                # los 4 peldaños
      casos.ts                    # los 3 casos
      site.ts                     # NAP, WhatsApp, redes — constantes únicas
    lib/
      resend.ts · ratelimit.ts · schemas.ts · turnstile.ts
  public/
    logo/ (wordmark.svg, lockup.svg, icono.svg) · og/ · casos/
  docs/
    qa/                           # evidencia de screenshots
  .claude/launch.json             # puerto 3400
  BLUEPRINT.md · CLAUDE.md · .env.example
```

⚠️ `.gitignore` debe incluir `material/` y `.env.local` **desde el primer commit**.

---

## 8. CLAUDE.md del proyecto

```markdown
# Brota Digital — Sitio propio (Brota Mx)

Sitio de la agencia Brota Digital. Este es el sitio PROPIO, no el de un cliente:
es la demostración del producto y se sostiene con un estándar más alto, no más bajo.

## Contexto
- **Blueprint:** `BLUEPRINT.md` (fuente de verdad — leerlo antes de cualquier cambio grande)
- **Vault:** `G:\My Drive\MiVault\Brota Mx\Brota Digital\` (Plan, Estado, diario)
- **Repo:** `Brota-mx/brota-digital` (PÚBLICO — jamás versionar secretos ni material del cliente)
- **Deploy:** Vercel (cuenta Brota)

## Stack
Next.js 15 (App Router, SSG) · TypeScript strict · Tailwind v4 · pnpm · monolingüe ES
Formulario: RHF + Zod + honeypot + Upstash rate-limit + Turnstile + Resend (fail-closed)

## Comandos
- `pnpm dev` — dev server en puerto **3400** (no 3000 — ver `.claude/launch.json`)
- `pnpm build` — debe salir verde antes de todo push
- `pnpm audit` — **0 vulnerabilidades siempre**
- `pnpm test:e2e` — smoke Playwright

## Reglas del proyecto
1. Los design tokens viven en `globals.css` — nunca hex sueltos en componentes.
2. Todo texto visible sale de `content/` — nada hardcodeado en JSX.
3. Fase de UI terminada = screenshots **móvil primero** + desktop + `/impeccable` pasado.
4. Contraste AA en todo texto. `--coral` nunca para texto <24px; para eso está `--coral-ink`.
   `--gold` jamás para texto.
5. Movimiento: máx. 1-2 elementos animados por vista; `prefers-reduced-motion` apaga todo
   sin perder contenido; solo `transform`/`opacity`/`clip-path`/`stroke-dashoffset`.
6. Cero emojis como iconos. Lucide, trazo 1.5px.
7. Prohibido `scale()` en hover (empuja el layout).
8. Secretos solo en `.env.local` / Vercel. Nunca pedirlos por chat.
9. Responder siempre en español.
10. `ponytail` aplica: solución mínima que funcione; cero dependencias que el BLUEPRINT no pida.

## Estado actual
Fase 1 del orden de construcción — sin scaffoldear.
```

---

## 9. Variables de entorno

```
# .env.example — Jesús carga los valores reales en .env.local y en Vercel
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
CONTACT_EMAIL=
NEXT_PUBLIC_SITE_URL=
```

---

## 10. Orden de construcción

> **Reglas de build:** `pnpm audit` = 0 vulnerabilidades antes del primer commit · cada fase de UI cierra con screenshots **móvil primero** + desktop y detector `/impeccable` · un commit por fase · `ponytail` activo.

1. **Scaffold** — `create-next-app`, Tailwind v4, TS strict. Tokens de §4 en `globals.css`. `.gitignore` con `material/` y `.env.local`. `pnpm audit` limpio. Repo creado y primer push — **verificar que `material/` NO subió**.
2. **Logo** — generar las 3 piezas SVG de §4. Favicon y OG base.
3. **Layout base + SEO técnico** — Header, Footer, metadata base, fuentes self-hosted (Fraunces + DM Sans), JSON-LD `Organization`, `sitemap.ts`, `robots.ts`.
4. **Contenido tipado** — `content/` con los 4 peldaños, los 3 casos y las constantes del sitio. Todo el texto de §3.
5. **Sistema de componentes** — Button (3 niveles + `:focus-visible`), Card, Metrica, Eyebrow, Grano de papel. Es la base de todo lo demás: se hace antes que las secciones.
6. **El trazo que brota** — componente `TalloSVG` con `animation-timeline: scroll()` y respaldo `rAF`. Verificar en móvil de gama media antes de seguir.
7. **Home** — Hero (revelado atado al trazo) · Escalera (con scroll-snap horizontal en móvil) · Casos · Proceso · CTA · Marquee.
8. **`/servicios`** — los 4 peldaños a detalle + bloque FAQ con `FAQPage` (§6).
9. **`/casos` + las 3 páginas de caso** — capturas generadas con `playwright-cli` contra los sitios en producción. ⚠️ Las páginas que identifican al cliente dependen de los requisitos previos de §11.
10. **`/contacto` + formulario seguro** — 6 capas de §5 + batería de ≥10 casos curl + los 6 estados visibles.
11. **`/aviso-de-privacidad` + 404** — contenido legal de §11.
12. **Cierre SEO** — metadata única por página, sitemap y robots servidos, JSON-LD validado con Rich Results Test, 404 sin enlaces rotos, crawl con `playwright-cli`, **mapeo de redirecciones desde el sitio anterior**.
13. **Cierre de seguridad** — CSP estática + headers (`X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS). `pnpm audit` = 0. Grep de secretos a mano. Fail-closed verificado quitando una variable en local (debe dar 503).
14. **Cierre de QA visual** — smoke E2E (toda página 200, nav, formulario, enlaces externos) · screenshots de todas las páginas móvil+desktop a `docs/qa/` · zoom 200% sin romper · revisión en dark-mode del SO · **Lighthouse móvil ≥ 90 ×4**.
15. **Deploy** — Vercel, variables en Production **y** Preview, verificación en producción. Dominio solo cuando §11 esté resuelto.

---

## 11. Requisitos previos a la publicación

Este sitio **no se publica** hasta cerrar una lista de requisitos legales y de contenido:
autorizaciones de terceros para publicar su caso, aviso de privacidad conforme a la LFPDPPP,
confirmación de la autoridad garante vigente en materia de protección de datos, declaración
de las transferencias de datos, y revisión de los textos comerciales.

📁 **La lista operativa vive fuera de este repositorio**, en las notas internas del proyecto
(`Plan - Brota Digital`). No se versiona a propósito: contiene condiciones comerciales,
pendientes internos y referencias a terceros, y **este repositorio es público**.

Los pasos 9, 11 y 15 del orden de construcción dependen de que esa lista esté cerrada.

---

## 12. Entregables derivados (después del sitio)

Salen del mismo sistema de marca y reutilizan el contenido de §3. No requieren sesión de diseño nueva:

| Entregable | Fuente | Formato |
|---|---|---|
| **One-pager** | Escalera de §3 + una métrica por caso | PDF carta, 1 página |
| **3 casos de estudio** | Las páginas `/casos/*` ya escritas | PDF, 2 páginas c/u |
| **Propuesta comercial** | Plantilla con la escalera + proceso de 4 pasos | PDF editable |
| **Contrato** | Proceso 50/50 + alcance por peldaño + **cláusula de portafolio** | Requiere revisión de abogado |
| **Firma de correo** | Lockup del logo + datos | HTML |
| **Kit de Instagram** | Paleta + tipografía + plantillas | Piezas para `@brotadigitaal` |
