
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto es la multa? - Costos de Infracciones Paraguay 2026",
  description: "Calculadora de multas de tránsito en Paraguay. Convertí jornales a guaraníes de la Caminera y Municipalidad.",
};

export default function MultasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}