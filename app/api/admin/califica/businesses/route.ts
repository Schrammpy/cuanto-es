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

export async function GET(request: NextRequest) {
  try {
    const check = await getAdminSession(request);
    if (!check.authorized) {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    const db = getAdminDb();
    const { data: businesses, error } = await db
      .from("califica_businesses")
      .select("id, slug, name, description, manager_whatsapp, logo_url, google_sheet_id, timezone, is_active, subscription_plan, subscription_expires_at, grace_minutes, created_at")
      .order("created_at", { ascending: false });

    if (error) return adminResponse({ message: apiError(error) }, 500, check);

    const ids = (businesses || []).map((b) => b.id);
    let hours: Array<{
      business_id: string;
      weekday: number;
      opens_at: string;
      closes_at: string;
      is_closed: boolean;
    }> = [];

    if (ids.length > 0) {
      const result = await db
        .from("califica_business_hours")
        .select("business_id, weekday, opens_at, closes_at, is_closed")
        .in("business_id", ids)
        .order("weekday");
      if (result.error) {
        return adminResponse({ message: apiError(result.error) }, 500, check);
      }
      hours = result.data || [];
    }

    return adminResponse(
      {
        businesses: (businesses || []).map((business) => ({
          ...business,
          hours: hours
            .filter((hour) => hour.business_id === business.id)
            .map(({ weekday, opens_at, closes_at, is_closed }) => ({
              weekday,
              opens_at,
              closes_at,
              is_closed,
            })),
        })),
      },
      200,
      check
    );
  } catch (error) {
    console.error("Califica admin businesses GET:", error);
    return NextResponse.json({ message: "No se pudo listar los comercios." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  }

  try {
    const check = await getAdminSession(request);
    if (!check.authorized) {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
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
    const { data: created, error: createError } = await db
      .from("califica_businesses")
      .insert({ ...businessColumns(input), is_active: false })
      .select("id")
      .single();

    if (createError || !created) {
      return adminResponse({ message: apiError(createError, "No se pudo crear el comercio.") }, 400, check);
    }

    const { error: hoursError } = await db
      .from("califica_business_hours")
      .upsert(
        input.hours.map((hour) => ({ business_id: created.id, ...hour })),
        { onConflict: "business_id,weekday" }
      );

    if (hoursError) {
      // Revertir solo el nuevo registro, que aún no tiene opiniones.
      const cleanup = await db.from("califica_businesses").delete().eq("id", created.id);
      if (cleanup.error) {
        console.error("Califica Admin: falló reversión de alta:", cleanup.error);
        return adminResponse(
          { message: "No se guardaron los horarios. El perfil quedó desactivado; revisalo antes de reintentar." },
          500,
          check
        );
      }
      return adminResponse({ message: apiError(hoursError, "No se pudieron guardar los horarios.") }, 500, check);
    }

    // Solo se activa después de completar correctamente los siete horarios.
    if (input.is_active) {
      const activation = await db
        .from("califica_businesses")
        .update({ is_active: true })
        .eq("id", created.id);
      if (activation.error) {
        return adminResponse({ message: "Comercio creado, pero no se pudo activar. Editalo para activarlo." }, 500, check);
      }
    }

    return adminResponse({ success: true, id: created.id }, 201, check);
  } catch (error) {
    console.error("Califica admin businesses POST:", error);
    return NextResponse.json({ message: "No se pudo crear el comercio." }, { status: 500 });
  }
}
