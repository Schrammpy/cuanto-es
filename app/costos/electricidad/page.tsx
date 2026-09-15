'use client';
import React, { useState } from 'react';
import { 
  Zap, Info, TrendingUp, Calculator, ChevronRight, 
  CheckCircle2, Loader2, User, Phone, MapPin, X, Send 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadElectricidad, guardarPrecioElectricidad } from './action';

export default function ElectricidadCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados
  const [servicio, setServicio] = useState('por_boca');
  const [bocas, setBocas] = useState(4);
  const [urgencia, setUrgencia] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Modales
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  // FUNCIÓN NECESARIA QUE FALTABA
  const formatGs = (num: number) => {
    return new Intl.NumberFormat('es-PY').format(Math.round(num));
  };

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioBase = 0;
        if (servicio === 'por_boca') precioBase = 87000 * bocas;
        else if (servicio === 'tablero') precioBase = 450000 + (bocas > 1 ? (bocas - 1) * 120000 : 0);
        else if (servicio === 'corto') precioBase = 350000;
        else if (servicio === 'ventilador') precioBase = 150000 * bocas;

        let total = precioBase;
        if (urgencia === 'urgente') total = Math.round(total * 1.3);

        setResultado({ total, bocas, servicio, urgencia });
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
    const res = await enviarLeadElectricidad(data);
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
      incluyoMateriales: formData.get('incluyoMateriales'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioElectricidad(data);
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
            <TrendingUp className="w-4 h-4" /> Precios de Referencia FAEP • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cobra un <span className="text-blue-500 italic">electricista hoy?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Tarifas referenciales basadas en normas técnicas y mano de obra profesional en Paraguay.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Costo x Boca (FAEP)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 87.000 <span className="text-xs font-normal opacity-50">ref.</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Cambio de Tablero</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">450 a 600 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Detección de Fuga</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">350 mil <span className="text-xs font-normal text-slate-400">base</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
            {/* ... Formulario igual al anterior ... */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'por_boca', label: 'Instalación bocas', desc: 'Tomas, llaves o focos' },
                  { id: 'tablero', label: 'Tablero Eléctrico', desc: 'Disyuntor y llaves' },
                  { id: 'corto', label: 'Cortocircuito', desc: 'Diagnóstico y reparación' },
                  { id: 'ventilador', label: 'Ventiladores', desc: 'Montaje y cableado' }
                ].map(item => (
                  <button key={item.id} onClick={() => setServicio(item.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${servicio === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-600'}`}>
                    <span className="text-xs font-black uppercase block mb-1">{item.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setBocas(Math.max(1, bocas - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm font-bold text-slate-600">-</button>
                  <span className="font-black text-2xl text-slate-800">{bocas}</span>
                  <button onClick={() => setBocas(bocas + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm font-bold text-slate-600">+</button>
                </div>
              </div>
            </div>

            <button onClick={calcular} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest">Calcular</button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6">
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimado Mano de Obra</p>
                <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic text-center">Gs. {formatGs(resultado.total)}</p>
                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl">SOLICITAR ELECTRICISTA</button>
              </div>
            )}
        </div>
      </section>
      <Footer />
    </main>
  );
}