import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  HeartHandshake,
  MessageCircle,
  PackageCheck,
  Smartphone,
  Star,
  TrendingUp,
  Truck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CuantoEs Califica | Conocé la opinión de tus clientes",
  description:
    "Tu venta no termina con la entrega. Pedí opiniones por WhatsApp, recibí calificaciones privadas y descubrí oportunidades para mejorar tu comercio. Probá Califica por 15 días.",
  alternates: { canonical: "https://www.cuantoes.com.py/califica" },
  openGraph: {
    title: "CuantoEs Califica | Tu venta no termina con la entrega",
    description:
      "Un mensaje más para tu cliente. Información valiosa para tu negocio. Conocé sus experiencias sin cambiar tu forma de vender.",
    url: "https://www.cuantoes.com.py/califica",
    siteName: "CuantoEs Califica",
    locale: "es_PY",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const BENEFITS = [
  {
    icon: <MessageCircle className="h-6 w-6" aria-hidden="true" />,
    title: "Escuchá lo que antes no sabías",
    description:
      "No todos los clientes hacen un reclamo. Brindales un espacio sencillo para contarte cómo les fue.",
  },
  {
    icon: <Truck className="h-6 w-6" aria-hidden="true" />,
    title: "Detectá oportunidades de mejora",
    description:
      "Encontrá señales sobre tiempos de espera, atención, estado del producto y experiencia de entrega.",
  },
  {
    icon: <HeartHandshake className="h-6 w-6" aria-hidden="true" />,
    title: "Atendé mejor las dificultades",
    description:
      "Cuando un cliente califica de 1 a 3 estrellas, puede pedir voluntariamente que lo contacten.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" aria-hidden="true" />,
    title: "Tomá decisiones con información",
    description:
      "Consultá las opiniones, promedios, evolución mensual y comentarios pendientes en tu planilla privada.",
  },
];

const QUESTIONS = [
  {
    question: "¿Tengo que instalar una aplicación o cambiar mi WhatsApp?",
    answer:
      "No. Seguís usando WhatsApp como siempre. Simplemente compartís el enlace de Califica al finalizar una venta o entrega.",
  },
  {
    question: "¿Mis clientes tienen que registrarse?",
    answer:
      "No. Abren el enlace, eligen de 1 a 5 estrellas y pueden dejar un comentario. No necesitan crear una cuenta.",
  },
  {
    question: "¿Las opiniones son públicas en Google?",
    answer:
      "No. Califica Esencial recopila opiniones privadas para que el comercio pueda conocer y mejorar su servicio. No publica reseñas en Google Maps.",
  },
  {
    question: "¿Cómo veo los resultados?",
    answer:
      "Recibís acceso de lectura a tu propia planilla de Google Sheets con las opiniones e indicadores que se actualizan automáticamente.",
  },
  {
    question: "¿El sistema verifica que cada opinión sea una compra real?",
    answer:
      "No. El enlace es permanente y no está vinculado a tickets o pedidos. El comercio debe compartirlo con sus clientes y utilizar los resultados como señales para mejorar.",
  },
  {
    question: "¿Cómo se paga y qué pasa si dejo de utilizarlo?",
    answer:
      "El alta, los cobros y las renovaciones se coordinan de forma manual por ahora. Si la suscripción vence, se suspende la recepción de nuevas opiniones; el historial existente no se elimina automáticamente por ese motivo.",
  },
];

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`h-5 w-5 ${index < count ? "fill-amber-400 text-amber-400" : "text-slate-500"}`}
        />
      ))}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
      )}
    </div>
  );
}

