'use client';
import Header from '@/components/Header';
import BenefitList from '@/components/BenefitList';
import Calculator from '@/components/Calculator';
import Footer from '@/components/Footer';
import { Sparkles, UserCheck, Receipt, Share2, ShieldCheck } from 'lucide-react';


export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-10">
       
      <div className="max-w-md w-full">
        
        {/* CABECERA */}
        <Header />

        {/* MANUAL DE USO CON NOTA DE PRIVACIDAD */}
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-[2rem] mb-6 shadow-sm shadow-blue-50">
            <h3 className="text-blue-900 text-[10px] font-[800] uppercase tracking-widest mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> ¡Tranqui, es muy fácil!
            </h3>
            
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-200 p-2 rounded-xl shrink-0"><UserCheck className="w-4 h-4 text-blue-700" /></div>
                    <p className="text-[11px] font-semibold text-blue-800 leading-tight tracking-tight">Poné tus datos para recibir la transferencia.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-blue-200 p-2 rounded-xl shrink-0"><Receipt className="w-4 h-4 text-blue-700" /></div>
                    <p className="text-[11px] font-semibold text-blue-800 leading-tight tracking-tight">Qué se compró y entre cuántos estan.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-blue-200 p-2 rounded-xl shrink-0"><Share2 className="w-4 h-4 text-blue-700" /></div>
                    <p className="text-[11px] font-semibold text-blue-800 leading-tight tracking-tight">¡Listo! Pasa el resumen al grupo.</p>
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