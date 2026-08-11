import { expect, test } from "@playwright/test";

import { casos } from "../src/content/casos";
import { contactoPagina } from "../src/content/contacto";
import { site } from "../src/content/site";

/**
 * Smoke E2E — paso 14 del orden de construcción.
 *
 * QUÉ CONGELA Y POR QUÉ ESO
 *
 * No repite lo que ya cubren el compilador y el linter. Cubre las tres formas
 * en que este proyecto ya se rompió **sin fallar en rojo**, que son las únicas
 * que un smoke puede evitar que vuelvan:
 *
 * 1. **El JSON-LD desaparece en silencio.** Va en `<script>` en línea; una CSP
 *    más estricta lo borra con el build en verde y la página idéntica (paso
 *    13). Aquí se cuenta y se parsea en cada ruta.
 * 2. **Las cabeceras de seguridad dejan de servirse.** Son configuración de
 *    `next.config.ts`, no código que compile: quitarlas no rompe nada (paso 13).
 * 3. **El documento desborda a lo ancho.** El widget de Turnstile ya lo hizo a
 *    320 px y no se veía a 375 (paso 10). Lo cazó una medición, no una vista.
 *
 * Las rutas se leen de `content/`, así que un caso nuevo entra al smoke sin
 * que haya que acordarse de escribirlo dos veces — igual que en `sitemap.ts`.
 *
 * LO QUE ESTE SMOKE *NO* PUEDE CERRAR
 *
 * El envío real del formulario. Sin `RESEND_API_KEY`, `UPSTASH_*` y
 * `TURNSTILE_*` el endpoint es fail-closed y responde 503 antes de tocar nada.
 * Eso se prueba —es el comportamiento correcto y verificable hoy— y se dice
 * dónde se corta: el camino de éxito no lo ha recorrido nadie todavía.
 */

const RUTAS = [
  "/",
  ...site.sitemap.filter((r) => r !== "/"),
  ...casos.map((c) => `/casos/${c.slug}`),
];

/** Las seis del paso 13, servidas en toda respuesta. */
const CABECERAS = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-frame-options",
];

test.describe("las páginas del sitio", () => {
  for (const ruta of RUTAS) {
    test(`${ruta} responde, tiene un H1 y su JSON-LD parsea`, async ({
      page,
    }) => {
      const respuesta = await page.goto(ruta);
      expect(respuesta?.status()).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).not.toBeEmpty();
      expect(await page.title()).not.toBe("");

      // Contar y parsear, no leer la política: una CSP que bloquee el marcado
      // lo deja fuera del DOM sin que nada falle.
      const bloques = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      expect(bloques.length).toBeGreaterThan(0);
      for (const bloque of bloques) expect(() => JSON.parse(bloque)).not.toThrow();
    });
  }

  test("los títulos son únicos entre rutas", async ({ page }) => {
    const titulos: string[] = [];
    for (const ruta of RUTAS) {
      await page.goto(ruta);
      titulos.push(await page.title());
    }
    expect(new Set(titulos).size).toBe(titulos.length);
  });
});

test("el aviso de privacidad da 404 con la página del sitio", async ({
  page,
}) => {
  const respuesta = await page.goto(site.legal.href);
  expect(respuesta?.status()).toBe(404);

  // El 404 de Next no lleva el header del sitio; el del sitio sí.
  await expect(page.locator("h1")).toHaveCount(1);
  for (const { href } of site.nav) {
    await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
  }
});

test("las seis cabeceras de seguridad viajan en toda respuesta", async ({
  page,
}) => {
  // Una página, el 404 y la API: los tres tipos de respuesta que el paso 13
  // verificó por separado y que se sirven por caminos distintos.
  for (const ruta of ["/", site.legal.href]) {
    const respuesta = await page.goto(ruta);
    const cabeceras = respuesta!.headers();
    for (const nombre of CABECERAS) expect(cabeceras).toHaveProperty(nombre);
  }

  const api = await page.request.post("/api/contacto", { data: {} });
  for (const nombre of CABECERAS) expect(api.headers()).toHaveProperty(nombre);
});

