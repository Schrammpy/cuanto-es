import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dividir Gastos - CuantoEs.com.py",
  description: "Calculá la cuenta para el asado, el fútbol o cualquier gasto compartido.",
};

export default function DivisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}