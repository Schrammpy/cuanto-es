import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import SiteAnalytics from "@/components/SiteAnalytics";

export const metadata: Metadata = {
  // Dominio base oficial del sitio
  metadataBase: new URL("https://www.cuantoes.com.py"),

  // Nombre de la aplicacion/sitio
  applicationName: "CuantoEs.com.py",
  // Titulo global + preparado para titulos individuales por categoria
  title: {
    default: "Precios de Servicios en Paraguay | CuantoEs.com.py",
    template: "%s | CuantoEs.com.py",
  },

  // Descripcion general del sitio original (sin cambios)
  description:
    "Consultá precios de referencia y calculá costos de servicios en Paraguay: pintura, aire acondicionado, plomería, electricidad, fumigación, reparaciones y más.",
  creator: "CuantoEs.com.py",
  publisher: "CuantoEs.com.py",

  openGraph: {
    title: "Precios de Servicios en Paraguay | CuantoEs.com.py",
    description:
      "Consultá precios de referencia y calculá costos de servicios en Paraguay: pintura, aire acondicionado, plomería, electricidad, fumigación, reparaciones y más.",
    siteName: "CuantoEs.com.py",
    locale: "es_PY",
    type: "website",
  },
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
  // Verificacion de Google Search Console original (sin cambios)
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
        <ConditionalNavbar />
        {children}
        {/* Solo se miden las paginas del sitio CuantoEs, no Califica. */}
        <SiteAnalytics />
      </body>
    </html>
  );
}
