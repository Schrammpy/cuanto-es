
import { ImageResponse } from "next/og";
import { getCalificaBusiness } from "@/lib/califica";

// ============================================================
// CUANTOES CALIFICA - OPEN GRAPH DINAMICO
// Una imagen personalizada para cada comercio.
// Logo obtenido desde Supabase Storage.
// ============================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const alt = "Calificá tu experiencia con este comercio";

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

// ============================================================
// OBTENER LOGO DEL COMERCIO
// ============================================================

async function getBusinessLogo(
  logoUrl: string | null
): Promise<string | null> {
  if (!logoUrl) return null;

  try {
    const url = new URL(logoUrl);

    // Solo admitimos archivos publicos de nuestro
    // proyecto Supabase Storage.
    if (
      url.protocol !== "https:" ||
      url.hostname !== "ysrdherlhfzjgvbovmrp.supabase.co" ||
      !url.pathname.startsWith("/storage/v1/object/public/")
    ) {
      return null;
    }

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Califica OG - No se pudo descargar el logo:",
        response.status
      );
      return null;
    }

    const imageType = response.headers
      .get("content-type")
      ?.split(";")[0]
      ?.trim()
      .toLowerCase();

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!imageType || !allowedTypes.includes(imageType)) {
      return null;
    }

    const contentLength = Number(
      response.headers.get("content-length") || 0
    );

    // Evitar descargar logos demasiado grandes.
    if (contentLength > 2 * 1024 * 1024) {
      return null;
    }

    const buffer = await response.arrayBuffer();

    if (
      buffer.byteLength === 0 ||
      buffer.byteLength > 2 * 1024 * 1024
    ) {
      return null;
    }

    const base64 = Buffer.from(buffer).toString("base64");

    return `data:${imageType};base64,${base64}`;
  } catch (error) {
    console.error("Califica OG - Error de logo:", error);
    return null;
  }
}

// ============================================================
// GENERAR IMAGEN OPEN GRAPH POR COMERCIO
// ============================================================

export default async function OpenGraphImage({
  params,
}: Props) {
  const { slug } = await params;

  const business = await getCalificaBusiness(slug);

  const businessName =
    business?.name || "CuantoEs Califica";

  const logo = business
    ? await getBusinessLogo(business.logo_url)
    : null;

  const nameFontSize =
    businessName.length > 45
      ? 42
      : businessName.length > 30
        ? 50
        : 62;

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
          padding: "45px 65px",
          position: "relative",
        }}
      >
        {/* LOGO DEL COMERCIO */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 28,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: 12,
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=""
              width={136}
              height={136}
              style={{
                width: 136,
                height: 136,
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                fontSize: 90,
                color: "#f59e0b",
              }}
            >
              ★
            </div>
          )}
        </div>

        {/* NOMBRE DEL COMERCIO */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            maxWidth: 1060,
            fontSize: nameFontSize,
            fontWeight: 700,
            textAlign: "center",
            justifyContent: "center",
            lineHeight: 1.2,
            overflowWrap: "anywhere",
          }}
        >
          {businessName}
        </div>

        {/* INVITACION A CALIFICAR */}
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 36,
            color: "#e2e8f0",
            textAlign: "center",
          }}
        >
          ¿Cómo estuvo tu pedido?
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 27,
            color: "#fbbf24",
            textAlign: "center",
          }}
        >
          Tu opinión nos ayuda a mejorar
        </div>

        {/* IDENTIDAD DISCRETA DE CUANTOES */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 22,
            fontSize: 20,
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
