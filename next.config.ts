import type { NextConfig } from "next";

// ── Cierre de seguridad (paso 13) ───────────────────────────────────────────
//
// En desarrollo React usa `eval` para reconstruir las pilas de error del
// servidor dentro del navegador. Es lo único que se relaja, y solo aquí: en
// producción ni React ni Next lo necesitan.
const enDesarrollo = process.env.NODE_ENV === "development";

const TURNSTILE = "https://challenges.cloudflare.com";

/**
 * CSP estática (blueprint §10, paso 13).
 *
 * POR QUÉ ESTÁTICA Y NO CON NONCE
 *
 * Un nonce tiene que ser distinto en cada respuesta, así que exige render
 * dinámico: Next lo inyecta durante el SSR leyendo la cabecera de la petición,
 * y una página generada en el build no tiene petición donde leerlo. Ponerlo
 * aquí costaría el SSG entero —el modo que pide el blueprint §2— para las 16
 * rutas del sitio. No se paga.
 *
 * POR QUÉ `'unsafe-inline'` EN `script-src`, DICHO SIN ADORNOS
 *
 * Sin nonce, esta es la parte floja de la política y conviene nombrarla en vez
 * de disimularla. La alternativa —hashes— no es implementable aquí: los
 * `<script>` que Next emite en línea para hidratar (`self.__next_f.push(…)`)
 * llevan el payload de cada ruta, cambian con cada build y con cada página, y
 * una lista de hashes en un archivo de configuración no puede seguirlos. Y en
 * cuanto hay un hash, el navegador IGNORA `'unsafe-inline'`: no se pueden
 * mezclar para cubrir «los míos por hash, los de Next por unsafe-inline».
 *
 * Lo que queda protegido igual: `default-src 'self'` corta la exfiltración a
 * otro dominio, `object-src 'none'` mata los plugins, `base-uri 'self'` impide
 * reescribir a dónde resuelven las rutas relativas y `form-action 'self'`
 * impide que un formulario inyectado postee los datos afuera. El sitio no pinta ni
 * un carácter de contenido enviado por nadie: es SSG de `content/`, no hay
 * base de datos y el único `dangerouslySetInnerHTML` es un `JSON.stringify` de
 * constantes del build.
 *
 * ⚠️ El JSON-LD de los pasos 3 y 12 va en `<script>` en línea en cuatro rutas.
 * Si algún día esta política se endurece, ese marcado desaparece sin que nada
 * falle en rojo: se comprueba cargando las páginas, no leyendo la política.
 *
 * `style-src 'unsafe-inline'`: Tailwind sale a un archivo, pero Next inyecta
 * estilos críticos en línea y el widget de Turnstile se estiliza a sí mismo.
 *
 * Turnstile aparece dos veces porque son dos cosas: `script-src` para
 * `api.js`, que se carga en la página, y `frame-src` para el iframe del reto,
 * que es donde vive el widget de verdad.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${TURNSTILE}${enDesarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  `frame-src ${TURNSTILE}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const cabecerasDeSeguridad = [
  { key: "Content-Security-Policy", value: csp },

  // `frame-ancestors 'none'` ya lo dice y manda donde hay CSP. Esta cabecera se
  // queda para los navegadores que no la implementan, que es literalmente el
  // caso de uso que le queda.
  { key: "X-Frame-Options", value: "DENY" },

  // Sin esto, un navegador puede decidir que un archivo servido como texto es
  // en realidad un script, y ejecutarlo.
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Fuera del sitio solo viaja el origen, y nunca de https a http. Dentro del
  // sitio la URL completa: es lo que necesita la analítica de Vercel para saber
  // desde qué página se llegó.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Solo se niega lo que el sitio no usa y sería caro que un tercero usara.
  // Una lista exhaustiva de todas las funciones del navegador envejece mal:
  // cada versión inventa nombres y los viejos se ignoran en silencio.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },

  // Dos años, subdominios incluidos. **Sin `preload`** a propósito: meter el
  // dominio en la lista precargada de los navegadores obliga a HTTPS a TODO
  // subdominio de `brotadigital.mx` —incluidos los que todavía no existen— y
  // salir de esa lista tarda meses. Es una decisión de los dos socios, no de
  // una sesión técnica. Sobre http la cabecera se ignora: en local no hace nada.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  // Cada fase de UI cierra con capturas de evidencia a docs/qa/, y el
  // indicador de dev se cuela en todas. Los errores de compilación se siguen
  // mostrando; esto solo apaga la insignia flotante.
  devIndicators: false,

  // `X-Powered-By: Next.js` en cada respuesta. No es una vulnerabilidad —el
  // framework se deduce igual del `/_next/` de cada recurso— pero anunciar la
  // pila no le sirve a nadie salvo a quien busca objetivos por versión. Una
  // línea, cero costo.
  poweredByHeader: false,

  // Mapeo de la migración desde GitHub Pages (blueprint §6, paso 12).
  //
  // El blueprint mandaba montar aquí `#servicios` → `/servicios`, `#paquetes`
  // → `/servicios` y `#contacto` → `/contacto`. **Esas tres reglas no se
  // pueden escribir**: el fragmento de una URL lo resuelve el navegador y
  // nunca viaja en la petición, así que `source: "/#servicios"` compilaría y
  // no se ejecutaría jamás. Lo que sí llega de esas visitas es `/`, que se
  // conserva; y `#proceso`, que ya funciona porque la sección Proceso de la
  // home lleva `id="proceso"` desde el paso 7.
  //
  // Al revisar el sitio viejo apareció la URL que sí existe y que el
  // procedimiento no listaba: su `sitemap.xml` declara dos, `/` y
  // `/brief.html` — un formulario de brief que responde 200 y no lleva
  // `noindex`. Es la única que se queda sin destino al cortar, y su
  // equivalente en el sitio nuevo es `/contacto`.
  //
  // ⚠️ Permanente (308) a propósito: la página vieja no vuelve.
  async redirects() {
    return [{ source: "/brief.html", destination: "/contacto", permanent: true }];
  },

  // Las cabeceras van en TODAS las respuestas, incluida `/api/contacto`: la
  // política le cuesta cero a una respuesta JSON y así no hay una lista de
  // excepciones que mantener cada vez que aparezca una ruta nueva.
  async headers() {
    return [{ source: "/:path*", headers: cabecerasDeSeguridad }];
  },
};

export default nextConfig;
