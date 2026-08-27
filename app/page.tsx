'use client';
import React from 'react';
import Link from 'next/link';
import BenefitList from '@/components/BenefitList';
import Footer from '@/components/Footer';
import { 
  Search, Sparkles, ChevronRight, Calculator, Wrench, 
  ShieldAlert, Truck, PaintBucket, Wind, Package 
} from 'lucide-react';

export default function Home() {
  // Guardamos la referencia al componente, no el JSX armado
  const categories = [
    { name: 'Pintura', Icon: PaintBucket, color: 'bg-orange-500', href: '/servicios/pintura' },
    { name: 'Aire Ac.', Icon: Wind, color: 'bg-blue-400', href: '/servicios/aire' },
    { name: 'Mudanzas', Icon: Package, color: 'bg-emerald-500', href: '/servicios/fletes' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-slate-900 py-16 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-[900] text-white tracking-tighter leading-none">
            ¿Cuánto cuesta esto <br/> en <span className="text-blue-500 italic">Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Precios actualizados de servicios, construcción y trámites. Calculá tu presupuesto y conectá con profesionales.
          </p>

          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 mt-8">
            <div className="flex items-center flex-1 px-4 gap-3 w-full">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                placeholder="Ej: Pintar una pieza de 4x4..." 
                className="w-full py-3 outline-none text-slate-700 font-bold"
              />
            </div>
            <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl md:rounded-full font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
              Consultar
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS RÁPIDAS */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} className="bg-white p-4 md:p-6 rounded-[2rem] shadow-xl border border-slate-50 flex flex-col items-center gap-3 hover:translate-y-[-5px] transition-all group">
              <div className={`${cat.color} p-3 rounded-2xl text-white group-hover:rotate-6 transition-transform`}>
                {/* Renderizamos el componente directamente con sus props */}
                <cat.Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* HERRAMIENTAS */}
      <section className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-16 items-center text-slate-700">
        <div>
          <h2 className="text-3xl md:text-4xl font-[900] text-slate-800 tracking-tighter leading-none mb-6 uppercase">
            Herramientas de <br/> <span className="text-blue-600 italic">uso diario</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed mb-10">
            Las soluciones rápidas que ya conocés, ahora integradas en un solo lugar. Gratis, rápido y optimizado para todo dispositivo.
          </p>
          <div className="grid gap-4">
            {[
              { name: 'Dividir Gastos', href: '/divisor', icon: Calculator, color: 'text-blue-600' },
              { name: 'Multas de Tránsito', href: '/multas', icon: ShieldAlert, color: 'text-red-600' },
              { name: 'Delivery Business', href: '/delivery/crear', icon: Truck, color: 'text-emerald-600' },
            ].map(tool => (
              <Link key={tool.href} href={tool.href} className="bg-slate-50 p-5 rounded-[1.5rem] flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-slate-100 border border-transparent transition-all group">
                <div className="flex items-center gap-4">
                  <tool.icon className={`${tool.color} w-6 h-6`} />
                  <span className="font-bold text-slate-700">{tool.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
        
        {/* MOCKUP VISUAL */}
        <div className="hidden md:block bg-blue-600 rounded-[4rem] h-[450px] shadow-2xl shadow-blue-200 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-900 flex items-center justify-center p-12">
              <Calculator className="w-48 h-48 text-white/10 scale-150 rotate-12 absolute -top-10 -right-10" />
              <div className="relative z-10 text-white space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                  <p className="text-4xl font-black italic uppercase leading-none">CuantoEs.py</p>
                  <p className="text-xs font-bold opacity-60 uppercase tracking-[0.3em] mt-2">Calculadora Social</p>
                </div>
                <p className="text-sm font-medium opacity-80 max-w-xs leading-relaxed italic">
                  "La forma más rápida de organizar los gastos del asado o el fútbol con tus socios."
                </p>
              </div>
           </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <BenefitList />
      </div>

      <Footer />
    </main>
  );
}