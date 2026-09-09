'use client';
import React, { useState } from 'react';
import { 
  PaintBucket, Check, Info, TrendingUp, Users, 
  MessageSquare, Calculator, ChevronRight, CheckCircle2, 
  Loader2, User, Phone, MapPin, X, Send, DollarSign 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadPintura, guardarPrecioReportado } from './action';

export default function PinturaPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados Calculadora
  const [m2, setM2] = useState('');
  const [tipo, setTipo] = useState('interior');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  // Estados Modal Lead (Pintor Verificado)
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Estados Modal Crowdsourcing (¿Cuánto pagaste?)
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const calcular = () => {
    setLoading(true);
    const metros = parseFloat(m2);
    setTimeout(() => {
        if (!metros) { alert("Ingresá los m2"); setLoading(false); return; }
        const precioM2 = tipo === 'interior' ? 18000 : 26000;
        const materiales = metros * 13500;
        const manoObra = metros * precioM2;
        setResultado({ total: manoObra + materiales, manoObra, materiales, m2: metros, tipo });
        setLoading(false);
    }, 500);
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        ciudad: formData.get('ciudad'),
        ...resultado
    };
    const res = await enviarLeadPintura(data);
    if (res.success) {
        setLeadSent(true);
        setTimeout(() => { setShowForm(false); setLeadSent(false); }, 3000);
    }
    setFormLoading(false);
  };

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      monto: formData.get('monto'),
      ciudad: formData.get('ciudad'),
      materiales: formData.get('materiales') === 'si',
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioReportado(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      
      {/* 1. RESUMEN DE PRECIOS INICIAL (Punto 1 y 5 de la consultoría) */}
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cuesta pintar una <span className="text-blue-500 italic">casa en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Estimaciones independientes basadas en presupuestos reales de mano de obra y materiales en Gran Asunción.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Precio Promedio</p>
              <p className="text-3xl font-black">Gs. 22.000 <span className="text-xs font-normal opacity-50">/m²</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Rango Habitual</p>
              <p className="text-3xl font-black">15k — 35k <span className="text-xs font-normal opacity-50">/m²</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certeza de Datos</p>
              <p className="text-3xl font-black text-blue-400">Alta <span className="text-xs font-normal text-slate-400">✓</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DE PRESUPUESTO INTERACTIVA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Calculator className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu caso exacto</h2>
              <p className="text-xs text-slate-400 font-medium">Ingresá los datos de tu pared o vivienda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-50 p-6 rounded-3xl border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Superficie aprox. (m²)</label>
              <div className="flex items-baseline gap-2">
                <input 
                  type="number" 
                  inputMode="numeric" 
                  value={m2} 
                  onChange={(e) => setM2(e.target.value)} 
                  placeholder="0" 
                  className="bg-transparent w-full outline-none font-[900] text-4xl text-slate-800 placeholder:text-slate-200" 
                />
                <span className="text-lg font-black text-slate-300">m²</span>
              </div>
            </div>

            <div className="flex bg-slate-100 p-2 rounded-2xl gap-2 h-full items-center">
              {['interior', 'exterior'].map((t) => (
                <button 
                  key={t} 
                  onClick={() => setTipo(t)} 
                  className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={calcular} 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
            Calcular Presupuesto
          </button>

          {/* RESULTADO Y LEAD */}
          {resultado && (
            <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Gasto Estimado Total</p>
                <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200/60 text-xs font-bold text-slate-500">
                  <span>Mano de obra: Gs. {new Intl.NumberFormat('es-PY').format(resultado.manoObra)}</span>
                  <span>•</span>
                  <span>Materiales: Gs. {new Intl.NumberFormat('es-PY').format(resultado.materiales)}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuestos a Pintores Verificados</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. KILLER FEATURE: ¿CUÁNTO PAGASTE? (Crowdsourcing / Moat) */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Ya contrataste un pintor hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Ayudá a que los precios en Paraguay sean justos y transparentes. Reportá tu costo de forma 100% anónima para actualizar el índice.
            </p>
          </div>
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest shrink-0"
          >
            Aportar mi precio
          </button>
        </div>
      </section>

      {/* 4. METODOLOGÍA (Transparencia e Independencia) */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border-t border-slate-100 pt-8 space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-4 h-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Metodología de este cálculo</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            CuantoEs es un índice independiente. No inflamos precios ni cobramos comisiones sobre los trabajos. Los valores mostrados son promedios observados que se calibran mediante encuestas directas a pintores de Asunción, Luque, San Lorenzo y Lambaré, considerando el costo estándar de la pintura látex de 18 litros y el rendimiento promedio de 10 a 12 m² por litro a dos manos.
          </p>
        </div>
      </section>

      {/* MODAL 1: PEDIR PRESUPUESTO REAL (LEAD) */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Conectaremos tu pedido con profesionales disponibles.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Recibir Presupuestos</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                </div>
                <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  {formLoading ? "Enviando..." : "Enviar a Profesionales"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CROWDSOURCING (¿CUÁNTO PAGASTE?) */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {reportSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Aporte Guardado!</p>
                <p className="text-xs text-slate-400 font-medium">Gracias por hacer más transparente el mercado paraguayo.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te costó?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad donde se hizo" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="materiales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="si">Incluyó materiales</option>
                    <option value="no">Solo mano de obra</option>
                  </select>
                  <textarea name="comentario" placeholder="Comentario breve (opcional, ej: fue rápido y limpio)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
                </div>
                <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  Guardar mi reporte
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}