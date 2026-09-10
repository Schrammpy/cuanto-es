import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodología de Precios - CuantoEs.com.py",
  description: "Cómo calculamos los precios de referencia en Paraguay. Conoce nuestras fuentes de datos, validación de presupuestos y reportes comunitarios.",
};

export default function MetodologiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}