import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto cobra un albañil por metro en Paraguay? - Precios 2026",
  description: "Precios de mano de obra para murallas, revoque, contrapiso y colocación de pisos por m2 y metro lineal en Gran Asunción.",
  keywords: ["cuanto cuesta levantar muralla paraguay", "precio revoque m2 paraguay", "cuanto cobra un albanil por dia paraguay", "costo contrapiso mano de obra"]
};

export default function AlbanileriaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}