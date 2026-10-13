
import "server-only";

import { supabase } from "@/lib/supabase";

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

// Misma URL de Supabase que utiliza CuantoEs.
// La clave privada se utiliza solamente desde Next.js servidor.
function getSupabaseCalifica() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan variables de Supabase para Califica"
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Obtener comercio por su slug
export async function getCalificaBusiness(
  slug: string
): Promise<CalificaBusiness | null> {
  const supabase = getSupabaseCalifica();

  const { data, error } = await supabase
    .from("califica_businesses")
    .select(`
      id,
      slug,
      name,
      logo_url,
      description,
      timezone,
      is_active,
      subscription_expires_at,
      grace_minutes,
      califica_business_hours (
        weekday,
        opens_at,
        closes_at,
        is_closed
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error Califica:", {
      message: error.message,
      code: error.code,
      details: error.details,
    });

    throw new Error("No se pudo consultar el comercio");
  }

  return data as CalificaBusiness | null;
}

// Convertir HH:MM:SS a minutos
function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

// Verificar horario de atencion en zona horaria del comercio
export function getBusinessStatus(
  business: CalificaBusiness,
  now = new Date()
) {
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
  const minutes =
    Number(getPart("hour")) * 60 +
    Number(getPart("minute"));

  const previousDay = weekday === 1 ? 7 : weekday - 1;
  const hours = business.califica_business_hours ?? [];

  function isInWindow(
    day: number,
    previous = false
  ): boolean {
    const schedule = hours.find(
      (item) => item.weekday === day
    );

    if (!schedule || schedule.is_closed) return false;

    const start = toMinutes(schedule.opens_at);
    let end = toMinutes(schedule.closes_at);

    // Horarios que cruzan medianoche.
    if (end < start) end += 1440;

    const current = minutes + (previous ? 1440 : 0);

    return (
      current >= start &&
      current < end + business.grace_minutes
    );
  }

  const inSchedule =
    isInWindow(weekday) ||
    isInWindow(previousDay, true);

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
