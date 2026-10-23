import { NextRequest, NextResponse } from "next/server";
import {
  adminResponse,
  apiError,
  businessColumns,
  getAdminDb,
  getAdminSession,
  isSameOrigin,
  parseBusinessInput,
} from "@/lib/califica-admin-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  }

  try {
    const check = await getAdminSession(request);
    if (!check.authorized) {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    const { id } = await context.params;
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)) {
      return adminResponse({ message: "ID del comercio no válido." }, 400, check);
    }

    let input;
    try {
      input = parseBusinessInput(await request.json());
    } catch (error) {
      return adminResponse(
        { message: error instanceof Error ? error.message : "Datos incorrectos." },
        400,
        check
      );
    }

    const db = getAdminDb();
    const { data: existing, error: findError } = await db
      .from("califica_businesses")
      .select("id, slug, is_active")
      .eq("id", id)
      .maybeSingle();

    if (findError) return adminResponse({ message: apiError(findError) }, 500, check);
    if (!existing) return adminResponse({ message: "Comercio no encontrado." }, 404, check);
    if (existing.slug !== input.slug) {
      return adminResponse(
        { message: "El enlace de un comercio existente no puede modificarse." },
        400,
        check
      );
    }

    // Guardamos los siete horarios en una única operación de DB.
    // No cambiamos el estado del comercio mientras se están editando los horarios.
    const { error: hoursError } = await db
      .from("califica_business_hours")
      .upsert(
        input.hours.map((hour) => ({ business_id: id, ...hour })),
        { onConflict: "business_id,weekday" }
      );

    if (hoursError) {
      return adminResponse(
        { message: apiError(hoursError, "No se pudieron actualizar los horarios.") },
        500,
        check
      );
    }

    const { error: updateError } = await db
      .from("califica_businesses")
      .update(businessColumns(input))
      .eq("id", id);

    if (updateError) {
      return adminResponse({ message: apiError(updateError) }, 500, check);
    }

    return adminResponse({ success: true, id }, 200, check);
  } catch (error) {
    console.error("Califica admin businesses PATCH:", error);
    return NextResponse.json({ message: "No se pudo actualizar el comercio." }, { status: 500 });
  }
}
