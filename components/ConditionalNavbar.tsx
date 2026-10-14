
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Ocultar el encabezado en todas las rutas de Califica.
  const isCalifica =
    pathname === "/califica" ||
    pathname.startsWith("/califica/");

  if (isCalifica) {
    return null;
  }

  // Mantener el encabezado original en CuantoEs.
  return <Navbar />;
}