test("ninguna ruta desborda a lo ancho a 320 ni a 375", async ({ page }) => {
  for (const ancho of [320, 375]) {
    await page.setViewportSize({ width: ancho, height: 812 });
    for (const ruta of [...RUTAS, site.legal.href]) {
      await page.goto(ruta);
      // Contra `clientWidth`, NUNCA contra `window.innerWidth`. Con emulación
      // móvil Chromium ensancha el viewport de layout para acomodar lo que
      // desborda: con un bloque de 900 px metido a propósito en la home,
      // `innerWidth` devolvió 901 y la resta dio 0 — la prueba pasaba
      // justamente en el caso que existe para cazar. `clientWidth` se queda en
      // los 375 pedidos y el mismo control da 526 px de desborde.
      const desborde = await page.evaluate(() => {
        const raiz = document.documentElement;
        return raiz.scrollWidth - raiz.clientWidth;
      });
      expect(desborde, `${ruta} a ${ancho}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("ningún objetivo táctil baja de 44×44", async ({ page }) => {
  // La regla 12 del CLAUDE.md, y la única que ha fallado dos veces: en la nav
  // del paso 3 y en las migas del paso 9, las dos por el ANCHO, porque el alto
  // es el que se escribe solo. No la caza mirar la captura: la caza medir.
  for (const ruta of [...RUTAS, site.legal.href]) {
    await page.goto(ruta);
    const chicos = await page.evaluate(() =>
      [...document.querySelectorAll("a, button, select, input, textarea")]
        // El honeypot queda fuera a propósito: está `aria-hidden`, fuera del
        // lienzo y con `tabIndex -1`, así que no es objetivo táctil de nadie
        // —quien lo tocara sería un bot, que es el punto.
        .filter((e) => !e.closest('[aria-hidden="true"]'))
        .map((e) => {
          const r = e.getBoundingClientRect();
          return {
            que: (e.textContent || e.tagName).trim().slice(0, 30),
            w: Math.round(r.width),
            h: Math.round(r.height),
          };
        })
        .filter((x) => x.w > 0 && (x.w < 44 || x.h < 44)),
    );
    expect(chicos, ruta).toEqual([]);
  }
});

test("la navegación del header llega a las tres rutas", async ({ page }) => {
  for (const { label, href } of site.nav) {
    await page.goto("/");
    // Por nombre accesible: el sitio tiene dos `<nav>` con los mismos enlaces
    // —la principal y la del footer— y sin el nombre el selector es ambiguo.
    await page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name: label })
      .click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  }
});

test("el formulario se envía y el fail-closed contesta", async ({ page }) => {
  await page.goto("/contacto");

  await page.fill("#nombre", "Prueba Smoke");
  await page.fill("#correo", "prueba@ejemplo.mx");
  await page.fill("#telefono", "9987347034");
  await page.selectOption("#presupuesto", "siembra");
  await page.fill("#mensaje", "Mensaje de prueba del smoke E2E del paso 14.");

  await page.getByRole("button", { name: contactoPagina.enviar }).click();

  // Sin credenciales el endpoint responde 503 antes de procesar: el estado
  // «no-disponible» es la respuesta correcta, y es hasta donde llega la prueba.
  // Con las variables cargadas, esta aserción tiene que cambiar al estado de
  // éxito — el día que eso pase, es la señal de que el camino real ya existe.
  await expect(
    page.getByText(contactoPagina.estados.errorNoDisponible),
  ).toBeVisible();
});

test("la consola no reporta errores ni peticiones fallidas", async ({
  page,
}) => {
  const errores: string[] = [];

  page.on("pageerror", (e) => errores.push(`pageerror: ${e.message}`));
  // Las respuestas se leen por URL y no por el texto de la consola: «Failed to
  // load resource: 404» no dice QUÉ falló, y la única que puede fallar a
  // propósito —la del aviso de privacidad, que todavía no existe— se lee
  // idéntica a un chunk que no cargó.
  page.on("response", (r) => {
    if (r.status() >= 400 && new URL(r.url()).pathname !== site.legal.href) {
      errores.push(`${r.status()} ${r.url()}`);
    }
  });

  for (const ruta of [...RUTAS, site.legal.href]) await page.goto(ruta);

  expect(errores).toEqual([]);
});
