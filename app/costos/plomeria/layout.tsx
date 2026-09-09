import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cobra un plomero en Paraguay? - Precios Actualizados",
  description: "Precios de referencia para destranques, cambio de grifería, instalación de termocalefón y reparación de pérdidas de agua en Asunción y Central.",
  keywords: ["cuanto cobra un plomero paraguay", "precio plomero asuncion", "destranque de cañerias precio paraguay", "instalacion termocalefon costo"]
};

export default function PlomeriaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}