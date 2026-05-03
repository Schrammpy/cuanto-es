'use client';
import React from 'react';
import Link from 'next/link';
import BenefitList from '@/components/BenefitList';
import { Calculator, Wrench, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const tools = [
    {
      name: 'Dividir Gastos',
      desc: 'Para el asado, el fútbol o la cena entre amigos.',
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      href: '/divisor',
      color: 'bg-blue-50',
    },
    {
      name: 'Presupuestos',
      desc: 'Genera Presupuestos Pro para tus clientes de forma sencilla.',
      icon: <Wrench className="w-6 h-6 text-orange-600" />,
      href: '/presupuesto',
      color: 'bg-orange-50',
    },
    {
      name: 'Multas Py',
      desc: 'Conocé los costos de infracciones de tránsito.',
      icon: <ShieldAlert className="w-6 h-6 text-red-600" />,
      href: '/multas',
      color: 'bg-red-50',
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 pt-4">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Sparkles className="w-3 h-3" /> ¡Nuevas herramientas!
            </div>
            <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter">
                ¿Qué vamos a <br/> <span className="text-blue-600 italic">calcular hoy?</span>
            </h1>
            <p className="text-xs font-medium text-slate-400 px-8 leading-relaxed">
                Elegí la herramienta que necesitás. Rápido, gratis y fácil de compartir.
            </p>
        </section>

        {/* GRID DE HERRAMIENTAS */}
        <div className="grid grid-cols-1 gap-4">
            {tools.map((tool, i) => (
                <Link 
                    key={i} 
                    href={tool.href}
                    className="group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 active:scale-95 transition-all hover:border-blue-200"
                >
                    <div className={`${tool.color} p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                        {tool.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-[800] text-slate-800 text-sm uppercase tracking-tight">{tool.name}</h3>
                        <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">{tool.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-400 transition-colors" />
                </Link>
            ))}
        </div>

        {/* SECCIÓN DE BENEFICIOS (Para mantener el enganche diario) */}
        <BenefitList />

      </div>
    </main>
  );
}