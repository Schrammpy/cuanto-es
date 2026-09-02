'use client';
import React, { useState } from 'react';
import { Wind, Info, ChevronRight, CheckCircle2, Calculator, ArrowLeft, Loader2, User, Phone, MapPin, X, Check, Send, ThermometerSnowflake } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadAire } from './action';

export default function AirePage() {
  const [btu, setBtu] = useState('12000');
  const [tipo, setTipo] = useState('instalacion');
  const [cantidad, setCantidad] = useState(1);
  const [metrosExtra, setMetrosExtra] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioBase = 0;
        if (tipo === 'instalacion') {
            if (btu === '12000') precioBase = 400000;
            else if (btu === '18000') precioBase = 600000;
            else precioBase = 850000;
        } else {
            precioBase = 180000; // Mantenimiento
        }

        const subtotal = (precioBase * cantidad);
        const adicionalMetros = metrosExtra * 85000;
        const total = subtotal + adicionalMetros;

        // Descuento por cantidad (10% si son más de 2 aires)
        const descuento = cantidad > 2 ? total * 0.10 : 0;

        setResultado({ 
            total: total - descuento, 
            descuento, 
            perUnit: precioBase,
            btu,
            tipo,
            cantidad
        });
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
        detalles: { ...resultado, total: new Intl.NumberFormat('es-PY').format(resultado.total) }
    };
    const res = await enviarLeadAire(data);
    if (res.success) {
        setLeadSent(true);
        setTimeout(() => { setShowForm(false); setLeadSent(false); }, 3000);
    }
    setFormLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 pt-8 text-slate-700">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Inicio
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* INFO */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full">
              <ThermometerSnowflake className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Climatización</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter leading-none">
              ¿Cuánto sale poner <br/> <span className="text-blue-600 italic font-black">un aire hoy?</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                Calculá el costo de instalación o mantenimiento para tu casa u oficina.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 space-y-4">
            <h3 className="text-sm font-black uppercase text-blue-700">Factores que varían el precio:</h3>
            <ul className="space-y-3">
                {[
                    "Carga de gas refrigerante (si hace falta).",
                    "Metros adicionales de cañería de cobre.",
                    "Soportes para unidad externa en altura.",
                    "Instalación eléctrica desde el tablero."
                ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-blue-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {txt}
                    </li>
                ))}
            </ul>
          </div>
        </div>

        {/* CALCULADORA */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100 space-y-8 sticky top-24">
            <div className="space-y-6">
              {/* TIPO DE SERVICIO */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                {['instalacion', 'mantenimiento'].map((t) => (
                  <button key={t} onClick={() => setTipo(t)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                    {t === 'aire' ? 'Instalación' : t}
                  </button>
                ))}
              </div>

              {/* CAPACIDAD BTU */}
              <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Capacidad del equipo</label>
                  <div className="grid grid-cols-3 gap-2 text-slate-700">
                    {['12000', '18000', '24000'].map(val => (
                        <button key={val} onClick={() => setBtu(val)} className={`py-3 rounded-xl text-[10px] font-black border-2 transition-all ${btu === val ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>
                            {val} BTU
                        </button>
                    ))}
                  </div>
              </div>

              {/* CANTIDAD */}
              <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center text-slate-700">
                <span className="text-[10px] font-black text-slate-400 uppercase">Cantidad de Equipos</span>
                <div className="flex items-center gap-4">
                    <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold">-</button>
                    <span className="font-black text-xl">{cantidad}</span>
                    <button onClick={() => setCantidad(cantidad + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold">+</button>
                </div>
              </div>
            </div>

            <button onClick={calcular} disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
              Calcular presupuesto
            </button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Gasto Estimado Total</p>
                    <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic leading-none">
                        Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                    </p>
                    {resultado.descuento > 0 && <p className="text-[10px] text-orange-500 font-bold mt-2 italic animate-pulse">¡Incluye descuento por cantidad!</p>}
                </div>

                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group">
                  <span className="uppercase tracking-widest text-xs font-black">Solicitar Técnico Verificado</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
        </div>
      </section>

      {/* MODAL LEAD (Reutilizado del de Pintura) */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
            <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl text-slate-700">
                <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
                {leadSent ? (
                    <div className="text-center py-10 space-y-4">
                        <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center"><Check className="w-8 h-8" /></div>
                        <h3 className="text-xl font-black uppercase tracking-tighter italic">¡Pedido enviado!</h3>
                        <p className="text-sm text-slate-500 font-medium">Un técnico te contactará pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-6">
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">Presupuesto Real</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recibí presupuestos de técnicos pro</p>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100"><User className="w-4 h-4 text-slate-300 mr-3" /><input name="nombre" required placeholder="Nombre y Apellido" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" /></div>
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100"><Phone className="w-4 h-4 text-slate-300 mr-3" /><input name="telefono" required type="tel" placeholder="Nro de Teléfono" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" /></div>
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100"><MapPin className="w-4 h-4 text-slate-300 mr-3" /><input name="ciudad" required placeholder="Ciudad" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" /></div>
                        </div>
                        <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
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