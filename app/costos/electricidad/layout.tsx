import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cobra un electricista en Paraguay? - Precios 2026",
  description: "Costos de referencia de electricistas matriculados y particulares. Precios por boca, cambio de disyuntor, tableros y cortocircuitos en Asunción y Central.",
  keywords: ["cuanto cobra un electricista por boca paraguay", "precio instalacion electrica casa paraguay", "electricista asuncion costo", "cambio de tablero electrico precio"]
};

export default function ElectricidadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}