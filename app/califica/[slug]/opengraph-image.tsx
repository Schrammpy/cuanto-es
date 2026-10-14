
import { ImageResponse } from "next/og";
import { getCalificaBusiness } from "@/lib/califica";

// ============================================================
// CUANTOES CALIFICA - OPEN GRAPH OPTIMIZADO
//
// - Imagen personalizada para cada comercio
// - Logo grande desde Supabase Storage
// - Nombre del comercio destacado
// - Diseno optimizado para miniaturas de WhatsApp
// ============================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const alt = "Calificá tu experiencia";
export const contentType = "image/png";

export const size = {
  width: 1200,
  height: 630,
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// ============================================================
// DESCARGAR LOGO DESDE SUPABASE STORAGE
// ============================================================

async function getBusinessLogo(
  logoUrl: string | null
): Promise<string | null> {
  if (!logoUrl) return null;

  try {
    const url = new URL(logoUrl);

    // Solo aceptar imagenes publicas de nuestro Supabase.
    if (
      url.protocol !== "https:" ||
      url.hostname !== "ysrdherlhfzjgvbovmrp.supabase.co" ||
      !url.pathname.startsWith("/storage/v1/object/public/")
    ) {
      return null;
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(
        "Califica OG - Error al descargar logo:",
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

    const buffer = await response.arrayBuffer();

    if (
      buffer.byteLength === 0 ||
      buffer.byteLength > 2 * 1024 * 1024
    ) {
      return null;
    }

    return (
      `data:${imageType};base64,` +
      Buffer.from(buffer).toString("base64")
    );
  } catch (error) {
    console.error("Califica OG - Logo:", error);
    return null;
  }
}

// ============================================================
// GENERAR IMAGEN PERSONALIZADA
// ============================================================

export default async function OpenGraphImage({
  params,
}: Props) {
  const { slug } = await params;

  const business = await getCalificaBusiness(slug);

  const name = business?.name || "CuantoEs Califica";

  const logo = await getBusinessLogo(
    business?.logo_url ?? null
  );

  const fontSize =
    name.length > 45
      ? 48
      : name.length > 28
        ? 60
        : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          position: "relative",
          padding: 45,
        }}
      >
        {/* TARJETA CENTRAL */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: "#111c32",
            border: "2px solid #263550",
            borderRadius: 36,
            padding: 30,
          }}
        >
          {/* LOGO DEL COMERCIO */}
          <div
            style={{
              width: 310,
              height: 310,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              borderRadius: 36,
              padding: 14,
              overflow: "hidden",
            }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                width={282}
                height={282}
                style={{
                  width: 282,
                  height: 282,
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                  fontSize: 185,
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
              marginTop: 25,
              maxWidth: 1030,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize,
              fontWeight: 700,
              lineHeight: 1.1,
              overflowWrap: "anywhere",
            }}
          >
            {name}
          </div>

          {/* IDENTIDAD DISCRETA */}
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 22,
              color: "#94a3b8",
            }}
          >
            CuantoEs Califica
          </div>
        </div>
      </div>
    ),
    size
  );
}
