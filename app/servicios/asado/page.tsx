'use client';
import React, { useState } from 'react';
import { 
  Beef, Info, ChevronRight, CheckCircle2, 
  Calculator, ArrowLeft, Loader2, User, Phone, 
  MapPin, X, Check, Send, Users, Flame
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadAsado } from './action';



export default function AsadoPage() {
  const [personas, setPersonas] = useState(10);
  const [tipo, setTipo] = useState('completo'); // solo_mano, completo, premium
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioPersona = 0;
        let baseFija = 0;

        if (tipo === 'solo_mano') {
            baseFija = personas > 20 ? 500000 : 300000;
        } else if (tipo === 'completo') {
            precioPersona = 75000;
        } else {
            precioPersona = 110000;
        }

        const total = baseFija + (precioPersona * personas);

        setResultado({ 
            total, 
            perUnit: precioPersona,
            baseFija,
            personas,
            tipo
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
    const res = await enviarLeadAsado(data);
    if (res.success) {
        setLeadSent(true);
        setTimeout(() => { setShowForm(false); setLeadSent(false); }, 3000);
    }
    setFormLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-700">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Inicio
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full">
              <Beef className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gastronomía y Eventos</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter leading-none">
              ¿Cuánto sale <br/> <span className="text-blue-600 italic font-black">un asadacho?</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                Calculá el presupuesto para tu evento. Desde el parrillero solo hasta el servicio completo con todo incluido.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 space-y-4">
            <h3 className="text-sm font-black uppercase text-blue-700">El servicio incluye:</h3>
            <ul className="space-y-3">
                {[
                    "Parrillero profesional y ayudante.",
                    "Carne de exportación (según el plan).",
                    "Guarniciones: Sopa, Chipa Guazú, Mandioca y Ensaladas.",
                    "Vajilla y cubiertos (opcional)."
                ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-blue-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {txt}
                    </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100 space-y-8 sticky top-24">
            <div className="space-y-6">
              
              <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de Servicio</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                        { id: 'solo_mano', label: 'Solo Parrillero', desc: 'Vos ponés la carne, nosotros el fuego.' },
                        { id: 'completo', label: 'Asado Tradicional', desc: 'Carne, sopa y guarniciones incluidas.' },
                        { id: 'premium', label: 'Cortes Premium', desc: 'Picaña, Ojo de Bife y buffet gourmet.' }
                    ].map(item => (
                        <button key={item.id} onClick={() => setTipo(item.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${tipo === item.id ? 'border-blue-600 bg-blue-50' : 'border-slate-50'}`}>
                            <div className={`p-2 rounded-xl ${tipo === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <Flame className="w-4 h-4" />
                            </div>
                            <div>
                                <p className={`text-xs font-black uppercase ${tipo === item.id ? 'text-blue-600' : 'text-slate-700'}`}>{item.label}</p>
                                <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{item.desc}</p>
                            </div>
                        </button>
                    ))}
                  </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Invitados</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Cantidad de personas</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setPersonas(Math.max(5, personas - 5))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">-</button>
                    <span className="font-black text-xl text-slate-800">{personas}</span>
                    <button onClick={() => setPersonas(personas + 5)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">+</button>
                </div>
              </div>
            </div>

            <button onClick={calcular} disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
              Calcular presupuesto
            </button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Presupuesto Estimado Total</p>
                    <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic leading-none">
                        Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                    </p>
                </div>
                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group">
                  <span className="uppercase tracking-widest text-xs font-black">Solicitar Parrillero Verificado</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
        </div>
      </section>
      {/* (Modal de formulario igual al anterior...) */}
      <Footer />
    </main>
  );
}