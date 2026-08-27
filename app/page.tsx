'use client';
import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Search, ChevronRight, Calculator, Wrench, ShieldAlert, Truck, PaintBucket, Wind, Package, Sparkles } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Pintura', Icon: PaintBucket, color: 'bg-orange-500', href: '/servicios/pintura' },
    { name: 'Aire Ac.', Icon: Wind, color: 'bg-blue-400', href: '/servicios/aire' },
    { name: 'Mudanzas', Icon: Package, color: 'bg-emerald-500', href: '/servicios/fletes' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-slate-900 py-20 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-8 text-slate-700">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm shadow-blue-500/10">
            <Sparkles className="w-3 h-3" /> El índice de precios de Paraguay
          </div>
          
          <h1 className="text-4xl md:text-7xl font-[900] text-white tracking-tighter leading-none">
            ¿Cuánto cuesta <br/> un <span className="text-blue-600 italic font-black">servicio hoy?</span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed italic">
            "Eliminamos las adivinanzas. Calculá presupuestos reales de mano de obra y materiales en segundos."
          </p>

          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 mt-8">
            <div className="flex items-center flex-1 px-4 gap-3 w-full">
              <Search className="w-5 h-5 text-slate-300" />
              <input 
                placeholder="Ej: Pintar fachada de casa..." 
                className="w-full py-3 outline-none text-slate-700 font-bold placeholder:text-slate-300"
              />
            </div>
            <button className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl md:rounded-full font-[900] text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-900/50">
              Consultar
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
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

      {/* HERRAMIENTAS */}
      <section className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter leading-none mb-4 uppercase">
              Soluciones <br/> <span className="text-blue-600 italic text-2xl md:text-3xl font-[900]">de bolsillo</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed italic">
                Nuestras herramientas clásicas siguen aquí para facilitarte el día a día.
            </p>
          </div>
          
          <div className="grid gap-4">
            {[
              { name: 'Dividir Gastos del Grupo', href: '/divisor', icon: Calculator, color: 'text-blue-600' },
              { name: 'Calculadora de Multas Py', href: '/multas', icon: ShieldAlert, color: 'text-red-600' },
              { name: 'SaaS Business para Delivery', href: '/delivery/crear', icon: Truck, color: 'text-emerald-600' },
            ].map(tool => (
              <Link key={tool.href} href={tool.href} className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white hover:shadow-xl border border-transparent hover:border-slate-100 transition-all group">
                <div className="flex items-center gap-5">
                  <tool.icon className={`${tool.color} w-7 h-7`} />
                  <span className="font-black text-slate-700 text-sm uppercase tracking-tight">{tool.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
        
        {/* PANEL DERECHA */}
        <div className="hidden md:block bg-slate-900 rounded-[4rem] h-[500px] shadow-3xl relative overflow-hidden p-12">
            <div className="relative z-10 space-y-6">
                <div className="bg-blue-600 w-16 h-1 mb-8"></div>
                <h3 className="text-4xl font-black text-white leading-tight tracking-tighter italic">Transformamos datos en decisiones.</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Accedé a la base de datos de precios más grande del país. Información verificada para que nunca más pagues de más.
                </p>
                <div className="pt-8 grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-3xl font-[900] text-white tracking-tighter leading-none">100%</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Hecho en Paraguay</p>
                    </div>
                    <div>
                        <p className="text-3xl font-[900] text-white tracking-tighter leading-none">Gratis</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Para siempre</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}