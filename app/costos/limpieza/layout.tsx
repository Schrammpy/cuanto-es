import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta un servicio de limpieza en Paraguay? - Precios Actualizados",
  description: "Tarifas de limpieza doméstica por jornada, cuadrillas de fin de obra y lavado de tapizados en Asunción y Gran Asunción.",
  keywords: ["cuanto cuesta empleada por dia paraguay", "limpieza post obra precio paraguay", "precio limpieza fin de obra asuncion", "lavado de tapizados costo"]
};

export default function LimpiezaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}