
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precio de mano de obra de albañilería en Paraguay 2026",
  description:
    "Consultá cuánto cuesta levantar una muralla, hacer revoques y contrapisos en Paraguay. Precios por m² y metro lineal, con calculadora en guaraníes.",
  alternates: {
    canonical: "https://www.cuantoes.com.py/costos/albanileria",
  },
  openGraph: {
    title: "Precios de albañilería en Paraguay 2026 | CuantoEs",
    description:
      "Costos de mano de obra y materiales para murallas, revoques y contrapisos. Calculá tu presupuesto en guaraníes.",
    url: "https://www.cuantoes.com.py/costos/albanileria",
    type: "website",
    locale: "es_PY",
  },
};

export default function AlbanileriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
