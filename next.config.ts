import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cada fase de UI cierra con capturas de evidencia a docs/qa/, y el
  // indicador de dev se cuela en todas. Los errores de compilación se siguen
  // mostrando; esto solo apaga la insignia flotante.
  devIndicators: false,
};

export default nextConfig;
