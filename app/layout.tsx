import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export const metadata: Metadata = {
  title: "CuantoEs.com.py — Cuentas Claras en Paraguay",
  description: "Calculá la vaca del asado, el fútbol o la cena y pasá los datos de transferencia rápido por WhatsApp.",

  verification: {
    google: "hHy60sdyIMfmiO5K5wUbbn5O00mvM8vCN6lBbkkFX7o", // Solo el texto que está dentro de content="..."
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {/* GOOGLE ANALYTICS */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-VNDCH7QL6Q`} // <--- TU ID AQUÍ
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VNDCH7QL6Q'); // <--- TU ID AQUÍ
          `}
        </Script>

        {children}
        <Analytics />
      </body>
    </html>
  );
}