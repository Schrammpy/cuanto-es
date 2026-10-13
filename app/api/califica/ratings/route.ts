
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RatingRequest = {
  slug?: unknown;
  rating?: unknown;
  comment?: unknown;
  contactRequested?: unknown;
  customerPhone?: unknown;
};

function response(
  message: string,
  status: number
) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > 10000) {
      return response("Solicitud demasiado grande", 413);
    }

    const body: RatingRequest = await request.json();

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    const rating = body.rating;

    const comment =
      typeof body.comment === "string"
        ? body.comment.trim()
        : "";

    const contactRequested =
      body.contactRequested === true;

    const customerPhone =
      typeof body.customerPhone === "string"
        ? body.customerPhone.trim()
        : "";

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return response("Comercio no válido", 400);
    }

    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return response("Seleccioná de 1 a 5 estrellas", 400);
    }

    if (comment.length > 2000) {
      return response("El comentario es demasiado largo", 400);
    }

    if (rating <= 3 && !comment) {
      return response(
        "Contanos qué pasó antes de enviar",
        400
      );
    }

    if (
      contactRequested &&
      !/^\+?[0-9 ()-]{6,25}$/.test(customerPhone)
    ) {
      return response(
        "Ingresá un número de contacto válido",
        400
      );
    }

    // Identificador seudónimo para limitar envíos.
    // No es una verificación de compra.
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const userAgent =
      request.headers.get("user-agent") || "unknown";

    const visitorHash = createHash("sha256")
      .update(`${ip}|${userAgent}|califica-v1`)
      .digest("hex");

    const { data, error } = await supabase.rpc(
      "califica_submit_rating",
      {
        p_slug: slug,
        p_rating: rating,
        p_comment: comment || null,
        p_contact_requested: contactRequested,
        p_customer_phone: contactRequested
          ? customerPhone
          : null,
        p_visitor_hash: visitorHash,
      }
    );

    if (error) {
      console.error("Califica - Registro:", {
        code: error.code,
        message: error.message,
      });

      const knownErrors = [
        "Comercio no válido",
        "Comercio no valido",
        "Calificacion no valida",
        "El comentario es obligatorio",
        "Comentario demasiado largo",
        "Numero de contacto no valido",
        "Comercio no encontrado",
        "Comercio no disponible",
        "Servicio no disponible",
        "Comercio fuera de horario",
        "Espera unos minutos antes de volver a calificar",
      ];

      if (knownErrors.includes(error.message)) {
        return response(
          error.message,
          error.message.includes("Espera") ? 429 : 400
        );
      }

      return response(
        "No pudimos registrar tu opinión. Intentá nuevamente.",
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "¡Gracias por compartir tu experiencia!",
        id: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Califica - API:", error);

    if (error instanceof SyntaxError) {
      return response("Solicitud inválida", 400);
    }

    return response(
      "Ocurrió un problema al enviar la opinión",
      500
    );
  }
}
