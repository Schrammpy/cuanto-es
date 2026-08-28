'use client';
import React, { useState } from 'react';
import { PaintBucket, Info, Send, ChevronRight, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PinturaPage() {
  const [m2, setM2] = useState('');
  const [tipo, setTipo] = useState('interior');
  const [resultado, setResultado] = useState<any>(null);

  const calcular = () => {
    const metros = parseFloat(m2);
    if (!metros) return alert("Ingresá los m2 para calcular");

    // Lógica de precios (Esto luego lo traerás de Supabase)
    const precioM2 = tipo === 'interior' ? 18000 : 25000;
    const materialesEst = metros * 12000;
    const manoObra = metros * precioM2;

    setResultado({
      total: manoObra + materialesEst,
      manoObra,
      materiales: materialesEst
    });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-20">
      <div className="max-w-md w-full space-y-6 pt-4">
        
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-orange-600">
            <PaintBucket className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Construcción y Hogar</span>
          </div>
          <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter leading-none">
            ¿Cuánto cuesta <br/> <span className="text-blue-600 italic font-black">pintar mi casa?</span>
          </h1>
        </header>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase mb-2">Metros cuadrados aprox. (m2)</span>
              <input 
                type="number" 
                value={m2}
                onChange={(e) => setM2(e.target.value)}
                placeholder="Ej: 50" 
                className="bg-transparent w-full outline-none font-black text-2xl text-slate-800" 
              />
            </div>

            <div className="flex gap-2">
              {['interior', 'exterior'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tipo === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={calcular}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-all shadow-xl"
          >
            CALCULAR PRESUPUESTO ESTIMADO
          </button>

          {resultado && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-[2rem] text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Gasto Estimado Total</p>
                <p className="text-3xl font-black text-emerald-700 italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                <p className="text-[9px] text-emerald-500 font-bold mt-2 italic">* Incluye materiales y mano de obra básica</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Mano de Obra</p>
                    <p className="text-sm font-black text-slate-700">Gs. {new Intl.NumberFormat('es-PY').format(resultado.manoObra)}</p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Materiales est.</p>
                    <p className="text-sm font-black text-slate-700">Gs. {new Intl.NumberFormat('es-PY').format(resultado.materiales)}</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <span>SOLICITAR PRESUPUESTO REAL</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* INFO EDUCACIONAL */}
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-700">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">¿Qué influye en el precio?</span>
            </div>
            <ul className="space-y-3">
                {[
                    "Estado de las paredes (humedad, grietas).",
                    "Calidad de la pintura elegida.",
                    "Altura del techo (requiere andamios).",
                    "Si incluye o no el enduído y lijado."
                ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-blue-800 leading-tight">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" /> {txt}
                    </li>
                ))}
            </ul>
        </div>

        <Footer />
      </div>
    </main>
  );
}