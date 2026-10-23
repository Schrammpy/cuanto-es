import { createClient, type Session } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const ACCESS_COOKIE = "ce_califica_admin_access";
export const REFRESH_COOKIE = "ce_califica_admin_refresh";

export type AdminHour = {
  weekday: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
};

export type AdminBusinessInput = {
  name: string;
  slug: string;
  description: string | null;
  manager_whatsapp: string | null;
  logo_url: string | null;
  google_sheet_id: string | null;
  timezone: "America/Asuncion";
  is_active: boolean;
  subscription_plan: "trial" | "monthly" | "annual";
  subscription_expires_at: string;
  grace_minutes: number;
  hours: AdminHour[];
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Faltan variables públicas de Supabase en Vercel.");
  }

  return { url, anonKey };
}

export function getAuthClient() {
  const { url, anonKey } = supabaseConfig();

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export function getAdminDb() {
  const { url } = supabaseConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en Vercel.");
  }

  // Uso EXCLUSIVO del servidor, después de verificar el usuario administrador.
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export function isAdminUser(userId: string): boolean {
  const ids = (process.env.CALIFICA_ADMIN_UID || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return ids.includes(userId);
}

export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return Boolean(origin) && origin === new URL(request.url).origin;
}

export function setSessionCookies(response: NextResponse, session: Session) {
  const secure = process.env.NODE_ENV === "production";
  const common = {
    httpOnly: true,
    secure,
    sameSite: "strict" as const,
    path: "/",
  };

  response.cookies.set(ACCESS_COOKIE, session.access_token, {
    ...common,
    maxAge: Math.max(30, session.expires_in - 20),
  });
  response.cookies.set(REFRESH_COOKIE, session.refresh_token, {
    ...common,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookies(response: NextResponse) {
  for (const cookieName of [ACCESS_COOKIE, REFRESH_COOKIE]) {
    response.cookies.set(cookieName, "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });
  }
}

export type AdminSessionCheck = {
  authorized: boolean;
  refreshed?: Session;
  email?: string;
};

export async function getAdminSession(
  request: NextRequest
): Promise<AdminSessionCheck> {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const auth = getAuthClient();

  if (accessToken) {
    const { data, error } = await auth.auth.getUser(accessToken);
    if (!error && data.user) {
      if (!isAdminUser(data.user.id) || !data.user.email_confirmed_at) {
        return { authorized: false };
      }
      return { authorized: true, email: data.user.email || undefined };
    }
  }

  if (!refreshToken) return { authorized: false };

  const { data: refreshed, error: refreshError } =
    await auth.auth.refreshSession({ refresh_token: refreshToken });

  if (refreshError || !refreshed.session) {
    return { authorized: false };
  }

  // Comprobación remota de identidad; nunca confiar solo en la cookie/JWT decodificado.
  const { data, error } = await auth.auth.getUser(
    refreshed.session.access_token
  );
  if (
    error ||
    !data.user ||
    !isAdminUser(data.user.id) ||
    !data.user.email_confirmed_at
  ) {
    return { authorized: false };
  }

  return {
    authorized: true,
    email: data.user.email || undefined,
    refreshed: refreshed.session,
  };
}

export function adminResponse(
  value: unknown,
  status: number,
  check: AdminSessionCheck
) {
  const response = NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
  if (check.refreshed) setSessionCookies(response, check.refreshed);
  return response;
}

export function apiError(error: unknown, fallback = "Error de base de datos") {
  const typed = error as { code?: string; message?: string } | null;

  if (typed?.code === "23505") {
    return "Ya existe un comercio con este enlace (slug).";
  }
  if (typed?.code === "23514" || typed?.code === "23502") {
    return "Hay un dato inválido u obligatorio en el comercio.";
  }

  console.error("Califica Admin:", error);
  return fallback;
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Los datos enviados no son válidos.");
  }
  return value as Record<string, unknown>;
}

function limitedString(value: unknown, max: number): string {
  if (typeof value !== "string") throw new Error("Falta un dato de texto.");
  const result = value.trim();
  if (result.length > max) throw new Error(`Un campo supera ${max} caracteres.`);
  return result;
}

function optional(value: unknown, max: number): string | null {
  if (value === null || value === undefined || value === "") return null;
  return limitedString(value, max) || null;
}

function normalizedSheetId(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  const id = match?.[1] || value;
  if (!/^[a-zA-Z0-9_-]{20,200}$/.test(id)) {
    throw new Error("El ID de Google Sheets no tiene un formato válido.");
  }
  return id;
}

function validateLogo(value: string | null): string | null {
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("La URL del logo no es válida.");
  }

  const storageOrigin = new URL(supabaseConfig().url).origin;
  if (
    url.protocol !== "https:" ||
    url.origin !== storageOrigin ||
    !url.pathname.startsWith("/storage/v1/object/public/")
  ) {
    throw new Error("El logo debe ser una URL pública de Storage del Supabase del proyecto.");
  }

  return url.toString();
}

function validateHours(value: unknown): AdminHour[] {
  if (!Array.isArray(value) || value.length !== 7) {
    throw new Error("Debés indicar los siete días de atención.");
  }

  const result = value.map((raw) => {
    const hour = record(raw);
    const weekday = hour.weekday;
    const opens = limitedString(hour.opens_at, 5);
    const closes = limitedString(hour.closes_at, 5);
    const closed = hour.is_closed;

    const validTime = (time: string) =>
      /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

    if (
      typeof weekday !== "number" ||
      !Number.isInteger(weekday) ||
      Number(weekday) < 1 ||
      Number(weekday) > 7 ||
      !validTime(opens) ||
      !validTime(closes) ||
      typeof closed !== "boolean"
    ) {
      throw new Error("Hay horarios inválidos.");
    }
    if (!closed && opens === closes) {
      throw new Error("Para un día abierto, la apertura y el cierre deben ser diferentes.");
    }

    return {
      weekday: Number(weekday),
      opens_at: opens,
      closes_at: closes,
      is_closed: closed,
    };
  });

  if (new Set(result.map((hour) => hour.weekday)).size !== 7) {
    throw new Error("Los días de atención no pueden repetirse.");
  }
  return result.sort((a, b) => a.weekday - b.weekday);
}

export function parseBusinessInput(value: unknown): AdminBusinessInput {
  const input = record(value);
  const name = limitedString(input.name, 120);
  const slug = limitedString(input.slug, 64);
  const description = optional(input.description, 300);
  const managerWhatsapp = optional(input.manager_whatsapp, 30);
  const logo = validateLogo(optional(input.logo_url, 700));
  const sheet = normalizedSheetId(optional(input.google_sheet_id, 300));
  const plan = input.subscription_plan;
  const isActive = input.is_active;
  const grace = input.grace_minutes;
  const date = input.subscription_expires_at;

  if (name.length < 2) throw new Error("Indicá el nombre del comercio.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("El enlace solo admite minúsculas, números y guiones internos.");
  }
  if (managerWhatsapp && !/^\+?[0-9 ()-]{6,30}$/.test(managerWhatsapp)) {
    throw new Error("El número de WhatsApp del propietario no es válido.");
  }
  if (plan !== "trial" && plan !== "monthly" && plan !== "annual") {
    throw new Error("Elegí un plan válido.");
  }
  if (typeof isActive !== "boolean") throw new Error("Estado inválido.");
  if (typeof grace !== "number" || !Number.isInteger(grace) || grace < 0 || grace > 180) {
    throw new Error("La tolerancia debe estar entre 0 y 180 minutos.");
  }
  if (typeof date !== "string" || !date.trim()) {
    throw new Error("Definí la fecha de vencimiento.");
  }
  const expiration = new Date(date);
  if (Number.isNaN(expiration.getTime())) {
    throw new Error("Fecha de vencimiento inválida.");
  }
  if (isActive && !sheet) {
    throw new Error("Vinculá primero una planilla Google Sheets para activar el comercio.");
  }

  return {
    name,
    slug,
    description,
    manager_whatsapp: managerWhatsapp,
    logo_url: logo,
    google_sheet_id: sheet,
    timezone: "America/Asuncion",
    is_active: isActive,
    subscription_plan: plan,
    subscription_expires_at: expiration.toISOString(),
    grace_minutes: Number(grace),
    hours: validateHours(input.hours),
  };
}

export function businessColumns(input: AdminBusinessInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    manager_whatsapp: input.manager_whatsapp,
    logo_url: input.logo_url,
    google_sheet_id: input.google_sheet_id,
    timezone: input.timezone,
    is_active: input.is_active,
    subscription_plan: input.subscription_plan,
    subscription_expires_at: input.subscription_expires_at,
    grace_minutes: input.grace_minutes,
  };
}
