import { defineConfig } from "@playwright/test";

/**
 * Configuración del smoke E2E — paso 14 del orden de construcción.
 *
 * CONTRA EL BUILD DE PRODUCCIÓN, NO CONTRA `next dev`
 *
 * `pnpm dev` compila cada ruta al pedirla, no aplica la misma CSP (en
 * desarrollo se relaja con `'unsafe-eval'`, ver `next.config.ts`) y sirve
 * React en modo desarrollo. Un smoke que pase ahí no dice nada del sitio que
 * se va a publicar. Por eso el `webServer` hace `build` y luego `start`.
 *
 * PUERTO 3400, Y SIN REUTILIZAR LO QUE YA ESTÉ AHÍ
 *
 * El mismo del dev server, y por la misma razón: el 3000 se lo queda el
 * proyecto de otro cliente. `reuseExistingServer: false` no es cautela
 * abstracta: con `true` la primera corrida de este smoke enganchó un
 * `next start` de una sesión anterior que seguía vivo en 3400, y ese servidor
 * seguía sirviendo el HTML de un `.next` que el build acababa de reemplazar.
 * Resultado: los `<script>` de cada página pedían chunks que ya no existían y
 * la consola devolvía 404 y 500 en cascada. **Tres pruebas en rojo por un
 * proceso zombi, no por el sitio** — y el rojo señalaba al código. Un servidor
 * ajeno en el puerto ahora aborta la corrida en vez de contaminarla.
 *
 * UN SOLO NAVEGADOR, Y MÓVIL
 *
 * El smoke comprueba que las páginas existen, responden y llevan lo que dicen
 * llevar — nada de eso cambia entre motores. Lo que sí cambió entre motores en
 * este proyecto fue el trazo del tallo, y eso se verificó a mano en el paso 6
 * con Firefox de control. Tres navegadores aquí multiplicarían por tres el
 * tiempo para repetir la misma aserción de HTML (regla 10).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],

  use: {
    baseURL: "http://localhost:3400",
    // El sitio se lee primero en teléfono (regla 3). Un smoke a 1440 dejaría
    // sin probar el ancho donde han salido todos los hallazgos del proyecto.
    //
    // El viewport se escribe a mano en vez de usar un preset de `devices`
    // porque los presets traen su propio ancho —el de «Pixel 7» son 412— y el
    // ancho de referencia de este proyecto es 375: es donde se tomaron todas
    // las capturas y donde se midió el presupuesto de movimiento.
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  },

  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3400",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
