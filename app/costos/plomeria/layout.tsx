
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precio de Plomería en Paraguay 2026",
  description:
    "¿Cuánto cobra un plomero en Paraguay? Consultá precios de destranques, grifería, termocalefones y fugas de agua. Calculá la mano de obra en guaraníes.",
  alternates: {
    canonical: "https://www.cuantoes.com.py/costos/plomeria",
  },
  openGraph: {
    title: "Precios de Plomería en Paraguay 2026 | CuantoEs",
    description:
      "Conocé los costos de mano de obra para destranques, grifería, termocalefones y reparación de fugas de agua en Paraguay.",
    url: "https://www.cuantoes.com.py/costos/plomeria",
    type: "website",
    locale: "es_PY",
  },
};

export default function PlomeriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
