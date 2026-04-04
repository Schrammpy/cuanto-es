import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; // 1. Importamos esto

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CuantoEs.com.py — Cuentas Claras",
  description: "Calculá la carne del asado, el gasto del cumpleaños o la cena de amigos y pasá el resumen rápido por WhatsApp.",
  icons: {
    icon: "icon.svg", // Asegurate de tener un favicon luego
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <Analytics /> {/* 2. Lo agregamos aquí antes de cerrar el body */}
      </body>
    </html>
  );
}