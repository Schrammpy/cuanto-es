'use client';
import React, { useState } from 'react';
import { PaintBucket, Info, ChevronRight, CheckCircle2, Calculator, ArrowLeft, Loader2, User, Phone, MapPin, X, Check } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadPintura } from './action';

export default function PinturaPage() {
  const [m2, setM2] = useState('');
  const [tipo, setTipo] = useState('interior');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Estados para el Formulario de Lead
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
    }, 600);
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
    } else {
        alert(res.message);
    }
    setFormLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver al inicio
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="space-y-4 text-slate-700">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full">
              <PaintBucket className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Construcción</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter leading-none">
              ¿Cuánto cuesta <br/> <span className="text-blue-600 italic font-black">pintar hoy?</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                Calculá un presupuesto real de mano de obra y materiales. Sin vueltas.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 space-y-6">
            <div className="flex items-center gap-3 text-blue-700">
                <Info className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-widest leading-none">¿Qué incluye el cálculo?</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Pintura Látex Pro", "Lijado y Limpieza", "2 manos de pintura", "Protección de pisos"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-blue-800">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" /> {item}
                    </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100 space-y-8 sticky top-24">
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Superficie a pintar (m2)</label>
                <div className="flex items-baseline gap-2">
                    <input type="number" inputMode="numeric" value={m2} onChange={(e) => setM2(e.target.value)} placeholder="0" className="bg-transparent w-full outline-none font-[900] text-5xl text-slate-800 placeholder:text-slate-200" />
                    <span className="text-xl font-black text-slate-300 uppercase">m²</span>
                </div>
              </div>

              <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                {['interior', 'exterior'].map((t) => (
                  <button key={t} onClick={() => setTipo(t)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={calcular} disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
              Calcular presupuesto
            </button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Gasto Estimado</p>
                    <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic leading-none">
                        Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                    </p>
                </div>

                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <span className="uppercase tracking-widest text-xs font-black leading-none">Solicitar Pintor Verificado</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
        </div>
      </section>

      {/* MODAL DEL FORMULARIO DE CONTACTO */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
            <div className="bg-white rounded-[3rem] p-8 md:p-10 w-full max-w-sm relative z-10 shadow-2xl">
                <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600"><X /></button>
                
                {leadSent ? (
                    <div className="text-center py-10 space-y-4">
                        <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center"><Check className="w-8 h-8" /></div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">¡Pedido enviado!</h3>
                        <p className="text-sm text-slate-500 font-medium">Un profesional te contactará a la brevedad.</p>
                    </div>
                ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-6">
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Presupuesto Real</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Dejanos tus datos para conectar con un pintor</p>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100">
                                <User className="w-4 h-4 text-slate-300 mr-3" />
                                <input name="nombre" required placeholder="Nombre y Apellido" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" />
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100">
                                <Phone className="w-4 h-4 text-slate-300 mr-3" />
                                <input name="telefono" required type="tel" placeholder="Nro de Teléfono" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" />
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100">
                                <MapPin className="w-4 h-4 text-slate-300 mr-3" />
                                <input name="ciudad" required placeholder="Ciudad" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" />
                            </div>
                        </div>

                        <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest">
                            {formLoading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Enviar Solicitud</>}
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