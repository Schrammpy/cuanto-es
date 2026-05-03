import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Presupuesto - CuantoEs.com.py",
  description: "Herramienta para que trabajadores de oficio envíen presupuestos profesionales por WhatsApp.",
};

export default function PresupuestoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}