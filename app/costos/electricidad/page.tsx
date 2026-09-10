'use client';
import React, { useState } from 'react';
import { 
  Zap, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, 
  User, Phone, MapPin, X, ShieldAlert, Lightbulb 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadElectricidad, guardarPrecioElectricidad } from './action';

export default function ElectricidadCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados Calculadora
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

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioBase = 0;

        if (servicio === 'por_boca') {
            // Precio promedio por boca: Gs. 45.000
            precioBase = 45000 * bocas;
        } else if (servicio === 'tablero') {
            // Cambio de tablero principal con llaves térmicas
            precioBase = 280000 + (bocas > 1 ? (bocas - 1) * 80000 : 0);
        } else if (servicio === 'corto') {
            // Detección de fuga o cortocircuito
            precioBase = 320000;
        } else if (servicio === 'ventilador') {
            // Instalación de ventiladores de techo o extractores
            precioBase = 140000 * bocas;
        }

        let total = precioBase;
        if (urgencia === 'urgente') total = Math.round(total * 1.3);

        setResultado({ 
            total, 
            bocas,
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
      
      {/* 1. RESUMEN DE PRECIOS INICIAL (SEO / UX) */}
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cobra un <span className="text-blue-500 italic">electricista en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Tarifas reales observadas por boca de luz, instalación de tomacorrientes, llaves térmicas y tableros en Asunción y Central.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Costo por Boca (Toma / Llave)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 45.000 <span className="text-xs font-normal opacity-50">promedio</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Rango por Boca en Obra</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">35 a 65 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cambio de Tablero Principal</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">280 mil <span className="text-xs font-normal text-slate-400">mano de obra</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DE ELECTRICIDAD */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600"><Zap className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu trabajo eléctrico</h2>
              <p className="text-xs text-slate-400 font-medium">Elegí la tarea y la cantidad de puntos</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TIPO DE TRABAJO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de servicio</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'por_boca', label: 'Instalación de bocas / tomas', desc: 'Tomas corrientes, llaves de encendido o focos' },
                  { id: 'tablero', label: 'Tablero principal / disyuntor', desc: 'Instalación de térmicas, diferencial y jabalina' },
                  { id: 'corto', label: 'Detección de cortocircuito / fuga', desc: 'Diagnóstico por saltos de llave y arreglo' },
                  { id: 'ventilador', label: 'Ventilador de techo / extractor', desc: 'Armado, montaje y cableado con regulador' }
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Horario del trabajo</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setUrgencia('normal')} 
                  className={`p-4 rounded-2xl border-2 text-center text-xs font-black uppercase transition-all ${urgencia === 'normal' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Horario normal
                </button>
                <button 
                  onClick={() => setUrgencia('urgente')} 
                  className={`p-4 rounded-2xl border-2 text-center text-xs font-black uppercase transition-all ${urgencia === 'urgente' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Urgencia / Noche (+30%)
                </button>
              </div>
            </div>

            {/* CANTIDAD DE BOCAS / PUNTOS */}
            {servicio !== 'corto' && (
              <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {servicio === 'tablero' ? 'Circuitos / Térmicas' : 'Cantidad de bocas / artefactos'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Sumá tomas, llaves y artefactos</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setBocas(Math.max(1, bocas - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">-</button>
                  <span className="font-black text-2xl text-slate-800">{bocas}</span>
                  <button onClick={() => setBocas(bocas + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">+</button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={calcular} 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
            Calcular Mano de Obra Eléctrica
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
                  * No incluye cables, llaves termomagnéticas, cajas ni materiales de ferretería.
                </p>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuestos a Electricistas Verificados</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. CROWDSOURCING: ¿CUÁNTO TE COBRÓ EL ELECTRICISTA? */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Hiciste una instalación eléctrica hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Tu aporte 100% anónimo ayuda a que nadie pague sobrecostos por trabajos de electricidad en Paraguay.
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
            Las estimaciones se basan en tarifas por boca y jornadas de trabajo relevadas entre instaladores electricistas matriculados y particulares de Gran Asunción. Se asume tubería corrugada ya embutida. Si se requiere picado de pared para canalizar nuevos corrugados o instalación de acometida trifásica según normas de la ANDE, se adicionan costos por metro o proyecto completo.
          </p>
        </div>
      </section>

      {/* MODAL 1: LEAD (ELECTRICISTA VERIFICADO) */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Conectaremos tu trabajo con electricistas disponibles en tu zona.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Pedir Electricista</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio (ej: Luque, Fernando)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
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
                <p className="text-xs text-slate-400 font-medium">Tu dato ayuda a miles de familias paraguayas.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto pagaste?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: Asunción, San Lorenzo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="no">Solo mano de obra</option>
                    <option value="si">Incluyó cables/térmicas</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: cableó 8 tomas y colocó un disyuntor nuevo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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