
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precio de mano de obra eléctrica en Paraguay 2026",
  description:
    "¿Cuánto cobra un electricista en Paraguay? Consultá precios por boca, tomacorrientes, tableros y reparaciones. Calculá tu presupuesto en guaraníes.",
  alternates: {
    canonical: "https://www.cuantoes.com.py/costos/electricidad",
  },
  openGraph: {
    title: "Precios de electricidad en Paraguay 2026 | CuantoEs",
    description:
      "Consultá costos referenciales de trabajos eléctricos y calculá tu presupuesto.",
    url: "https://www.cuantoes.com.py/costos/electricidad",
    type: "article",
    locale: "es_PY",
  },
};

export default function ElectricidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
