
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precio de Pintura por m² en Paraguay 2026",
  description:
    "¿Cuánto cuesta pintar una casa en Paraguay? Consultá precios de mano de obra por m², pintura interior y exterior. Calculá materiales y presupuesto en guaraníes.",
  alternates: {
    canonical: "https://www.cuantoes.com.py/costos/pintura",
  },
  openGraph: {
    title: "Precios de Pintura en Paraguay 2026 | CuantoEs",
    description:
      "Conocé los costos de pintura interior y exterior por metro cuadrado y calculá tu presupuesto en guaraníes.",
    url: "https://www.cuantoes.com.py/costos/pintura",
    type: "website",
    locale: "es_PY",
  },
};

export default function PinturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
