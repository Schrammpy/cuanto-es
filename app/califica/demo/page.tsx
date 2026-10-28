import type { Metadata } from "next";
import DemoExperience from "./DemoExperience";

const demoUrl = "https://www.cuantoes.com.py/califica/demo";

export const metadata: Metadata = {
  title: "Demo interactiva | CuantoEs Califica",
  description:
    "Prob\u00e1 c\u00f3mo un cliente califica un pedido y mir\u00e1 c\u00f3mo el comercio recibe sus opiniones privadas. Demostraci\u00f3n sin registro.",
  alternates: { canonical: demoUrl },
  robots: { index: false, follow: true },
  openGraph: {
    title: "CuantoEs Califica | Prob\u00e1 la demo para tu comercio",
    description:
      "Un cliente califica su pedido. Tu negocio ve qu\u00e9 puede mejorar. Prob\u00e1 la demostraci\u00f3n interactiva.",
    url: demoUrl,
    siteName: "CuantoEs Califica",
    locale: "es_PY",
    type: "website",
    images: [
      {
        url: "https://www.cuantoes.com.py/califica/demo-og.png",
        width: 1200,
        height: 630,
        alt: "CuantoEs Califica: demostraci\u00f3n para pizzer\u00edas y comercios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prob\u00e1 CuantoEs Califica",
    description: "Tu cliente califica. Vos descubr\u00eds qu\u00e9 mejorar.",
    images: ["https://www.cuantoes.com.py/califica/demo-og.png"],
  },
};

export default function CalificaDemoPage() {
  // Mismo canal comercial de la landing; nunca guardar el numero en codigo.
  const phone = (process.env.CALIFICA_VENTAS_WHATSAPP ?? "").replace(/\D/g, "");
  const whatsappEnabled = /^595\d{8,10}$/.test(phone);
  const message =
    "Hola, prob\u00e9 la demo de CuantoEs Califica y quiero conocer la prueba gratuita de 15 d\u00edas para mi comercio.";
  const contactHref = whatsappEnabled
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : "/califica#contacto";

  return (
    <DemoExperience
      contactHref={contactHref}
      whatsappEnabled={whatsappEnabled}
    />
  );
}
