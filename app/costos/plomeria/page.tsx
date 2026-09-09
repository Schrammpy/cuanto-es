'use client';
import React, { useState } from 'react';
import { 
  Wrench, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, 
  User, Phone, MapPin, X, Droplets 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadPlomeria, guardarPrecioPlomeria } from './action';

export default function PlomeriaCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados Calculadora
  const [servicio, setServicio] = useState('destranque');
  const [urgencia, setUrgencia] = useState('normal');
  const [puntos, setPuntos] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Modales
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioBase = 0;

        if (servicio === 'destranque') precioBase = 160000;
        else if (servicio === 'termocalefon') precioBase = 250000;
        else if (servicio === 'griferia') precioBase = 120000;
        else if (servicio === 'fuga') precioBase = 450000;

        let total = precioBase * puntos;

        // Recargo de urgencia o fin de semana
        if (urgencia === 'urgente') total = Math.round(total * 1.3);

        setResultado({ 
            total, 
            precioBase,
            puntos,
            servicio,
            urgencia
        });
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
    const res = await enviarLeadPlomeria(data);
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
    const res = await guardarPrecioPlomeria(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      
      {/* 1. RESUMEN DE PRECIOS INICIAL (SEO / UX) */}
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cobra un <span className="text-blue-500 italic">plomero en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Rangos reales observados para destranques, instalación de grifería, termocalefones y fugas de agua en Asunción y Central.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destranque Simple / Visita</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 160.000 <span className="text-xs font-normal opacity-50">promedio</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Trabajos Habituales</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">120 a 450 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instalación Termocalefón</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">250 mil <span className="text-xs font-normal text-slate-400">mano de obra</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DE PLOMERÍA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Droplets className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu trabajo de plomería</h2>
              <p className="text-xs text-slate-400 font-medium">Elegí el problema o instalación a realizar</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TIPO DE TRABAJO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de servicio</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'destranque', label: 'Destranque de cañería / baño', desc: 'Inodoros, piletas de cocina o desagües pluviales' },
                  { id: 'griferia', label: 'Cambio de grifería o sifón', desc: 'Instalación de canillas, llaves de paso o flexibles' },
                  { id: 'termocalefon', label: 'Instalación de termocalefón', desc: 'Montaje en pared y conexión de agua fría/caliente' },
                  { id: 'fuga', label: 'Reparación de fuga oculta', desc: 'Picado de pared/piso, cambio de caño roto y cierre' }
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setServicio(item.id)} 
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${servicio === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-600'}`}
                  >
                    <span className="text-xs font-black uppercase block mb-1">{item.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* URGENCIA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Horario / Urgencia</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setUrgencia('normal')} 
                  className={`p-4 rounded-2xl border-2 text-center text-xs font-black uppercase transition-all ${urgencia === 'normal' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Horario normal (Lunes a Sáb)
                </button>
                <button 
                  onClick={() => setUrgencia('urgente')} 
                  className={`p-4 rounded-2xl border-2 text-center text-xs font-black uppercase transition-all ${urgencia === 'urgente' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Urgencia / Domingo (+30%)
                </button>
              </div>
            </div>

            {/* PUNTOS / ARTEFACTOS */}
            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad de puntos / artefactos</p>
                <p className="text-xs text-slate-500 font-medium">Ej: 2 baños, 2 canillas o 1 pérdida</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setPuntos(Math.max(1, puntos - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">-</button>
                <span className="font-black text-2xl text-slate-800">{puntos}</span>
                <button onClick={() => setPuntos(puntos + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">+</button>
              </div>
            </div>
          </div>

          <button 
            onClick={calcular} 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
            Calcular Mano de Obra
          </button>

          {/* RESULTADO Y LEAD */}
          {resultado && (
            <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Estimado de Mano de Obra</p>
                <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2">
                  * No incluye materiales de ferretería (caños, teflón, pegamentos o repuestos).
                </p>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuestos a Plomeros Verificados</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. CROWDSOURCING: ¿CUÁNTO TE COBRÓ EL PLOMERO? */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Tuviste un arreglo de plomería hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Ayudá a transparentar los precios en Paraguay. Reportá cuánto pagaste de forma 100% anónima.
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

      {/* 4. METODOLOGÍA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border-t border-slate-100 pt-8 space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-4 h-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Metodología de este cálculo</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Los valores mostrados corresponden a tarifas promedio observadas entre plomeros independientes y sanitarios de Asunción, Luque, San Lorenzo, Fernando de la Mora y Lambaré. Los precios reflejan mano de obra estándar de plomería domiciliaria y no incluyen repuestos de grifería, caños de termofusión o PVC, ni trabajos de albañilería pesada para tapar zanjas grandes.
          </p>
        </div>
      </section>

      {/* MODAL 1: LEAD (PLOMERO VERIFICADO) */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Conectaremos tu problema con plomeros disponibles en tu zona.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Pedir Plomero</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio (ej: San Lorenzo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                </div>
                <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  {formLoading ? "Enviando..." : "Pedir Presupuestos"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CROWDSOURCING */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {reportSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Aporte Guardado!</p>
                <p className="text-xs text-slate-400 font-medium">Gracias por sumar transparencia al mercado de servicios.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te cobró el plomero?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: Luque, Asunción)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="no">Solo mano de obra</option>
                    <option value="si">Incluyó repuestos/materiales</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: cambió el sifón de la cocina y destrabó el baño)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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