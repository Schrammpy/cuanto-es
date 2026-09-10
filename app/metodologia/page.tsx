'use client';
import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { ShieldCheck, Search, Users, Calculator, ArrowRight, LineChart } from 'lucide-react';

export default function MetodologiaPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      
      {/* HEADER */}
      <section className="bg-slate-900 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
            <LineChart className="w-3 h-3" /> Transparencia de Datos
          </div>
          <h1 className="text-3xl md:text-5xl font-[900] text-white tracking-tighter leading-none">
            Cómo calculamos <br/> <span className="text-blue-500 italic">nuestros precios</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl mx-auto">
            CuantoEs no es una agencia ni un contratista. Somos un índice independiente de costos de servicios en Paraguay. Así es como logramos nuestra precisión.
          </p>
        </div>
      </section>

      {/* LOS 4 PILARES */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        
        {/* PILAR 1 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-[900] tracking-tight uppercase mb-2">1. Investigación de Mercado</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Realizamos un monitoreo constante de los precios de materiales en las principales ferreterías y distribuidoras de Gran Asunción (cemento, pintura, repuestos, etc.). Esto nos permite establecer la "base dura" de cualquier presupuesto de obra.
            </p>
          </div>
        </div>

        {/* PILAR 2 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-[900] tracking-tight uppercase mb-2">2. Presupuestos Reales de la Plataforma</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Cada vez que un profesional adherido a nuestra red utiliza nuestra herramienta de "Presupuestos Pro" para enviar cotizaciones a sus clientes, el sistema registra de forma anónima los valores por unidad (ej. costo por m² o por boca de luz) para calibrar nuestros promedios locales.
            </p>
          </div>
        </div>

        {/* PILAR 3 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-[900] tracking-tight uppercase mb-2">3. Reportes Comunitarios (Crowdsourcing)</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              La calle tiene el dato final. Los usuarios de CuantoEs reportan voluntariamente cuánto pagaron recientemente por un servicio. Un algoritmo filtra los valores atípicos (precios absurdamente altos o bajos) y utiliza el promedio para actualizar el "Rango Habitual" de nuestras calculadoras.
            </p>
          </div>
        </div>

        {/* PILAR 4 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-slate-100 p-4 rounded-2xl text-slate-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-[900] tracking-tight uppercase mb-2">4. Validación y Limpieza</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              No publicamos precios con una sola fuente. Requerimos un mínimo de observaciones por categoría para mostrar un rango válido. Excluimos servicios de lujo extremo o de altísima informalidad para mantener el índice dentro de la realidad de la clase trabajadora paraguaya.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}