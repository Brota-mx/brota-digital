import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Sin `globalIgnores`: el bloque que traía el scaffold reenumeraba exactamente
// los ignores que `eslint-config-next` ya trae por defecto (.next, out, build,
// next-env.d.ts). Un "override" que repite lo que sobrescribe es ruido.
const eslintConfig = defineConfig([...nextVitals, ...nextTs]);

export default eslintConfig;
