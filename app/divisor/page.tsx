'use client';

import BenefitList from '@/components/BenefitList';
import Calculator from '@/components/Calculator';
import Footer from '@/components/Footer';
import { Sparkles, UserCheck, Receipt, Share2, ShieldCheck } from 'lucide-react';


export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-10">
       
      <div className="max-w-md w-full space-y-6">
        
        {/* NUEVO TÍTULO IGUAL AL DE PRESUPUESTO */}
        <header className="text-center space-y-1">
            <h1 className="text-2xl font-[900] text-slate-800 tracking-tighter uppercase leading-none">
                Dividir <span className="text-blue-600 italic">Gastos</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Cuentas claras entre todos</p>
        </header>
        {/* MANUAL DE USO - DIVISOR */}
<div className="bg-blue-50 border border-blue-100 p-5 rounded-[2rem] shadow-sm mb-8">
    <h3 className="text-blue-900 text-[10px] font-[800] uppercase tracking-widest mb-5 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-600" /> ¡Cero estrés, es muy fácil!
    </h3>
    <div className="space-y-4 text-slate-700">
        <div className="flex items-center gap-4">
            <div className="bg-blue-200 p-2 rounded-xl shrink-0"><UserCheck className="w-4 h-4 text-blue-700" /></div>
            <p className="text-[11px] font-semibold leading-tight">Poné tus datos para recibir la transferencia.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-blue-200 p-2 rounded-xl shrink-0"><Receipt className="w-4 h-4 text-blue-700" /></div>
            <p className="text-[11px] font-semibold leading-tight">Cargá qué se compró y entre cuántos dividen.</p>
        </div>
        <div className="flex items-center gap-4 text-blue-700">
            <div className="bg-blue-600 p-2 rounded-xl shrink-0 text-white shadow-md shadow-blue-100"><Share2 className="w-4 h-4" /></div>
            <p className="text-[11px] font-[800] leading-tight">¡Listo! Generá un resumen perfecto para el grupo de WhatsApp.</p>
        </div>
        
    </div>
</div>

        {/* COMPONENTE CALCULADORA */}
        <Calculator />

        {/* LISTA DE BENEFICIOS DEL DÍA */}
        <BenefitList />

        {/* FOOTER CON GRATITUD Y SEGURIDAD */}
        <Footer />

      </div>
    </main>
  );
}