
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instalación de Aire Acondicionado en Paraguay 2026",
  description:
    "¿Cuánto cuesta instalar o limpiar un aire acondicionado en Paraguay? Consultá precios de instalación de split, mantenimiento y reparaciones. Calculá en Gs.",
  alternates: {
    canonical: "https://www.cuantoes.com.py/costos/aire",
  },
  openGraph: {
    title: "Precios de Aire Acondicionado en Paraguay 2026 | CuantoEs",
    description:
      "Consultá precios de instalación de split de 12.000, 18.000 y 24.000 BTU, limpieza, mantenimiento y reparaciones en Paraguay.",
    url: "https://www.cuantoes.com.py/costos/aire",
    type: "website",
    locale: "es_PY",
  },
};

export default function AireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
