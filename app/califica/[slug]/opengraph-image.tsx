
import { ImageResponse } from "next/og";
import { getCalificaBusiness } from "@/lib/califica";

export const runtime = "nodejs";

export const alt = "CuantoEs Califica - Calificá tu experiencia";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OpenGraphImage({
  params,
}: Props) {
  const { slug } = await params;

  const business = await getCalificaBusiness(slug);

  const businessName = business?.name || "CuantoEs Califica";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: 65,
        }}
      >
        {/* ICONO */}
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 28,
            backgroundColor: "#352625",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 66,
            color: "#f59e0b",
          }}
        >
          ★
        </div>

        {/* NOMBRE DEL COMERCIO */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: businessName.length > 32 ? 48 : 62,
            fontWeight: 700,
            textAlign: "center",
            justifyContent: "center",
            maxWidth: 1050,
          }}
        >
          {businessName}
        </div>

        {/* MENSAJE PRINCIPAL */}
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 37,
            color: "#e2e8f0",
          }}
        >
          ¿Cómo estuvo tu pedido?
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 28,
            color: "#fbbf24",
          }}
        >
          Contanos tu experiencia
        </div>

        {/* IDENTIDAD CUANTOES */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          CuantoEs Califica
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
