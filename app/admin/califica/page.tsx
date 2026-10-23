"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  FileSpreadsheet,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Store,
} from "lucide-react";

type Hour = {
  weekday: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
};

type Plan = "trial" | "monthly" | "annual";

type Business = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  manager_whatsapp: string | null;
  logo_url: string | null;
  google_sheet_id: string | null;
  timezone: string;
  is_active: boolean;
  subscription_plan: Plan;
  subscription_expires_at: string | null;
  grace_minutes: number;
  created_at: string;
  hours: Hour[];
};

type BusinessForm = {
  name: string;
  slug: string;
  description: string;
  manager_whatsapp: string;
  logo_url: string;
  google_sheet_id: string;
  is_active: boolean;
  subscription_plan: Plan;
  expiration_date: string;
  grace_minutes: number;
  hours: Hour[];
};

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const SITE = "https://www.cuantoes.com.py";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const primary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60";
const secondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60";

function localDateInParaguay(value: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Asuncion",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (name: string) => parts.find((x) => x.type === name)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function suggestedExpiration(plan: Plan): string {
  const result = new Date();
  result.setUTCDate(result.getUTCDate() + (plan === "trial" ? 15 : plan === "monthly" ? 30 : 365));
  return localDateInParaguay(result);
}

function freshHours(): Hour[] {
  return DAYS.map((_, index) => ({
    weekday: index + 1,
    opens_at: "08:00",
    closes_at: "18:00",
    is_closed: index > 4,
  }));
}

function emptyForm(): BusinessForm {
  return {
    name: "",
    slug: "",
    description: "Tu opinión nos ayuda a mejorar.",
    manager_whatsapp: "",
    logo_url: "",
    google_sheet_id: "",
    is_active: false,
    subscription_plan: "trial",
    expiration_date: suggestedExpiration("trial"),
    grace_minutes: 60,
    hours: freshHours(),
  };
}

function fromBusiness(business: Business): BusinessForm {
  return {
    name: business.name,
    slug: business.slug,
    description: business.description || "",
    manager_whatsapp: business.manager_whatsapp || "",
    logo_url: business.logo_url || "",
    google_sheet_id: business.google_sheet_id || "",
    is_active: business.is_active,
    subscription_plan: business.subscription_plan,
    expiration_date: business.subscription_expires_at
      ? localDateInParaguay(new Date(business.subscription_expires_at))
      : suggestedExpiration(business.subscription_plan),
    grace_minutes: business.grace_minutes,
    hours: DAYS.map((_, index) => {
      const found = business.hours.find((h) => h.weekday === index + 1);
      return found
        ? {
            ...found,
            opens_at: found.opens_at.slice(0, 5),
            closes_at: found.closes_at.slice(0, 5),
          }
        : freshHours()[index];
    }),
  };
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .replace(/-$/, "");
}

function planText(plan: Plan) {
  return plan === "trial" ? "Prueba" : plan === "monthly" ? "Mensual" : "Anual";
}

function statusText(business: Business) {
  if (!business.is_active) return { text: "En preparación / inactivo", className: "bg-slate-100 text-slate-700" };
  if (business.subscription_expires_at && new Date(business.subscription_expires_at) <= new Date()) {
    return { text: "Vencido", className: "bg-red-100 text-red-800" };
  }
  return { text: "Activo", className: "bg-emerald-100 text-emerald-800" };
}

async function apiJson(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    ...init,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "No se pudo completar la operación.");
  }
  return payload;
}

