import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta instalar un aire en Paraguay? - Precios 2026",
  description: "Calculá el presupuesto para instalación o mantenimiento de aires acondicionados (BTU) en Paraguay.",
};

export default function AireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}