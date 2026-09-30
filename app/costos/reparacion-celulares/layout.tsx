import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cuesta reparar un celular en Paraguay? - Precios 2026",
  description: "Consultá precios de referencia para cambio de pantalla, batería, pin de carga o equipos mojados de iPhone, Samsung, Xiaomi y más.",
  keywords: ["reparacion celular precio paraguay", "cuanto cuesta cambiar pantalla iphone", "cambio pin de carga samsung precio", "arreglar celular mojado asuncion"]
};

export default function CelularesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}