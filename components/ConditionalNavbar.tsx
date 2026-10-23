"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const isCalifica =
    pathname === "/califica" ||
    pathname.startsWith("/califica/") ||
    pathname === "/admin/califica" ||
    pathname.startsWith("/admin/califica/");

  if (isCalifica) return null;

  // Conservar intacta la navegación del resto de CuantoEs.
  return <Navbar />;
}