export default function CalificaAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<BusinessForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function verifySession() {
      try {
        const data = await apiJson("/api/admin/califica/session");
        if (cancelled) return;
        setAuthenticated(true);
        setSessionEmail(data.email || "");
        const response = await apiJson("/api/admin/califica/businesses");
        if (!cancelled) setBusinesses(response.businesses || []);
      } catch {
        if (!cancelled) setAuthenticated(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    void verifySession();
    return () => { cancelled = true; };
  }, []);

  const filteredBusinesses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return businesses.filter((b) =>
      !term || b.name.toLowerCase().includes(term) || b.slug.includes(term)
    );
  }, [businesses, search]);

  const activeCount = businesses.filter((b) =>
    b.is_active && (!b.subscription_expires_at || new Date(b.subscription_expires_at) > new Date())
  ).length;
  const expiredCount = businesses.filter((b) =>
    b.subscription_expires_at && new Date(b.subscription_expires_at) <= new Date()
  ).length;

  async function reloadBusinesses() {
    setError("");
    setBusy(true);
    try {
      const result = await apiJson("/api/admin/califica/businesses");
      setBusinesses(result.businesses || []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudieron cargar los datos.");
    } finally {
      setBusy(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoginBusy(true);
    try {
      const session = await apiJson("/api/admin/califica/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      setPassword("");
      setSessionEmail(session.email || "");
      setAuthenticated(true);
      await reloadBusinesses();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar sesión.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function logout() {
    try {
      await apiJson("/api/admin/califica/session", { method: "DELETE" });
    } finally {
      setAuthenticated(false);
      setBusinesses([]);
      setSelectedId(null);
      setEditing(false);
      setSessionEmail("");
      setNotice("");
      setError("");
    }
  }

  function newBusiness() {
    setSelectedId(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setError("");
    setNotice("");
    setEditing(true);
  }

  function editBusiness(business: Business) {
    setSelectedId(business.id);
    setForm(fromBusiness(business));
    setSlugTouched(true);
    setError("");
    setNotice("");
    setEditing(true);
  }

  function update<K extends keyof BusinessForm>(key: K, value: BusinessForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function updateHour(weekday: number, key: keyof Hour, value: string | boolean) {
    setForm((previous) => ({
      ...previous,
      hours: previous.hours.map((hour) =>
        hour.weekday === weekday ? { ...hour, [key]: value } : hour
      ),
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.expiration_date)) {
      setError("Seleccioná una fecha de vencimiento válida.");
      setBusy(false);
      return;
    }

    // El vencimiento se interpreta al terminar el día en Paraguay (UTC-03).
    const expiry = new Date(`${form.expiration_date}T23:59:59-03:00`);
    if (Number.isNaN(expiry.getTime())) {
      setError("Fecha de vencimiento inválida.");
      setBusy(false);
      return;
    }

    const payload = {
      ...form,
      subscription_expires_at: expiry.toISOString(),
    };

    try {
      await apiJson(
        selectedId
          ? `/api/admin/califica/businesses/${selectedId}`
          : "/api/admin/califica/businesses",
        {
          method: selectedId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await apiJson("/api/admin/califica/businesses");
      setBusinesses(result.businesses || []);
      setEditing(false);
      setSelectedId(null);
      setNotice("Comercio guardado correctamente.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(value: string, confirmation: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(confirmation);
      setError("");
    } catch {
      setError("No se pudo copiar automáticamente. Seleccioná el texto y copialo.");
    }
  }

  function whatsappMessage(business: Business) {
    return `¡Gracias por elegir ${business.name}! 🙌\nQueremos seguir mejorando para vos. Calificá tu experiencia en menos de un minuto:\n${SITE}/califica/${business.slug}`;
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <p className="flex items-center gap-3 text-sm"><RefreshCw className="h-5 w-5 animate-spin" /> Verificando acceso...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-7 text-white shadow-2xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-300">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="text-xs font-bold tracking-widest text-blue-300">CUANTOES CALIFICA</p>
          <h1 className="mt-2 text-2xl font-bold">Panel administrativo</h1>
          <p className="mt-2 text-sm text-slate-400">Ingresá con tu usuario autorizado de Supabase.</p>
          <form onSubmit={login} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-200" htmlFor="login-email">Correo</label>
              <input id="login-email" type="email" autoComplete="username" required value={email}
                onChange={(event) => setEmail(event.target.value)} className={field} placeholder="administrador@correo.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-200" htmlFor="login-password">Contraseña</label>
              <input id="login-password" type="password" autoComplete="current-password" required value={password}
                onChange={(event) => setPassword(event.target.value)} className={field} />
            </div>
            {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
            <button className={`${primary} w-full`} type="submit" disabled={loginBusy}>
              {loginBusy ? "Ingresando..." : "Ingresar al panel"}
            </button>
          </form>
          <p className="mt-6 text-xs text-slate-500">Acceso exclusivo para la administración de CuantoEs Califica.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-700">CUANTOES CALIFICA</p>
            <h1 className="mt-1 text-2xl font-bold">Administración de comercios</h1>
            <p className="mt-1 text-xs text-slate-500">Sesión: {sessionEmail}</p>
          </div>
          <button type="button" className={secondary} onClick={() => void logout()}>
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-7 sm:px-6">
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {notice}</div>}

        {!editing ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Statistic title="Comercios registrados" value={businesses.length} />
              <Statistic title="Activos y vigentes" value={activeCount} />
              <Statistic title="Suscripciones vencidas" value={expiredCount} />
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Mis comercios</h2>
                  <p className="mt-1 text-sm text-slate-500">Administrá perfiles, horarios, planillas y vencimientos.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={secondary} onClick={() => void reloadBusinesses()} disabled={busy}>
                    <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Actualizar
                  </button>
                  <button type="button" className={primary} onClick={newBusiness}>
                    <Plus className="h-4 w-4" /> Nuevo comercio
                  </button>
                </div>
              </div>
              <div className="relative mt-5">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input className={`${field} pl-10`} placeholder="Buscar por nombre o enlace" value={search}
                  onChange={(event) => setSearch(event.target.value)} aria-label="Buscar comercios" />
              </div>
              <div className="mt-4 space-y-3">
                {filteredBusinesses.length === 0 && (
                  <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">No hay comercios para mostrar.</div>
                )}
                {filteredBusinesses.map((business) => {
                  const status = statusText(business);
                  const url = `${SITE}/califica/${business.slug}`;
                  return (
                    <article key={business.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <Store className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold">{business.name}</h3>
                            <p className="mt-1 break-all text-xs text-slate-500">{url}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.text}</span>
                              <span className="text-xs text-slate-500">{planText(business.subscription_plan)} · Vence {business.subscription_expires_at ? localDateInParaguay(new Date(business.subscription_expires_at)) : "Sin fecha"}</span>
                            </div>
                          </div>
                        </div>
                        <button type="button" className={primary} onClick={() => editBusiness(business)}>Gestionar</button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        <button type="button" className={secondary} onClick={() => void copy(url, "Enlace copiado.")}>
                          <ClipboardCopy className="h-4 w-4" /> Copiar enlace
                        </button>
                        <button type="button" className={secondary} onClick={() => void copy(whatsappMessage(business), "Mensaje de WhatsApp copiado.")}>
                          <ClipboardCopy className="h-4 w-4" /> Mensaje WhatsApp
                        </button>
                        <a className={secondary} href={url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" /> Ver perfil
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <form onSubmit={save} className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <button type="button" onClick={() => { setEditing(false); setError(""); }} className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Volver al listado
                </button>
                <h2 className="text-2xl font-bold">{selectedId ? "Editar comercio" : "Nuevo comercio"}</h2>
                <p className="mt-1 text-sm text-slate-500">Configurá el perfil y guardá todos sus datos desde aquí.</p>
              </div>
              <button type="submit" className={primary} disabled={busy}><Save className="h-4 w-4" /> {busy ? "Guardando..." : "Guardar comercio"}</button>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">1. Información general</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={label} htmlFor="business-name">Nombre del comercio *</label>
                  <input id="business-name" className={field} value={form.name} required maxLength={120}
                    onChange={(event) => {
                      const value = event.target.value;
                      setForm((previous) => ({
                        ...previous,
                        name: value,
                        slug: selectedId || slugTouched ? previous.slug : slugify(value),
                      }));
                    }} placeholder="Ej.: Farmacia Central" />
                </div>
                <div>
                  <label className={label} htmlFor="business-slug">Identificador del enlace (slug) *</label>
                  <input id="business-slug" className={`${field} ${selectedId ? "bg-slate-100" : ""}`} value={form.slug} required maxLength={64}
                    readOnly={Boolean(selectedId)} onChange={(event) => { setSlugTouched(true); update("slug", slugify(event.target.value)); }} />
                  <p className="mt-1 break-all text-xs text-slate-500">{SITE}/califica/{form.slug || "identificador"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className={label} htmlFor="description">Descripción</label>
                  <textarea id="description" rows={2} className={field} maxLength={300} value={form.description}
                    onChange={(event) => update("description", event.target.value)} />
                </div>
                <div>
                  <label className={label} htmlFor="manager">WhatsApp del propietario (uso interno)</label>
                  <input id="manager" className={field} value={form.manager_whatsapp} maxLength={30}
                    onChange={(event) => update("manager_whatsapp", event.target.value)} placeholder="0981 123456" />
                </div>
                <div>
                  <label className={label} htmlFor="grace">Tolerancia de horario (minutos)</label>
                  <input id="grace" className={field} type="number" min={0} max={180} value={form.grace_minutes}
                    onChange={(event) => update("grace_minutes", Number(event.target.value))} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-1 text-lg font-bold">2. Horarios de atención</h3>
              <p className="mb-4 text-sm text-slate-500">Zona horaria: Paraguay. Se admiten cierres al día siguiente, por ejemplo 18:00 a 02:00.</p>
              <div className="space-y-3">
                {form.hours.map((hour) => (
                  <div key={hour.weekday} className="grid grid-cols-1 items-center gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[130px_100px_1fr_1fr]">
                    <span className="text-sm font-semibold">{DAYS[hour.weekday - 1]}</span>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={hour.is_closed} onChange={(event) => updateHour(hour.weekday, "is_closed", event.target.checked)} className="h-4 w-4 accent-blue-700" /> Cerrado
                    </label>
                    <div>
                      <span className="mb-1 block text-xs text-slate-500">Apertura</span>
                      <input type="time" className={field} disabled={hour.is_closed} value={hour.opens_at.slice(0, 5)}
                        onChange={(event) => updateHour(hour.weekday, "opens_at", event.target.value)} />
                    </div>
                    <div>
                      <span className="mb-1 block text-xs text-slate-500">Cierre</span>
                      <input type="time" className={field} disabled={hour.is_closed} value={hour.closes_at.slice(0, 5)}
                        onChange={(event) => updateHour(hour.weekday, "closes_at", event.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">3. Suscripción y activación</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={label} htmlFor="plan">Plan comercial *</label>
                  <select id="plan" className={field} value={form.subscription_plan}
                    onChange={(event) => {
                      const plan = event.target.value as Plan;
                      setForm((previous) => ({ ...previous, subscription_plan: plan, expiration_date: suggestedExpiration(plan) }));
                    }}>
                    <option value="trial">Prueba (15 días sugeridos)</option>
                    <option value="monthly">Mensual (30 días sugeridos)</option>
                    <option value="annual">Anual (365 días sugeridos)</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="expiration">Fecha de vencimiento (Paraguay) *</label>
                  <input id="expiration" className={field} type="date" required value={form.expiration_date}
                    onChange={(event) => update("expiration_date", event.target.value)} />
                </div>
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-blue-700" checked={form.is_active}
                  onChange={(event) => update("is_active", event.target.checked)} />
                <span className="text-sm text-slate-800"><strong>Comercio activo</strong><span className="mt-1 block text-slate-600">Dejalo desactivado mientras preparás su logo y planilla. Para activarlo es obligatorio tener un Google Sheet vinculado.</span></span>
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">4. Logo y Google Sheets</h3>
              <p className="mb-4 text-sm text-slate-500">Ambos se crean manualmente como hasta ahora. El panel solo registra sus referencias.</p>
              <div className="space-y-4">
                <div>
                  <label className={label} htmlFor="logo">URL pública del logo en Supabase Storage</label>
                  <input id="logo" className={field} type="url" value={form.logo_url} maxLength={700}
                    onChange={(event) => update("logo_url", event.target.value)} placeholder="https://...supabase.co/storage/v1/object/public/..." />
                </div>
                <div>
                  <label className={label} htmlFor="sheet">ID o URL de Google Sheets</label>
                  <input id="sheet" className={field} value={form.google_sheet_id} maxLength={300}
                    onChange={(event) => update("google_sheet_id", event.target.value)} placeholder="Pegá el ID o la URL completa de la planilla" />
                  <p className="mt-1 text-xs text-slate-500">Usá una planilla independiente por comercio, compartida con el propietario como Lector.</p>
                </div>
                {form.google_sheet_id && (
                  <p className="flex items-center gap-2 text-xs text-blue-700"><FileSpreadsheet className="h-4 w-4" /> Asegurate de que el Apps Script central tenga permiso de edición.</p>
                )}
              </div>
            </section>

            <div className="flex flex-wrap justify-end gap-2 pb-6">
              <button type="button" className={secondary} onClick={() => { setEditing(false); setError(""); }}>Cancelar</button>
              <button type="submit" className={primary} disabled={busy}><Save className="h-4 w-4" /> {busy ? "Guardando..." : "Guardar comercio"}</button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function Statistic({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
