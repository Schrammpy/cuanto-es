import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta el mantenimiento de un auto en Paraguay? Precios 2026 | CuantoEs",
  description: "Calculá el precio estimado de cambio de aceite, filtros, alineación, balanceo y frenos para tu vehículo en Paraguay.",
  keywords: ["cambio de aceite precio paraguay", "cuanto cuesta alineacion y balanceo", "mantenimiento auto asuncion", "precio pastillas de freno mano de obra"]
};

export default function AutomotorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}