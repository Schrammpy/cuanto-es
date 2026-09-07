import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta un asado a domicilio en Paraguay? - Precios 2026",
  description: "Presupuestá tu asado por persona con parrillero profesional y guarniciones incluidas.",
};

export default function AsadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}