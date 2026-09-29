import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta fumigar una casa en Paraguay? - Precios 2026",
  description: "Consultá los precios de referencia para fumigación de hogares, oficinas y depósitos en Asunción y Central.",
  keywords: ["precio fumigacion paraguay", "cuanto cuesta fumigar casa", "costo control de plagas paraguay"]
};

export default function FumigacionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}