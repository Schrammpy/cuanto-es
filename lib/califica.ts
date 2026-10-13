
import { supabase } from "@/lib/supabase";

// ============================================================
// CUANTOES CALIFICA
// Consulta publica de comercios y verificacion de horarios
// Reutiliza la conexion existente de CuantoEs
// ============================================================

export type BusinessHour = {
  weekday: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
};

export type CalificaBusiness = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  timezone: string;
  is_active: boolean;
  subscription_expires_at: string | null;
  grace_minutes: number;
  califica_business_hours: BusinessHour[];
};

// ============================================================
// OBTENER COMERCIO POR SLUG
// Ejemplo: /califica/alpaso
// ============================================================

export async function getCalificaBusiness(
  slug: string
): Promise<CalificaBusiness | null> {

  // Consultar los datos publicos del comercio
  const { data, error } = await supabase
    .from("califica_public_businesses")
    .select(`
      id,
      slug,
      name,
      logo_url,
      description,
      timezone,
      is_active,
      subscription_expires_at,
      grace_minutes
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Califica - Error al consultar comercio:", error.message);
    throw new Error("No se pudo consultar el comercio");
  }

  if (!data) {
    return null;
  }

  // Consultar horarios del comercio
  const { data: hours, error: hoursError } = await supabase
    .from("califica_business_hours")
    .select(`
      weekday,
      opens_at,
      closes_at,
      is_closed
    `)
    .eq("business_id", data.id)
    .order("weekday", { ascending: true });

  if (hoursError) {
    console.error("Califica - Error al consultar horarios:", hoursError.message);
    throw new Error("No se pudieron consultar los horarios");
  }

  return {
    ...data,
    califica_business_hours: hours ?? [],
  } as CalificaBusiness;
}

// ============================================================
// CONVERTIR HORARIO A MINUTOS
// Ejemplo: 18:30 -> 1110
// ============================================================

function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

// ============================================================
// VERIFICAR SI EL COMERCIO PUEDE RECIBIR CALIFICACIONES
//
// Soporta:
// - Zona horaria America/Asuncion
// - Horarios que cruzan medianoche
// - Periodo de gracia despues del cierre
// - Comercio activo/inactivo
// - Vencimiento de suscripcion
// ============================================================

export function getBusinessStatus(
  business: CalificaBusiness,
  now = new Date()
) {

  // Obtener hora local del comercio
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: business.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const weekdays: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  const weekday = weekdays[getPart("weekday")];

  const currentMinutes =
    Number(getPart("hour")) * 60 +
    Number(getPart("minute"));

  const previousDay = weekday === 1 ? 7 : weekday - 1;

  const hours = business.califica_business_hours ?? [];

  // Comprobar horario de un dia
  function isInWindow(
    day: number,
    fromPreviousDay = false
  ): boolean {

    const schedule = hours.find(
      (item) => item.weekday === day
    );

    if (!schedule || schedule.is_closed) {
      return false;
    }

    const start = toMinutes(schedule.opens_at);
    let end = toMinutes(schedule.closes_at);

    // Si el cierre es anterior a la apertura,
    // significa que cierra al dia siguiente.
    if (end < start) {
      end += 1440;
    }

    const current = currentMinutes +
      (fromPreviousDay ? 1440 : 0);

    return (
      current >= start &&
      current < end + business.grace_minutes
    );
  }

  // Horario actual o continuacion del dia anterior
  const inSchedule =
    isInWindow(weekday) ||
    isInWindow(previousDay, true);

  // Verificar vencimiento de suscripcion
  const subscriptionValid =
    !business.subscription_expires_at ||
    new Date(business.subscription_expires_at) > now;

  return {
    isOpen:
      business.is_active &&
      subscriptionValid &&
      inSchedule,

    inSchedule,
    isActive: business.is_active,
    subscriptionValid,
  };
}