function WhatsAppButton({
  href,
  enabled,
  label = "Quiero probar Califica",
  light = false,
}: {
  href: string;
  enabled: boolean;
  label?: string;
  light?: boolean;
}) {
  return (
    <a
      href={href}
      target={enabled ? "_blank" : undefined}
      rel={enabled ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
        light
          ? "bg-white text-emerald-900 hover:bg-emerald-50"
          : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
      }`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {enabled ? label : "Ver opciones de contacto"}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

export default function CalificaLandingPage() {
  // Configurar en Vercel (Environment Variables), sin agregar numeros al repo.
  const phone = (process.env.CALIFICA_VENTAS_WHATSAPP ?? "").replace(/\D/g, "");
  const phoneConfigured = /^595\d{8,10}$/.test(phone);
  const invitation =
    "Hola, quiero conocer CuantoEs Califica y solicitar una prueba para mi comercio.";
  const contactHref = phoneConfigured
    ? `https://wa.me/${phone}?text=${encodeURIComponent(invitation)}`
    : "#contacto";

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-900">
      {/* Header independiente del Navbar original */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <a href="#inicio" className="flex items-center gap-2 text-white" aria-label="CuantoEs Califica - inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/30">
              <Star className="h-6 w-6 fill-amber-300" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">CuantoEs <span className="text-amber-300">Califica</span></span>
          </a>
          <a href="#planes" className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10 sm:text-sm">
            Planes y precios
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative isolate overflow-hidden bg-[#081426] px-5 pb-20 pt-32 text-white sm:px-8 sm:pb-28 sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-[110px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200 sm:text-sm">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Para comercios que venden por WhatsApp
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.65rem]">
              Tu venta no termina <span className="text-amber-300">con la entrega.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Descubrí qué piensan tus clientes después de recibir su pedido. Con un mensaje más por WhatsApp podés conocer su experiencia y encontrar oportunidades para mejorar.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <WhatsAppButton href={contactHref} enabled={phoneConfigured} />
              <a href="#como-funciona" className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:text-white">
                Conocer cómo funciona <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" />Sin aplicaciones nuevas</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" />Enlace permanente</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" />15 días de prueba</span>
            </div>
          </div>

          {/* Demostracion ilustrativa: no utiliza capturas de terceros ni datos reales */}
          <div className="relative mx-auto w-full max-w-[490px] lg:max-w-none" aria-label="Demostración ilustrativa: mensaje por WhatsApp, formulario de estrellas y resultados">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-emerald-400/10 to-indigo-500/10 blur-2xl" aria-hidden="true" />
            <div className="relative space-y-4 rounded-[2rem] border border-white/15 bg-white/[0.07] p-4 shadow-2xl backdrop-blur sm:p-5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4" /> Un último mensaje</span>
                <span>01 / 03</span>
              </div>
              <div className="rounded-2xl bg-[#e5f4ed] p-4 text-slate-900">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-emerald-800"><MessageCircle className="h-4 w-4" /> Conversación con tu cliente</div>
                <div className="ml-auto max-w-[93%] rounded-2xl rounded-tr-sm bg-[#c8edce] p-3 text-sm leading-6 shadow-sm">
                  ¡Muchas gracias por tu pedido! 🙌 ¿Nos ayudás calificando tu experiencia? ⭐
                  <span className="mt-2 block break-all font-semibold text-emerald-800">cuantoes.com.py/califica/tucomercio</span>
                  <span className="mt-1 block text-right text-[10px] text-emerald-700">Pedido entregado ✓✓</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15"><Star className="h-6 w-6 fill-amber-400 text-amber-400" /></div>
                <p className="text-sm font-bold text-white">¿Cómo estuvo tu pedido?</p>
                <p className="mb-3 mt-1 text-xs text-slate-400">Tu opinión nos ayuda a mejorar.</p>
                <div className="flex justify-center"><Stars /></div>
                <div className="mx-auto mt-4 h-8 max-w-48 rounded-lg bg-amber-400 text-center text-xs font-bold leading-8 text-slate-900">Enviar opinión</div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-slate-900">
                <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-emerald-600" /><span className="text-xs font-bold sm:text-sm">Resultados organizados</span></div>
                <span className="text-xs font-bold text-emerald-700">Google Sheets</span>
              </div>
              <p className="text-center text-[11px] text-slate-400">Vista ilustrativa del servicio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="El paso que faltaba"
            title="Entregás pedidos todos los días. ¿Sabés cómo fue la experiencia?"
            description="La conversación termina cuando el pedido llega. Pero el cliente todavía tiene mucho para contarte: qué funcionó, qué salió mal y qué podrías hacer mejor."
          />
          <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Antes</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-slate-700">
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">Consulta</span><ArrowRight className="h-4 w-4 text-slate-400" />
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">Pedido</span><ArrowRight className="h-4 w-4 text-slate-400" />
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">Entrega</span>
              </div>
              <p className="mt-6 text-lg font-bold text-slate-900">La venta termina. La opinión queda sin preguntar.</p>
            </div>
            <div className="flex items-center justify-center"><ArrowRight className="h-7 w-7 rotate-90 text-emerald-600 lg:rotate-0" /></div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Con Califica</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-slate-700">
                <span className="rounded-lg bg-white px-3 py-2 text-sm">Entrega</span><ArrowRight className="h-4 w-4 text-emerald-600" />
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-emerald-800">Opinión</span><ArrowRight className="h-4 w-4 text-emerald-600" />
                <span className="rounded-lg bg-white px-3 py-2 text-sm">Mejora</span>
              </div>
              <p className="mt-6 text-lg font-bold text-emerald-950">Un mensaje más. Información valiosa para tu negocio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 pasos */}
      <section id="como-funciona" className="bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Así de sencillo"
            title="Sin cambiar tu forma de vender"
            description="Ya utilizás WhatsApp para atender pedidos. Califica agrega el paso final para escuchar a tus compradores."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: <MessageCircle className="h-7 w-7" />, title: "Enviás tu enlace", description: "Al finalizar la entrega, compartís por WhatsApp el mismo enlace personalizado de siempre." },
              { icon: <Star className="h-7 w-7" />, title: "Tu cliente califica", description: "Elige de 1 a 5 estrellas y puede dejar un comentario. Sin cuentas ni descargas." },
              { icon: <TrendingUp className="h-7 w-7" />, title: "Conocés los resultados", description: "Recibís opiniones e indicadores en una planilla privada para detectar qué podés mejorar." },
            ].map((step, index) => (
              <div key={step.title} className="relative rounded-3xl border border-slate-200 bg-[#f8fafc] p-7 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">{step.icon}</div>
                  <span className="text-3xl font-extrabold text-slate-200">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Más que estrellas"
            title="Cada entrega tiene algo que enseñarte"
            description="Convertí las experiencias de tus clientes en señales útiles para cuidar lo que hacés bien y revisar lo que se puede mejorar."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">{benefit.icon}</div>
                <div>
                  <h3 className="text-lg font-extrabold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resultados ilustrativos */}
      <section className="bg-[#0b1b30] px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Datos para actuar</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Las opiniones dejan de perderse entre conversaciones.</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Tu comercio recibe una planilla privada con las calificaciones, comentarios, promedio de estrellas, evolución mensual y casos pendientes de atención.
            </p>
            <div className="mt-7 space-y-3 text-sm text-slate-200">
              <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />Historial de opiniones organizado</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />Indicadores con actualización automática</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />Una planilla independiente por comercio</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white p-5 text-slate-900 shadow-2xl sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-emerald-700" /><span className="text-sm font-extrabold">Panel de resultados</span></div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800">Ejemplo ilustrativo</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-slate-100 p-3"><p className="text-[11px] text-slate-500">Opiniones</p><p className="mt-1 text-2xl font-extrabold">86</p></div>
              <div className="rounded-xl bg-slate-100 p-3"><p className="text-[11px] text-slate-500">Promedio</p><p className="mt-1 text-2xl font-extrabold">4,3<span className="ml-1 text-base text-amber-500">★</span></p></div>
              <div className="rounded-xl bg-slate-100 p-3"><p className="text-[11px] text-slate-500">Por revisar</p><p className="mt-1 text-2xl font-extrabold">6</p></div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-100 p-4">
              <p className="mb-4 text-sm font-bold">Opiniones por mes</p>
              <div className="flex h-32 items-end justify-between gap-2" role="img" aria-label="Gráfico de barras de ejemplo con opiniones en aumento de mayo a octubre">
                {[35, 47, 42, 65, 74, 86].map((value, index) => (
                  <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <div className="w-full max-w-12 rounded-t-md bg-emerald-500" style={{ height: `${value}%` }} />
                    <span className="text-[10px] text-slate-500">{["May", "Jun", "Jul", "Ago", "Sep", "Oct"][index]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              <strong>Oportunidad para revisar:</strong> comentarios sobre demoras o estado del producto al recibirlo.
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planes" className="bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Planes simples" title="Empezá a escuchar a tus clientes" description="Un enlace propio, tu identidad comercial y una planilla con las opiniones e indicadores. Sin integración con tu sistema de pedidos." />
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-8">
              <p className="text-sm font-semibold text-slate-600">Califica Esencial · Mensual</p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight">Gs. 50.000</p>
              <p className="mt-2 text-sm text-slate-500">por comercio / mes</p>
              <div className="my-7 h-px bg-slate-200" />
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-700" />Enlace permanente de tu comercio</li>
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-700" />Imagen con tu marca</li>
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-700" />Opiniones e indicadores privados</li>
                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-700" />Soporte básico de configuración</li>
              </ul>
            </div>
            <div className="relative rounded-3xl border-2 border-emerald-500 bg-emerald-50 p-7 shadow-sm sm:p-8">
              <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white">Ahorro anual</span>
              <p className="text-sm font-semibold text-emerald-900">Califica Esencial · Anual</p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight">Gs. 350.000</p>
              <p className="mt-2 text-sm text-emerald-800">por comercio / año</p>
              <div className="my-7 h-px bg-emerald-200" />
              <p className="text-base font-bold text-emerald-950">Incluye lo mismo que el mensual.</p>
              <p className="mt-3 text-sm leading-7 text-emerald-950">Ahorrás Gs. 250.000 frente a pagar doce meses por separado (aproximadamente 41,7 %).</p>
              <p className="mt-4 text-sm text-emerald-900">Cobros y renovaciones coordinados manualmente.</p>
            </div>
          </div>
          <div className="mx-auto mt-7 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
            <p className="text-lg font-extrabold text-amber-950">15 días de prueba gratuita</p>
            <p className="mt-1 text-sm text-amber-900">Disponible para comercios seleccionados durante el lanzamiento.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow="Preguntas frecuentes" title="Todo lo que necesitás saber" />
          <div className="mt-10 space-y-3">
            {QUESTIONS.map(({ question, answer }) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-emerald-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{question}</span><ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="bg-emerald-700 px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <PackageCheck className="mb-6 h-12 w-12 text-emerald-200" aria-hidden="true" />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Empezá a escuchar después de cada entrega.</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-50 sm:text-lg">
            Sumá un paso simple a tus ventas por WhatsApp. Tu comercio puede empezar a recopilar opiniones sin cambiar su forma de trabajar.
          </p>
          {phoneConfigured ? (
            <div className="mt-8"><WhatsAppButton href={contactHref} enabled light label="Solicitar prueba de 15 días" /></div>
          ) : (
            <div className="mt-8 rounded-xl border border-white/25 bg-white/10 px-5 py-4 text-sm text-white">
              El canal comercial de WhatsApp estará disponible próximamente.
            </div>
          )}
          <p className="mt-4 text-xs text-emerald-100">La activación se coordina manualmente. No se realizan cobros automáticos desde esta página.</p>
        </div>
      </section>

      <footer className="bg-[#081426] px-5 py-8 text-center text-sm text-slate-400 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© 2026 CuantoEs Califica · Opiniones para mejorar.</p>
          <Link href="/" className="text-slate-300 underline-offset-4 hover:text-white hover:underline">Conocer CuantoEs.com.py</Link>
        </div>
        <p className="mx-auto mt-5 max-w-4xl text-xs leading-5 text-slate-500">
          Califica recoge opiniones privadas y no verifica que cada respuesta corresponda a una compra real. Las decisiones de mejora corresponden a cada comercio.
        </p>
      </footer>
    </main>
  );
}
