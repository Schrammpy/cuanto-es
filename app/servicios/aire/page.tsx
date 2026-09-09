'use client';
import React, { useState } from 'react';
import { 
  Wind, ThermometerSnowflake, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, 
  User, Phone, MapPin, X, Send 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadAire, guardarPrecioAire } from './action';

export default function AireCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados Calculadora
  const [btu, setBtu] = useState('12000');
  const [tipo, setTipo] = useState('instalacion');
  const [cantidad, setCantidad] = useState(1);
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
        if (tipo === 'instalacion') {
            if (btu === '12000') precioBase = 380000;
            else if (btu === '18000') precioBase = 550000;
            else precioBase = 800000;
        } else {
            precioBase = 180000; // Mantenimiento/Limpieza
        }

        const totalSinDescuento = precioBase * cantidad;
        const descuento = cantidad > 2 ? totalSinDescuento * 0.10 : 0;
        const total = totalSinDescuento - descuento;

        setResultado({ 
            total, 
            descuento, 
            perUnit: precioBase,
            btu,
            tipo,
            cantidad
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
    const res = await enviarLeadAire(data);
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
      materiales: formData.get('materiales'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioAire(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      
      {/* 1. RESUMEN DE PRECIOS INICIAL */}
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cuesta instalar un <span className="text-blue-500 italic">aire en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Rangos reales observados para colocación de Split y mantenimiento preventivo en Asunción y Central.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instalación Estándar (12mil BTU)</p>
              <p className="text-3xl font-black">Gs. 380.000 <span className="text-xs font-normal opacity-50">promedio</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Rango Habitual en Plaza</p>
              <p className="text-3xl font-black">300 mil — 850 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Limpieza / Mantenimiento</p>
              <p className="text-3xl font-black text-blue-400">180 mil <span className="text-xs font-normal text-slate-400">base</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DE AIRE ACONDICIONADO */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><ThermometerSnowflake className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu presupuesto</h2>
              <p className="text-xs text-slate-400 font-medium">Elegí la potencia del equipo y el servicio requerido</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TIPO DE SERVICIO */}
            <div className="flex bg-slate-100 p-2 rounded-2xl gap-2">
              <button 
                onClick={() => setTipo('instalacion')} 
                className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === 'instalacion' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                Instalación Nueva
              </button>
              <button 
                onClick={() => setTipo('mantenimiento')} 
                className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === 'mantenimiento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                Mantenimiento / Limpieza
              </button>
            </div>

            {/* CAPACIDAD */}
            {tipo === 'instalacion' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Capacidad del equipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '12000', label: '9.000 - 12.000 BTU' },
                    { id: '18000', label: '18.000 BTU' },
                    { id: '24000', label: '24.000 BTU' }
                  ].map(b => (
                    <button 
                      key={b.id} 
                      onClick={() => setBtu(b.id)} 
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${btu === b.id ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black' : 'border-slate-100 text-slate-500 font-bold'}`}
                    >
                      <span className="text-xs block">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CANTIDAD */}
            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad de unidades</p>
                <p className="text-xs text-slate-500 font-medium">Descuento automático a partir de 3 equipos</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">-</button>
                <span className="font-black text-2xl text-slate-800">{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">+</button>
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Estimado</p>
                <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                {resultado.descuento > 0 && (
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mt-2">
                    ¡Aplicado 10% de descuento por cantidad!
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  {tipo === 'instalacion' ? '* Incluye hasta 2.5 metros de cañería de cobre básica por equipo.' : '* Limpieza profunda de unidad interior y exterior.'}
                </p>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuestos a Técnicos Verificados</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. CROWDSOURCING: ¿CUÁNTO PAGASTE POR TU AIRE? */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Hiciste service o instalaste hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Tu aporte anónimo ayuda a transparentar el mercado paraguayo para que nadie pague de más en verano.
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
            Los valores corresponden a promedios relevados entre técnicos particulares e instaladores matriculados de Central. No contemplan perforaciones en hormigón armado, trabajos en altura con andamios especiales ni circuitos eléctricos nuevos desde el medidor de la ANDE, los cuales se presupuestan en el sitio.
          </p>
        </div>
      </section>

      {/* MODAL 1: LEAD (TÉCNICO VERIFICADO) */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Un técnico de tu zona se comunicará con vos.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Contactar Técnicos</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
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
                <p className="text-xs text-slate-400 font-medium">Tu dato ayuda a miles de paraguayos.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te cobraron?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: Luque, Lambaré)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="materiales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="si">Incluyó materiales/gas</option>
                    <option value="no">Solo mano de obra</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: split 18mil BTU con 3 metros de caño)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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