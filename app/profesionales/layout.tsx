import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Profesionales - Uníte a CuantoEs.com.py",
  description: "Registrá tu negocio y recibí solicitudes de presupuesto de clientes en Paraguay que ya conocen los costos del mercado.",
};

export default function ProfesionalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}