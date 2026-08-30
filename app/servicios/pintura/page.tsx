'use client';
import React, { useState } from 'react';
import { PaintBucket, Info, ChevronRight, CheckCircle2, Calculator, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PinturaPage() {
  const [m2, setM2] = useState('');
  const [tipo, setTipo] = useState('interior');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const calcular = () => {
    setLoading(true);
    const metros = parseFloat(m2);
    
    // Simulamos una carga para dar sensación de "procesando datos reales"
    setTimeout(() => {
        if (!metros) {
            alert("Ingresá los m2 para calcular");
            setLoading(false);
            return;
        }

        const precioM2 = tipo === 'interior' ? 18000 : 26000;
        const materialesEst = metros * 13500;
        const manoObra = metros * precioM2;

        setResultado({
            total: manoObra + materialesEst,
            manoObra,
            materiales: materialesEst
        });
        setLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER / BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver al inicio
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* COLUMNA IZQUIERDA: TEXTO E INFO */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full">
              <PaintBucket className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Hogar y Construcción</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter leading-none">
              ¿Cuánto cuesta <br/> <span className="text-blue-600 italic">pintar hoy?</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Calculá un presupuesto honesto basado en los precios actuales del mercado paraguayo para mano de obra y materiales.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 space-y-6">
            <div className="flex items-center gap-3 text-blue-700">
                <Info className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-widest">¿Qué estamos calculando?</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { t: "Mano de Obra", d: "Precio promedio por m2 en Gran Asunción." },
                    { t: "Materiales", d: "Estimado de pintura látex, lijas y sellador." },
                    { t: "Preparación", d: "Limpieza básica y primera mano de base." },
                    { t: "Herramientas", d: "Pinceles, rodillos y bandejas necesarias." }
                ].map((item, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-[11px] font-black text-blue-900 uppercase">{item.t}</p>
                        <p className="text-[10px] text-blue-700 leading-tight opacity-70 font-medium">{item.d}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: CALCULADORA */}
        <div className="sticky top-24">
          <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 space-y-8">
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Superficie a pintar (m2)</label>
                <div className="flex items-baseline gap-2">
                    <input 
                        type="number" 
                        inputMode="numeric"
                        value={m2}
                        onChange={(e) => setM2(e.target.value)}
                        placeholder="0" 
                        className="bg-transparent w-full outline-none font-[900] text-5xl text-slate-800 placeholder:text-slate-200" 
                    />
                    <span className="text-xl font-black text-slate-300">m²</span>
                </div>
              </div>

              <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                {['interior', 'exterior'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={calcular}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
              <span className="uppercase tracking-widest text-xs">Calcular ahora</span>
            </button>

            {/* RESULTADO DINÁMICO */}
            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Presupuesto Estimado</p>
                    <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                        Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Mano de obra</p>
                        <p className="text-sm font-black text-slate-700">Gs. {new Intl.NumberFormat('es-PY').format(resultado.manoObra)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Materiales est.</p>
                        <p className="text-sm font-black text-slate-700">Gs. {new Intl.NumberFormat('es-PY').format(resultado.materiales)}</p>
                    </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group">
                  <span className="uppercase tracking-widest text-xs">Solicitar Pintor verificado</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}