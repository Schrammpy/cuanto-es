import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta reparar un electrodoméstico en Paraguay? - Precios 2026",
  description: "Calculá el precio estimado de reparación para heladeras, lavarropas, microondas y televisores (TV) en Asunción y Gran Asunción.",
  keywords: ["reparacion heladera precio paraguay", "cuanto cuesta arreglar lavarropas", "servicio tecnico tv asuncion", "cambio de gas heladera precio"]
};

export default function ElectroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}