'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { 
  Search, ChevronRight, Calculator, Wrench, ShieldAlert, 
  Truck, PaintBucket, Wind, Package, Sparkles, Beef, 
  Droplets, Zap, Sparkle, Hammer, UserPlus, ArrowUpRight,
  Info // <--- Import del icono Info agregado aquí
} from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // 8 SERVICIOS: 4 arriba y 4 abajo en Desktop
  const categories = [
    { name: 'Pintura', sub: 'Casas y Fachadas', Icon: PaintBucket, color: 'bg-orange-500', href: '/costos/pintura' },
    { name: 'Aire Split', sub: 'Colocación y Limpieza', Icon: Wind, color: 'bg-sky-500', href: '/costos/aire' },
    { name: 'Fletes', sub: 'Mudanzas y Cargas', Icon: Truck, color: 'bg-emerald-500', href: '/costos/fletes' },
    { name: 'Asado', sub: 'Parrilleros a Domicilio', Icon: Beef, color: 'bg-red-500', href: '/costos/asado' },
    { name: 'Plomería', sub: 'Destranques y Fugas', Icon: Droplets, color: 'bg-blue-600', href: '/costos/plomeria' },
    { name: 'Electricidad', sub: 'Tableros y Cableado', Icon: Zap, color: 'bg-amber-500', href: '/costos/electricidad' },
    { name: 'Limpieza', sub: 'Hogar y Fin de Obra', Icon: Sparkle, color: 'bg-teal-500', href: '/costos/limpieza' },
    { name: 'Albañilería', sub: 'Murallas y Reformas', Icon: Hammer, color: 'bg-stone-600', href: '/costos/albanileria' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.toLowerCase().trim();
    if (!q) return;

    if (q.includes('pinto') || q.includes('pintar') || q.includes('pared') || q.includes('fachada')) {
      router.push('/costos/pintura');
    } else if (q.includes('aire') || q.includes('split') || q.includes('clima') || q.includes('acondicionador') || q.includes('btu')) {
      router.push('/costos/aire');
    } else if (q.includes('flete') || q.includes('mudan') || q.includes('camion') || q.includes('traslado')) {
      router.push('/costos/fletes');
    } else if (q.includes('asado') || q.includes('parri') || q.includes('carne') || q.includes('asador')) {
      router.push('/costos/asado');
    } else if (q.includes('plomer') || q.includes('agua') || q.includes('fuga') || q.includes('cano') || q.includes('caño') || q.includes('destranq') || q.includes('termo')) {
      router.push('/costos/plomeria');
    } else if (q.includes('electr') || q.includes('luz') || q.includes('cable') || q.includes('tablero') || q.includes('enchufe') || q.includes('corto')) {
      router.push('/costos/electricidad');
    } else if (q.includes('limp') || q.includes('aseo') || q.includes('limpieza') || q.includes('obra')) {
      router.push('/costos/limpieza');
    } else if (q.includes('albañil') || q.includes('albanil') || q.includes('muro') || q.includes('muralla') || q.includes('revoque') || q.includes('piso') || q.includes('techo')) {
      router.push('/costos/albanileria');
    } else {
      alert("No encontramos ese término exacto. Probá buscando: pintura, aire, flete, asado, plomería, electricidad, limpieza o albañilería.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-[#0A0F1D] py-20 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-[900] uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
            <Sparkles className="w-3 h-3" /> Transparencia en Precios del Mercado
          </div>
          
          <h1 className="text-4xl md:text-7xl font-[900] text-white tracking-tighter leading-none">
            ¿Cuánto se paga <br/> <span className="text-blue-500 italic font-black text-3xl md:text-7xl leading-tight">por un trabajo hoy?</span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed italic text-pretty">
            "La referencia independiente para presupuestar mano de obra y materiales en Paraguay. Sin sorpresas, sin adivinanzas."
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 mt-8">
            <div className="flex items-center flex-1 px-4 gap-3 w-full text-slate-700">
              <Search className="w-5 h-5 text-slate-300" />
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué trabajo necesitás presupuestar? (ej: pintar sala, cambiar disyuntor...)" 
                className="w-full py-3 outline-none font-bold placeholder:text-slate-300 text-sm"
              />
            </div>
            <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl md:rounded-full font-[900] text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-900/40">
              Consultar
            </button>
          </form>
        </div>
      </section>

      {/* CATEGORÍAS EN GRILLA */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={cat.href} 
              className="bg-white p-5 md:p-6 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center gap-3 hover:translate-y-[-6px] hover:shadow-2xl transition-all group active:scale-95"
            >
              <div className={`${cat.color} p-4 rounded-2xl text-white shadow-md group-hover:rotate-6 transition-transform`}>
                <cat.Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs md:text-sm font-[900] text-slate-900 uppercase tracking-tight block">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 font-bold leading-tight block mt-0.5">
                  {cat.sub}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN B2B - SUMAR PROFESIONALES */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-slate-100">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              Para Profesionales y Contratistas
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter leading-none uppercase">
              ¿Hacés alguno <br/> <span className="text-blue-600 italic">de estos trabajos?</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed italic">
              Unite a la red de profesionales de CuantoEs. Recibí solicitudes directas de clientes en tu ciudad que ya conocen los precios estimados del mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              
              {/* CAMBIO AQUÍ: Link directo al Google Form */}
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSddkD8aKJxoljsdkTLJDwOM57AqGUzi2ppVQAtXSvi6DM1kAA/viewform?usp=publish-editor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-[900] text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4 text-blue-400" /> Registrarme como Profesional
              </a>
              
              {/* Botón a Metodología */}
              <Link 
                href="/metodologia" 
                className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-[900] text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-95 transition-all"
              >
                <Info className="w-4 h-4 text-slate-400" /> Metodología de Precios
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Sparkles className="w-5 h-5" /></div>
              <div>
                <h4 className="font-black text-slate-800 text-sm uppercase">Presencia Digital Inmediata</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">Aparecé como técnico recomendado en la calculadora de tu zona.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start gap-4 ml-0 md:ml-8">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><ArrowUpRight className="w-5 h-5" /></div>
              <div>
                <h4 className="font-black text-slate-800 text-sm uppercase">Clientes con Presupuesto Real</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">El cliente ya calculó el estimado antes de contactarte. Cero regateo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}