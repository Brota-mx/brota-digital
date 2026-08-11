import { ImageResponse } from "next/og";

/**
 * `/logo.png` — el icono cuadrado del blueprint §4, en PNG.
 *
 * Existe por una sola razón: el campo `logo` del JSON-LD `Organization`
 * (blueprint §6) y Google no acepta SVG ahí. En vez de exportar un PNG a mano
 * y versionarlo —un segundo archivo que hay que acordarse de regenerar cada
 * vez que el icono cambie— se dibuja el mismo path que ya usa `icon.svg`.
 *
 * Es un `route.tsx` y no un `icon.tsx` porque el favicon ya lo sirve
 * `icon.svg`; esto es un activo del marcado, no un icono del navegador. La
 * carpeta se llama `logo.png` para que la URL lleve extensión: nada lo exige,
 * pero un `logo` sin extensión en un JSON-LD se lee como error.
 *
 * ⚠️ El path viene de `icon.svg` — si uno cambia, cambian los dos.
 *
 * 512px: el mínimo de Google para el logo son 112px de lado; 512 es la potencia
 * de dos más chica que sobra sin que el PNG pese.
 */

export const dynamic = "force-static";

const LADO = 512;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#E85D3A",
        }}
      >
        <svg viewBox="0 0 1000 1000" width={LADO} height={LADO}>
          <g transform="translate(296.61 799.08) scale(0.84)">
            <path
              d="M258 13Q217 13 178.50-0.50Q140-14 105-44L158-142Q158-92 179.50-62Q201-32 231.50-19Q262-6 287-6Q340-6 369.50-51Q399-96 399-178Q399-270 364.50-315Q330-360 276-360Q238-360 205.50-338.50Q173-317 145-289L137-296Q158-319 183-343Q208-367 240.50-383Q273-399 314-399Q357-399 393.50-378.50Q430-358 453-317Q476-276 476-214Q476-138 444-87.50Q412-37 362-12Q312 13 258 13M158-49L39 5Q35 6 33 2Q31-2 35-4Q62-22 76-42.50Q90-63 90-103L90-594Q90-630 83-646Q76-662 58-662Q43-662 15-649Q11-647 9-653Q7-659 10-660L141-724Q144-725 146-725Q150-725 154-722Q158-719 158-715"
              fill="#FDFAF5"
            />
          </g>
        </svg>
      </div>
    ),
    { width: LADO, height: LADO },
  );
}
