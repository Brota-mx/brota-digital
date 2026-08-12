"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/**
 * Gradiente animado del hero (WebGL, `@shadergradient/react`).
 *
 * ⚠️ ES LA ÚNICA DEPENDENCIA PESADA DEL SITIO Y ESTÁ ARRIBA DEL PLIEGUE.
 * Decisión tomada con estos números medidos sobre la mesa (11-ago):
 *
 *   Lighthouse móvil, rendimiento   100 → 84   (TBT 4 ms → 643 ms)
 *   JS transferido                  +273 KB gzip (1 106 KB crudo)
 *   fps con GPU real, 1×            60   (hilo principal 3%)
 *   fps con CPU 4×                  36   (hilo principal 94%)
 *
 * El 84 queda por DEBAJO del «94 Lighthouse móvil, como mínimo» que la home
 * publica en `content/casos.ts`. Antes de publicar hay que resolver esa
 * contradicción: o sube el número, o cambia la métrica del caso.
 *
 * Abajo del pliegue el arranque no se movía (100, TBT 34 ms). Si algún día
 * hay que recuperar el número, mover esto es la palanca.
 *
 * Dos cosas que la librería NO trae y se cablean aquí:
 * - No lee design tokens: los colores acaban en uniforms de WebGL y solo
 *   acepta hex. Se leen de `globals.css` en runtime para no romper la regla 1.
 * - No sabe de `prefers-reduced-motion`. La guarda de la regla 5 es `animate`.
 */

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false },
);

const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false },
);

/**
 * Los dos hooks van con `useSyncExternalStore` y no con `useState` +
 * `useEffect`: leen estado que vive FUERA de React —la hoja de estilos y una
 * media query— y escribir ese estado desde un efecto dispara un render extra
 * y lo marca `react-hooks/set-state-in-effect`.
 *
 * El snapshot del servidor es `null`/`false`, así que el primer render en
 * cliente coincide con el del servidor y no hay desajuste de hidratación.
 */

// El snapshot tiene que ser referencialmente estable o `useSyncExternalStore`
// entra en bucle. Los tokens no cambian en toda la vida de la página.
let tokensCache: [string, string, string] | null = null;
const sinSuscripcion = () => () => {};

function useTokens() {
  return useSyncExternalStore(
    sinSuscripcion,
    () => {
      tokensCache ??= (() => {
        const estilo = getComputedStyle(document.documentElement);
        const leer = (n: string) => estilo.getPropertyValue(n).trim();
        return [leer("--cream"), leer("--gold"), leer("--coral")] as [
          string,
          string,
          string,
        ];
      })();
      return tokensCache;
    },
    () => null,
  );
}

function useReduccionMovimiento() {
  return useSyncExternalStore(
    (avisar) => {
      const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
      consulta.addEventListener("change", avisar);
      return () => consulta.removeEventListener("change", avisar);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function FondoShader() {
  const tokens = useTokens();
  const reducido = useReduccionMovimiento();

  if (!tokens) return null;
  const [color1, color2, color3] = tokens;

  return (
    // `-z-20` para quedar DEBAJO del grano de papel, que es `-z-10` y fijo en
    // el layout: el grano es lo que rompe el bandeo del gradiente.
    <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
      <ShaderGradientCanvas
        style={{ width: "100%", height: "100%" }}
        // Por defecto es 1, no `devicePixelRatio`. En un móvil 3× eso es
        // 1/9 de los píxeles, y es la razón de que esto no sea aún más caro.
        pixelDensity={1}
        fov={45}
        pointerEvents="none"
      >
        <ShaderGradient
          control="props"
          type="waterPlane"
          animate={reducido ? "off" : "on"}
          color1={color1}
          color2={color2}
          color3={color3}
          uSpeed={0.1}
          uStrength={1.5}
          uDensity={1.2}
          uFrequency={5.5}
          uAmplitude={0}
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={50}
          rotationY={0}
          rotationZ={-60}
          cAzimuthAngle={180}
          cPolarAngle={80}
          cDistance={2.8}
          cameraZoom={9.1}
          lightType="3d"
          brightness={1.2}
          reflection={0.1}
          // El sitio ya tiene su grano, medido contra AA en `ui/Grano.tsx`.
          grain="off"
        />
      </ShaderGradientCanvas>
    </div>
  );
}
