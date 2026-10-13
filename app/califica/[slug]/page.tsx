
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3, Star, ShieldCheck } from "lucide-react";

import {
  getCalificaBusiness,
  getBusinessStatus,
} from "@/lib/califica";

import CalificaForm from "./CalificaForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// ============================================================
// METADATA POR COMERCIO
// ============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getCalificaBusiness(slug);

  if (!business) {
    return {
      title: "Comercio no encontrado | CuantoEs",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${business.name} | Calificá tu experiencia`;
  const description =
    `Contanos cómo estuvo tu experiencia con ${business.name}. ` +
    "Tu opinión nos ayuda a mejorar.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `https://www.cuantoes.com.py/califica/${business.slug}`,
      siteName: "CuantoEs Califica",
      type: "website",
      locale: "es_PY",
    },
  };
}

// ============================================================
// PAGINA PUBLICA
// ============================================================

export default async function CalificaPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const business = await getCalificaBusiness(slug);

  if (!business) {
    notFound();
  }

  const status = getBusinessStatus(business);

  const weekdays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const hours = [...business.califica_business_hours]
    .sort((a, b) => a.weekday - b.weekday);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">

        {/* COMERCIO */}
        <header className="flex flex-col items-center gap-3 text-center">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={`Logo de ${business.name}`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl bg-white p-2 object-contain"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-orange-500/15">
              <Star className="h-11 w-11 text-orange-400" />
            </div>
          )}

          <h1 className="text-2xl font-bold">
            {business.name}
          </h1>

          <p className="text-sm text-slate-400">
            {business.description ||
              "Tu opinión nos ayuda a mejorar"}
          </p>
        </header>

        <div className="my-6 border-t border-white/10" />

        {/* CONTENIDO */}
        {!business.is_active ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-center">
            <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-amber-400" />

            <h2 className="text-lg font-bold text-amber-300">
              Página en preparación
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Estamos preparando el servicio de
              calificaciones para este comercio.
            </p>
          </div>
        ) : !status.subscriptionValid ? (
          <div className="rounded-2xl bg-slate-800 p-5 text-center">
            <h2 className="font-bold">
              Calificaciones temporalmente no disponibles
            </h2>
          </div>
        ) : !status.isOpen ? (
          <div className="rounded-2xl bg-slate-800 p-5 text-center">
            <Clock3 className="mx-auto mb-3 h-8 w-8 text-orange-400" />

            <h2 className="text-xl font-bold">
              Estamos fuera del horario de atención
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Podrás calificar durante el horario
              habilitado de este comercio.
            </p>
          </div>
        ) : (
          <CalificaForm slug={business.slug} />
        )}

        {/* HORARIOS: SOLO FUERA DE ATENCION */}
        {!status.isOpen &&
          business.is_active &&
          status.subscriptionValid && (
            <div className="mt-8">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="h-4 w-4 text-orange-400" />
                Horarios de atención
              </h3>

              <div className="space-y-2 text-sm">
                {hours.map((hour) => (
                  <div
                    key={hour.weekday}
                    className="flex justify-between gap-3 text-slate-300"
                  >
                    <span>
                      {weekdays[hour.weekday - 1]}
                    </span>

                    <span>
                      {hour.is_closed
                        ? "Cerrado"
                        : `${hour.opens_at.slice(0, 5)} - ${hour.closes_at.slice(0, 5)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* PIE */}
        <footer className="mt-8 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-slate-500">
            Servicio proporcionado por{" "}
            <a
              href="https://www.cuantoes.com.py"
              className="text-orange-400 hover:underline"
            >
              CuantoEs Califica
            </a>
          </p>
        </footer>

      </section>
    </main>
  );
}
