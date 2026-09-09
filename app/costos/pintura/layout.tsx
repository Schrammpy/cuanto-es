import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta pintar una casa en Paraguay? - Precios 2026",
  description: "Calculá el costo por m2 de mano de obra y materiales para pintura interior y exterior. Precios actualizados para Paraguay.",
  keywords: ["precio pintura m2 paraguay", "cuanto cuesta pintar casa asuncion", "mano de obra pintura paraguay"]
};

export default function PinturaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}