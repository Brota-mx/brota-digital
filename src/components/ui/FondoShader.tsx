"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/**
 * Gradiente animado del hero (WebGL, `@shadergradient/react`).
 *
 * ⚠️ ES LA ÚNICA DEPENDENCIA PESADA DEL SITIO Y ESTÁ ARRIBA DEL PLIEGUE.
 * Decisión tomada con los números sobre la mesa. Lighthouse móvil de la HOME
 * real, contra el build de producción:
 *
 *                        con shader   con shader    solo
 *                        (sin dif.)   (diferido)    .malla-hero
 *   Rendimiento              58           65            96
 *   LCP                     4.4 s        3.1 s         2.7 s
 *   TBT                    1 760 ms     1 940 ms      110 ms
 *   Interactivo             6.4 s        6.6 s         2.8 s
 *
 * Accesibilidad, buenas prácticas y SEO: 100 en las tres.
 *
 * ⚠️ EL PRECIO DEL EFECTO SON 31 PUNTOS Y 3.8 s DE INTERACTIVIDAD, y no hay
 * ajuste que lo baje. El costo es la **evaluación del módulo de three.js**:
 * 3 013 ms de CPU, contra ~500 ms de todo el resto del sitio junto. No es
 * compilar shaders ni construir geometría, así que ni `pixelDensity`, ni el
 * tipo de malla, ni la velocidad lo mueven. La única palanca real sería no
 * cargar three.js.
 *
 * ⚠️ Y NO ERA EL SCROLL. Medido a 375px con la CPU 4× y GPU real, un barrido
 * completo da 59-60 fps con shader, sin shader, con `backdrop-filter` y sin
 * él. Quien busque el lag en el scroll no lo va a encontrar.
 *
 * ⚠️ Estos números son de la home real. Una página de pruebas con solo el hero
 * daba 84: el costo del shader se SUMA al resto de la página, no lo sustituye.
 * Medir el efecto aislado lo subestima.
 *
 * El 65 sigue por DEBAJO del «94 Lighthouse móvil, como mínimo» que la home
 * publica en `content/casos.ts` como métrica verificable de un caso. Antes de
 * publicar hay que resolver esa contradicción: o sube el número, o cambia la
 * métrica.
 *
 * Abajo del pliegue el arranque no se movía (100, TBT 34 ms). Si algún día hay
 * que recuperar el número, mover esto es la palanca.
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

/* ── El diferido ───────────────────────────────────────────────────────────
   Sin esto, `next/dynamic` pide y evalúa el chunk durante la hidratación: o
   sea peleando por el hilo principal justo cuando la página intenta volverse
   interactiva. Medido en la home, ese chunk se lleva **3 013 ms de CPU** y
   deja el «tiempo hasta interactivo» en 6.4 s; todo el resto del sitio suma
   ~500 ms. No era el scroll —el barrido va a 59 fps con o sin shader—, era
   esto.

   Aquí se espera a `load` y después a un hueco de inactividad. El trabajo es
   el mismo; lo que cambia es que ya no compite con nada. Debajo queda
   `.malla-hero`, un gradiente CSS estático con los mismos tokens, así que el
   hueco no se ve: el hero nunca aparece en crema plano.

   El estado vive fuera de React porque es un evento del navegador y una sola
   transición, y porque `useState` + `useEffect` aquí es justo lo que marca
   `react-hooks/set-state-in-effect`. */
let arrancado = false;
const oyentes = new Set<() => void>();

function programarArranque() {
  const arrancar = () => {
    arrancado = true;
    oyentes.forEach((avisar) => avisar());
  };

  const enHueco = () => {
    // `typeof ... === "function"` y no `"requestIdleCallback" in window`:
    // con el `in`, TypeScript estrecha `window` a `never` en el `else` y el
    // `setTimeout` del respaldo deja de compilar.
    //
    // El `timeout` es el techo: si el hilo no se queda quieto nunca, entra
    // igual a los 2.5 s en vez de no entrar jamás.
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(arrancar, { timeout: 2500 });
    } else {
      window.setTimeout(arrancar, 300);
    }
  };

  if (document.readyState === "complete") enHueco();
  else window.addEventListener("load", enHueco, { once: true });
}

function useArrancado() {
  return useSyncExternalStore(
    (avisar) => {
      oyentes.add(avisar);
      if (!arrancado && oyentes.size === 1) programarArranque();
      return () => {
        oyentes.delete(avisar);
      };
    },
    () => arrancado,
    () => false,
  );
}

export function FondoShader() {
  const tokens = useTokens();
  const reducido = useReduccionMovimiento();
  const arrancado = useArrancado();

  return (
    // `-z-20` para quedar DEBAJO del grano de papel, que es `-z-10` y fijo en
    // el layout: el grano es lo que rompe el bandeo del gradiente.
    //
    // `.malla-hero` va SIEMPRE, también bajo el canvas. Es lo que se ve desde
    // el primer fotograma —el servidor ya lo manda pintado, sin JavaScript de
    // por medio— y lo que sigue habiendo si WebGL falla o no existe. El shader
    // se limita a aparecer encima cuando el hilo principal está libre.
    <div
      aria-hidden="true"
      className="malla-hero absolute inset-0 -z-20 overflow-hidden"
    >
      {arrancado && tokens ? (
        <FondoShaderCanvas tokens={tokens} animar={reducido ? "off" : "on"} />
      ) : null}
    </div>
  );
}

function FondoShaderCanvas({
  tokens,
  animar,
}: {
  tokens: [string, string, string];
  animar: "on" | "off";
}) {
  const [color1, color2, color3] = tokens;

  return (
    <div className="h-full w-full">
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
          animate={animar}
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
