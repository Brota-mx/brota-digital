# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Dueños y responsables de negocios mexicanos que necesitan presencia digital y no saben
traducir eso a una decisión de compra.** Llegan sabiendo que "necesitan una página" pero sin
vocabulario técnico ni forma de juzgar si $3,500 o $60,000 es un precio justo por lo mismo.
El trabajo que están haciendo cuando llegan al sitio es **calificar a un proveedor y
estimar cuánto les va a costar**, no aprender de tecnología.

Cubren un rango real y verificado por los tres clientes actuales: desde un negocio pequeño
que necesita una landing con WhatsApp, hasta un despacho o grupo empresarial que necesita
sitio bilingüe con CMS, agenda, seguridad auditada y sistemas de automatización.

Audiencia secundaria: el cliente actual que crece y necesita el siguiente peldaño.

## Product Purpose

Brota Digital construye sitios web, identidad de marca, gestión de redes y sistemas de
automatización e IA para negocios mexicanos. Opera desde CDMX y Cancún/Playa del Carmen.

El sitio existe para **generar solicitudes de cotización calificadas, con el presupuesto
declarado desde el primer contacto**. Éxito = el formulario se envía con un rango de
presupuesto seleccionado y suficiente contexto para responder con una propuesta real, sin
una ronda previa de "¿cuánto cuesta?".

Acción principal del visitante: enviar el formulario (canal principal) o escribir por
WhatsApp (canal rápido).

## Positioning

**Todo se puede escalar, desde lo más básico hasta lo más complejo — con el mismo
proveedor.** Ese es el mecanismo, y es el que un competidor del segmento no puede copiar
honestamente: la mayoría de las agencias baratas no puede entregar el peldaño alto, y las
agencias caras no atienden el peldaño de entrada. Brota tiene trabajo en producción en
ambos extremos.

La consecuencia de diseño es que **la escalera de cuatro peldaños es el argumento
estructural del sitio**, no una tabla de precios. El visitante se autoclasifica y ve el
camino completo por delante; nadie tiene que cambiar de agencia por haber crecido.

Segundo diferenciador, subordinado al primero: **el trabajo es verificable.** No "hacemos
páginas bonitas" sino métricas concretas de sitios en producción. Ninguna agencia del
segmento muestra números.

## Operating Context

- **La escalera de servicios** (nombres ya en uso por la marca, metáfora vegetal
  consistente): Siembra → Cosecha → Selva → Ecosistema. El cuarto peldaño (sistemas de IA
  y automatización) es nuevo y es el que estira el rango hacia arriba.
- **El proceso comercial es 50/50**: briefing → propuesta + 50% de anticipo → diseño con
  rondas de revisión → entrega + 50% restante.
- El visitante típico compara contra agencias locales y contra constructores tipo Wix. El
  sitio debe hacer evidente por qué el trabajo no es lo mismo, sin descalificar al que
  entra por abajo.
- La agencia la operan dos socios. **La marca no declara número de integrantes.**

## Capabilities and Constraints

- Sitio monolingüe en español. Sin CMS: el contenido es tipado en el repositorio. Ambas
  decisiones son deliberadas y están razonadas en `BLUEPRINT.md` §2.
- Un blog abandonado a los tres meses es peor señal que no tener blog. El sustituto son
  bloques de FAQ estáticos, editados por código.
- El sitio migra desde un dominio con historial (`brotadigital.mx`, hoy en GitHub Pages con
  URLs de anclas). El cutover exige mapeo de redirecciones 301 y conservar la propiedad de
  Search Console.
- **Decisión abierta:** el número de WhatsApp publicado es el personal de un socio y es
  temporal. Vive como constante única para poder sustituirlo en una línea.
- **Decisión abierta:** fotos del equipo. El sitio funciona sin ellas.
- **Restricción legal:** el sitio no se publica hasta cerrar los requisitos previos de
  `BLUEPRINT.md` §11. La lista operativa vive en las notas internas del proyecto, fuera de
  este repositorio público.

## Brand Commitments

- **Nombre público único: "Brota Digital"** (confirmado 6-ago-2026). `Brota-mx` queda como
  namespace técnico interno de GitHub y no aparece en el sitio.
- **Voz: tercera persona de despacho** ("Brota construye…"). Nunca femenino plural ni
  primera persona singular — el sitio anterior mezclaba ambas y es un error a no repetir.
