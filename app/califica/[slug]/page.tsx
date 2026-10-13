
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3, Star, ShieldCheck } from "lucide-react";
import {
  getCalificaBusiness,
  getBusinessStatus,
} from "@/lib/califica";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getCalificaBusiness(slug);

  if (!business) {
    return {
      title: "Comercio no encontrado | CuantoEs",
      robots: { index: false, follow: false },
    };
  }

  const title = `${business.name} | Calificá tu experiencia`;
  const description =
    `Contanos cómo estuvo tu experiencia con ${business.name}. ` +
    "Tu opinión nos ayuda a mejorar.";

  const url =
    `https://www.cuantoes.com.py/califica/${business.slug}`;

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
      url,
      siteName: "CuantoEs Califica",
      type: "website",
      locale: "es_PY",
    },
  };
}

export default async function CalificaPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const business = await getCalificaBusiness(slug);

  if (!business) notFound();

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

  const formatTime = (time: string) => time.slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">

        {/* IDENTIDAD DEL COMERCIO */}
        <header className="flex flex-col items-center text-center gap-3">
          {business.logo_url ? (
            // img permite logos externos sin modificar next.config
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={`Logo de ${business.name}`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl object-contain bg-white p-2"
            />
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-orange-500/15 flex items-center justify-center">
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

        {/* ESTADO DEL SERVICIO */}
        {!business.is_active ? (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 text-center">
            <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-amber-400" />
            <h2 className="text-lg font-bold text-amber-300">
              Página en preparación
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Estamos preparando el servicio de calificaciones
              para este comercio.
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
              Podrás calificar durante el horario habilitado
              de este comercio.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold">
              ¿Cómo estuvo tu pedido?
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Calificá tu experiencia en menos de un minuto.
            </p>

            <div className="flex justify-center gap-2 my-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className="h-9 w-9 text-slate-500"
                />
              ))}
            </div>

            <p className="text-sm text-amber-400">
              Formulario próximamente disponible.
            </p>
          </div>
        )}

        {/* HORARIOS */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-orange-400" />
            Horarios de atención
          </h3>

          <div className="space-y-2 text-sm">
            {hours.map((hour) => (
              <div
                key={hour.weekday}
                className="flex justify-between gap-3 text-slate-300"
              >
                <span>{weekdays[hour.weekday - 1]}</span>
                <span>
                  {hour.is_closed
                    ? "Cerrado"
                    : `${formatTime(hour.opens_at)} - ${formatTime(hour.closes_at)}`}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Horario local de Paraguay. Las calificaciones
            pueden contar con un período adicional después
            del cierre.
          </p>
        </div>

        <footer className="mt-8 pt-5 border-t border-white/10 text-center">
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
