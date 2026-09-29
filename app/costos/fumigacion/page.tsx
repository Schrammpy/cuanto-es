'use client';
import React, { useState } from 'react';
import { 
  Bug, Info, TrendingUp, Calculator, ChevronRight, 
  CheckCircle2, Loader2, User, Phone, MapPin, X, Send 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadFumigacion, guardarPrecioFumigacion } from './action';

export default function FumigacionPage() {
  const [m2, setM2] = useState('');
  const [tipo, setTipo] = useState('casa');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const formatGs = (num: number) => new Intl.NumberFormat('es-PY').format(Math.round(num));

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        const metros = parseFloat(m2);
        if (!metros) { alert("Ingresá los m2"); setLoading(false); return; }
        
        // Lógica simplificada de fumigación
        let base = 180000;
        if (metros > 300) base = 600000;
        else if (metros > 200) base = 420000;
        else if (metros > 100) base = 320000;
        
        setResultado({ total: base, m2: metros, tipo });
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
        detalles: { ...resultado, total: new Intl.NumberFormat('es-PY').format(resultado.total) }
    };
    const res = await enviarLeadFumigacion(data);
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
      incluyoMateriales: 'si',
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioFumigacion(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia • 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cuesta <br/> <span className="text-blue-500 italic">fumigar hoy?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Estimaciones para hogares, oficinas y depósitos en Asunción y Central.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Casa hasta 50m²</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 180.000 <span className="text-xs font-normal opacity-50">promedio</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Depósito/Comercio</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">450 a 600 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Servicio Premium</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">800 mil <span className="text-xs font-normal text-slate-400">max</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><Bug className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu fumigación</h2>
                    <p className="text-xs text-slate-400 font-medium">Elegí la propiedad y superficie</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['casa', 'oficina', 'deposito'].map(item => (
                        <button key={item} onClick={() => setTipo(item)} className={`p-4 rounded-2xl border-2 text-left transition-all ${tipo === item ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-600'}`}>
                            <span className="text-xs font-black uppercase block mb-1">{item}</span>
                        </button>
                    ))}
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Superficie (m²)</p>
                    </div>
                    <input type="number" value={m2} onChange={(e) => setM2(e.target.value)} placeholder="0" className="w-20 bg-transparent outline-none font-black text-2xl text-slate-800 text-right" />
                </div>
            </div>

            <button onClick={calcular} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest">Calcular</button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6">
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Costo Estimado</p>
                <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic text-center">Gs. {formatGs(resultado.total)}</p>
                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl">SOLICITAR FUMIGACIÓN</button>
              </div>
            )}
        </div>
      </section>

      <Footer />
      {/* (Agregá acá los mismos modales de Form y Reporte que en Pintura) */}
    </main>
  );
}