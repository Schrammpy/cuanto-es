'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { 
  Search, ChevronRight, Calculator, Wrench, ShieldAlert, 
  Truck, PaintBucket, Wind, Package, Sparkles, Beef, UserPlus, ArrowUpRight 
} from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const categories = [
    { name: 'Pintura', Icon: PaintBucket, color: 'bg-orange-500', href: '/costos/pintura' },
    { name: 'Aire Ac.', Icon: Wind, color: 'bg-blue-400', href: '/costos/aire' },
    { name: 'Mudanzas', Icon: Package, color: 'bg-emerald-500', href: '/costos/fletes' },
    { name: 'Asadacho', Icon: Beef, color: 'bg-red-500', href: '/costos/asado' }, // NUEVO
  ];

  // Lógica de búsqueda sencilla
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.toLowerCase();
    if (q.includes('pinto') || q.includes('pared')) router.push('/costos/pintura');
    else if (q.includes('aire') || q.includes('clima')) router.push('/costos/aire');
    else if (q.includes('flete') || q.includes('mudan')) router.push('/costos/fletes');
    else if (q.includes('asado') || q.includes('parri')) router.push('/costos/asado');
    else alert("Próximamente agregaremos más servicios. Probá con: Pintura, Aire, Fletes o Asado.");
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
            ¿Cuánto se paga <br/> <span className="text-blue-600 italic font-black text-3xl md:text-7xl leading-tight">por un trabajo hoy?</span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed italic text-pretty">
            "La referencia oficial para presupuestar mano de obra y materiales en Paraguay. Sin sorpresas, sin adivinanzas."
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 mt-8">
            <div className="flex items-center flex-1 px-4 gap-3 w-full text-slate-700">
              <Search className="w-5 h-5 text-slate-300" />
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué servicio estás buscando?" 
                className="w-full py-3 outline-none font-bold placeholder:text-slate-300"
              />
            </div>
            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl md:rounded-full font-[900] text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg">
              Consultar
            </button>
          </form>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} className="bg-white p-5 md:p-8 rounded-[2.5rem] shadow-2xl border border-slate-50 flex flex-col items-center gap-4 hover:translate-y-[-8px] transition-all group active:scale-95">
              <div className={`${cat.color} p-4 rounded-3xl text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                <cat.Icon className="w-8 h-8" />
              </div>
              <span className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-widest">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN B2B - SUMAR PROFESIONALES */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-slate-100">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                Para Trabajadores y Empresas
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter leading-none uppercase">
                ¿Ofrecés alguno <br/> <span className="text-blue-600 italic">de estos servicios?</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed italic">
                Unite a nuestra red de profesionales verificados. Recibí pedidos de presupuestos reales de clientes en tu zona y profesionalizá tu forma de cobrar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="https://api.whatsapp.com/send?phone=595992685363&text=Hola!%20Quiero%20formar%20parte%20de%20los%20profesionales%20de%20CuantoEs.com.py" target="_blank" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-[900] text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-200 active:scale-95 transition-all">
                    <UserPlus className="w-4 h-4" /> Registrar mi negocio
                </a>
                <Link href="/divisor" className="bg-white border-2 border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-[900] text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-95 transition-all">
                    Ver herramientas gratis
                </Link>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Sparkles className="w-5 h-5" /></div>
                <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase">Presencia Digital</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 leading-tight">Tu perfil profesional en el portal líder de costos de Paraguay.</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start gap-4 ml-0 md:ml-8">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><ArrowUpRight className="w-5 h-5" /></div>
                <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase">Leads Calificados</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 leading-tight">Recibí datos de clientes que ya saben cuánto van a gastar.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}