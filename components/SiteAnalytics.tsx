"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

// Identificador existente de CuantoEs (NO crear una propiedad nueva para este paso).
const GA_ID = "G-VNDCH7QL6Q";

function isCalificaPath(pathname: string): boolean {
  return (
    pathname === "/califica" ||
    pathname.startsWith("/califica/") ||
    pathname === "/admin/califica" ||
    pathname.startsWith("/admin/califica/")
  );
}

type GaWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __cuantoEsGaInitialized?: boolean;
  "ga-disable-G-VNDCH7QL6Q"?: boolean;
};

export default function SiteAnalytics() {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);
  const excluded = isCalificaPath(pathname ?? "");

  useEffect(() => {
    const w = window as GaWindow;
    // Impide envios adicionales de la etiqueta cuando se navega hacia Califica.
    // Google Analytics requiere, ademas, desactivar los pageviews por cambios
    // de historial en Administrar > Flujos de datos > Medicion mejorada.
    w["ga-disable-G-VNDCH7QL6Q"] = excluded;

    if (excluded) {
      trackedPath.current = null;
      return;
    }

    w.dataLayer = w.dataLayer || [];
    if (!w.gtag) {
      w.gtag = (...args: unknown[]) => {
        w.dataLayer?.push(args);
      };
    }

    if (!w.__cuantoEsGaInitialized) {
      w.gtag("js", new Date());
      // El page_view automatico se deshabilita para controlar las rutas.
      w.gtag("config", GA_ID, { send_page_view: false });
      w.__cuantoEsGaInitialized = true;
    }

    // Una vista por cambio real de ruta. No registra paginas de Califica.
    // Mantiene los parametros de campana de la URL en la pagina de destino.
    const currentUrl = window.location.href.split("#")[0];
    if (trackedPath.current === currentUrl) return;
    trackedPath.current = currentUrl;

    w.gtag("event", "page_view", {
      send_to: GA_ID,
      page_location: currentUrl,
      page_title: document.title,
    });
  }, [excluded, pathname]);

  return (
    <>
      {/* La etiqueta NO se carga si alguien llega directamente a Califica. */}
      {!excluded && (
        <Script
          id="cuantoes-ga4-script"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
      )}

      <Analytics
        beforeSend={(event) => {
          try {
            const path = new URL(event.url, "https://www.cuantoes.com.py").pathname;
            return isCalificaPath(path) ? null : event;
          } catch {
            // Ante una URL no interpretable, no enviar datos ambiguos.
            return null;
          }
        }}
      />
    </>
  );
}