- **Tono:** profesional, serio, de excelencia. Directo y sin tecnicismos innecesarios, pero
  sin la ligereza del sitio anterior.
- **La metáfora vegetal es activo de marca y se conserva**: el nombre, los peldaños de la
  escalera y el lenguaje de crecimiento. Es lo mejor que tenía la marca anterior.
- **Identidad visual heredada, no inventada**: paleta y tipografía provienen del CSS real
  del sitio anterior, muestreado en vivo. Documentado en `BLUEPRINT.md` §4 y codificado en
  `src/app/globals.css`, que es la única fuente de color del proyecto.
- **Sin símbolo botánico nuevo.** El logo es wordmark tipográfico. Inventar un isotipo sería
  crear un activo de marca que requiere decisión de ambos socios.

## Evidence on Hand

**Tres clientes reales con trabajo en producción y métricas duras:**

| Cliente | Evidencia verificable |
|---|---|
| Grupo Galarza | 84 casos E2E · Lighthouse móvil mínimo 94 · 6 cabeceras de seguridad · contraste AA · bilingüe |
| Dra. Patricia García | Bilingüe ES/EN · CMS · agenda integrada · CSP y headers · 4 items válidos en Rich Results |
| Despacho fiscalista (se publica **sin nombre ni logo**, solo el giro) | 52 tests E2E · rate limiting · Turnstile · dos sedes |

⚠️ Las dos páginas de caso que se publican con nombre tienen requisitos previos que se
resuelven fuera de este repositorio. **No se publican hasta cerrarlos** (`BLUEPRINT.md` §11).

**Ausencias que el trabajo futuro NO debe rellenar inventando:**

- 🔴 **No hay testimonios, y ninguno se inventa.** No existe todavía ni una reseña
  atribuible a un cliente real. **Jamás se escriben testimonios, reseñas, calificaciones ni
  clientes que no existan** — ni siquiera como texto de relleno "provisional", porque el
  relleno se queda. Prohibido también marcar `AggregateRating` o `Review` en JSON-LD
  mientras no haya reseñas verificables reales: Google detecta el marcado de reseñas falsas
  y penaliza. Esta regla no se negocia y no tiene excepción de plazo.
- No hay fotografías propias de ningún tipo. El sitio anterior no tiene una sola imagen.
- El Instagram `@brotadigitaal` está vacío (0 publicaciones).
- No hay número de clientes, años de experiencia ni volumen de proyectos que se pueda
  afirmar. Si un dato no está en esta sección, no se publica.

## Product Principles

1. **La escalera es el argumento.** Toda decisión de estructura y jerarquía se juzga por si
   hace evidente que el visitante puede empezar donde está y crecer sin cambiar de
   proveedor.
2. **Nada que no se pueda verificar.** Métricas de sitios reales sí; adjetivos sobre calidad
   y prueba social fabricada no. Si un dato no se puede señalar en producción, no se publica.
3. **El presupuesto se habla de frente.** El precio y el rango son parte del contenido, no
   información que se esconde hasta la llamada. Es lo que califica al lead y lo que la ley
   exige respaldar.
4. **El sitio propio es la demostración del producto.** Si Brota vende sitios accesibles,
   rápidos y seguros, el suyo no puede salir peor que el de un cliente. El estándar es más
   alto aquí, no más bajo.
5. **El visitante llega en teléfono.** Móvil es la pantalla principal de diseño, no la
   adaptación posterior.

## Accessibility & Inclusion

**WCAG 2.1 nivel AA es requisito de producto, no aspiración** — la agencia vende
accesibilidad como entregable y audita la de sus clientes.

- Todo texto cumple AA. Los acentos cálidos de la paleta reprueban como texto y están
  prohibidos para ese uso a cualquier tamaño; existe un token de tinta derivado para texto.
- `:focus-visible` visible y obligatorio en todo elemento interactivo. Nunca `outline: none`
  sin reemplazo.
- Objetivo táctil mínimo 44×44px.
- `prefers-reduced-motion: reduce` apaga todo el movimiento **sin perder contenido**.
- El sitio debe sostener zoom al 200% y navegación completa por teclado.
- Meta de rendimiento: Lighthouse móvil ≥ 90 en las cuatro categorías.
