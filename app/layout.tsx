import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import Navbar from "@/components/Navbar"; // 1. Importamos el Navbar

export const metadata: Metadata = {
  title: "CuantoEs.com.py — Cuentas Claras en Paraguay",
  description: "Calculá los gastos del asado, el fútbol o la cena. Consultá multas de tránsito y beneficios bancarios en un solo lugar.",
  openGraph: {
    title: "CuantoEs.com.py — Cuentas Claras",
    description: "La herramienta paraguaya para dividir gastos y consultar multas.",
    url: 'https://cuantoes.com.py',
    siteName: 'CuantoEs.py',
    locale: 'es_PY',
    type: 'website',
  },
  // Tu código de verificación de Google que ya tenés...
  verification: {
    google: "hHy60sdyIMfmiO5K5wUbbn5O00mvM8vCN6lBbkkFX7o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#F8FAFC]">
        {/* GOOGLE ANALYTICS */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-VNDCH7QL6Q`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VNDCH7QL6Q');
          `}
        </Script>

        {/* 2. EL NAVBAR APARECE AQUÍ (Arriba de todo) */}
        <Navbar />

        {/* 3. El contenido de cada página (page.tsx) se carga aquí */}
        {children}
        
        <Analytics />
      </body>
    </html>
  );
}