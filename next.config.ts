import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cada fase de UI cierra con capturas de evidencia a docs/qa/, y el
  // indicador de dev se cuela en todas. Los errores de compilación se siguen
  // mostrando; esto solo apaga la insignia flotante.
  devIndicators: false,

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
};

export default nextConfig;
