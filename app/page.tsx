'use client';
import React from 'react';
import Link from 'next/link';
import BenefitList from '@/components/BenefitList';
import Footer from '@/components/Footer';
import { Search, Sparkles, ChevronRight, Calculator, Wrench, ShieldAlert, Truck, Paintbucket, Wind, Package } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Pintura', icon: <Paintbucket />, color: 'bg-orange-500', href: '/servicios/pintura' },
    { name: 'Aire Ac.', icon: <Wind />, color: 'bg-blue-400', href: '/servicios/aire' },
    { name: 'Mudanzas', icon: <Package />, color: 'bg-emerald-500', href: '/servicios/fletes' },
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

          {/* BUSCADOR TIPO GOOGLE */}
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
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
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} className="bg-white p-4 md:p-6 rounded-[2rem] shadow-xl border border-slate-50 flex flex-col items-center gap-3 hover:translate-y-[-5px] transition-all">
              <div className={`${cat.color} p-3 rounded-2xl text-white`}>
                {React.cloneElement(cat.icon as React.ReactElement, { className: 'w-6 h-6' })}
              </div>
              <span className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE HERRAMIENTAS ACTUALES */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-[900] text-slate-800 tracking-tighter leading-none mb-4 uppercase">
            Herramientas de <br/> <span className="text-blue-600 italic">uso diario</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
            Las soluciones rápidas que ya conocés, ahora integradas en un solo lugar. Gratis y sin descargar apps.
          </p>
          <div className="grid gap-4">
            {[
              { name: 'Divisor de Gastos', href: '/divisor', icon: <Calculator className="text-blue-600" /> },
              { name: 'Multas de Tránsito', href: '/multas', icon: <ShieldAlert className="text-red-600" /> },
              { name: 'SaaS para Delivery', href: '/delivery/crear', icon: <Truck className="text-emerald-600" /> },
            ].map(tool => (
              <Link key={tool.href} href={tool.href} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-4">
                  {tool.icon}
                  <span className="font-bold text-slate-700">{tool.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:block bg-blue-600 rounded-[3rem] h-[400px] shadow-2xl shadow-blue-200">
           {/* Aquí podrías poner una imagen o mockup de la web en mobile */}
        </div>
      </section>

      <div className="max-w-4xl mx-auto">
        <BenefitList />
      </div>

      <Footer />
    </main>
  );
}