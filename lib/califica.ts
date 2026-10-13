
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

// ============================================================
// OBTENER COMERCIO
// ============================================================

export async function getCalificaBusiness(
  slug: string
): Promise<CalificaBusiness | null> {
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
    console.error("Califica - Comercio:", error.message);
    throw new Error("No se pudo consultar el comercio");
  }

  if (!data) return null;

  const { data: hours, error: hoursError } = await supabase
    .from("califica_business_hours")
    .select("weekday, opens_at, closes_at, is_closed")
    .eq("business_id", data.id)
    .order("weekday");

  if (hoursError) {
    console.error("Califica - Horarios:", hoursError.message);
    throw new Error("No se pudieron consultar los horarios");
  }

  return {
    ...data,
    califica_business_hours: hours ?? [],
  } as CalificaBusiness;
}

// ============================================================
// ESTADO DEL COMERCIO
// ============================================================

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

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

  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const days: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  const weekday = days[part("weekday")];
  const minutes =
    Number(part("hour")) * 60 +
    Number(part("minute"));

  const previousDay = weekday === 1 ? 7 : weekday - 1;
  const schedules = business.califica_business_hours ?? [];

  function allowedOnDay(
    day: number,
    previous = false
  ): boolean {
    const schedule = schedules.find(
      (item) => item.weekday === day
    );

    if (!schedule || schedule.is_closed) return false;

    const start = toMinutes(schedule.opens_at);
    let end = toMinutes(schedule.closes_at);

    if (end < start) end += 1440;

    const current = minutes + (previous ? 1440 : 0);

    return (
      current >= start &&
      current < end + business.grace_minutes
    );
  }

  const inSchedule =
    allowedOnDay(weekday) ||
    allowedOnDay(previousDay, true);

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
