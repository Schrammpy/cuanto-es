
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precio de Fletes y Mudanzas en Paraguay 2026",
  description:
    "¿Cuánto cuesta un flete o mudanza en Paraguay? Consultá precios en Asunción y Gran Asunción y calculá el costo según distancia, carga y ayudantes.",
  alternates: {
    canonical: "https://www.cuantoes.com.py/costos/fletes",
  },
  openGraph: {
    title: "Precios de Fletes y Mudanzas en Paraguay 2026 | CuantoEs",
    description:
      "Consultá cuánto cuesta un flete, una mudanza o un traslado de muebles en Paraguay. Calculadora de precios en guaraníes.",
    url: "https://www.cuantoes.com.py/costos/fletes",
    type: "website",
    locale: "es_PY",
  },
};

export default function FletesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
