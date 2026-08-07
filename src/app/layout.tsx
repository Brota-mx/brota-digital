import type { Metadata } from "next";
import "./globals.css";

// Metadata base completa (plantilla de título, canonical, OG, JSON-LD
// Organization) y las fuentes self-hosted entran en el paso 3 del blueprint.
export const metadata: Metadata = {
  title: "Brota Digital",
  description:
    "Agencia mexicana de marketing digital, desarrollo web y sistemas de automatización.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
