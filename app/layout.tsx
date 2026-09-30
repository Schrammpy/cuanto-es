import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  // Dominio base oficial del sitio
  metadataBase: new URL("https://www.cuantoes.com.py"),

  // Nombre de la aplicación/sitio
  applicationName: "CuantoEs.com.py",

  // Título global + preparado para títulos individuales por categoría
  title: {
    default: "Precios de Servicios en Paraguay | CuantoEs.com.py",
    template: "%s | CuantoEs.com.py",
  },

  // Descripción general actualizada al objetivo real del sitio
  description:
    "Consultá precios de referencia y calculá costos de servicios en Paraguay: pintura, aire acondicionado, plomería, electricidad, fumigación, reparaciones y más.",

  // Información general del proyecto
  creator: "CuantoEs.com.py",
  publisher: "CuantoEs.com.py",

  // Open Graph: WhatsApp, Facebook, LinkedIn, etc.
  openGraph: {
    title: "Precios de Servicios en Paraguay | CuantoEs.com.py",
    description:
      "Consultá precios de referencia y calculá costos de servicios en Paraguay: pintura, aire acondicionado, plomería, electricidad, fumigación, reparaciones y más.",
    siteName: "CuantoEs.com.py",
    locale: "es_PY",
    type: "website",
  },

  // Permitimos indexación y previews amplios en Google
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Verificación existente de Google Search Console
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
    <html lang="es-PY">
      <body className="antialiased bg-[#F8FAFC]">
        {/* GOOGLE ANALYTICS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VNDCH7QL6Q"
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

        <Navbar />

        {children}

        <Analytics />
      </body>
    </html>
  );
}