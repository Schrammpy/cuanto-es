import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta una mudanza o flete en Paraguay? - Precios 2026",
  description: "Calculá el costo de tu flete o mudanza según el camión y la distancia en Gran Asunción.",
};

export default function FletesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}