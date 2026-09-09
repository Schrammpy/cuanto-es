'use client';
import React, { useState } from 'react';
import { 
  Truck, Package, Boxes, Warehouse, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, 
  User, Phone, MapPin, X, Send 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadFlete, guardarPrecioFlete } from './action';

export default function FletesCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados Calculadora
  const [tamano, setTamano] = useState('estandar');
  const [ayudantes, setAyudantes] = useState(1);
  const [distancia, setDistancia] = useState('local');
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
        let base = 0;
        let kmExtra = 0;

        if (tamano === 'chico') base = 150000;
        else if (tamano === 'estandar') base = 350000;
        else base = 650000;

        if (distancia === '20km') kmExtra = 80000;
        else if (distancia === '50km') kmExtra = 220000;
        else if (distancia === 'larga') kmExtra = 550000;

        const costoAyudantes = ayudantes * 100000;
        const total = base + kmExtra + costoAyudantes;

        setResultado({ 
            total, 
            base, 
            kmExtra, 
            costoAyudantes,
            tamano,
            distancia,
            ayudantes
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
    const res = await enviarLeadFlete(data);
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
      ayudantes: formData.get('ayudantes'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioFlete(data);
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
            ¿Cuánto cuesta un <span className="text-blue-500 italic">flete en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Rangos reales observados para fletes chicos, mudanzas completas y ayudantes en Asunción y Gran Asunción.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Flete Corto / 1 Mueble</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 150.000 <span className="text-xs font-normal opacity-50">promedio</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Mudanza Completa (Casa/Dpto)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">450 a 850 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ayudante Extra (Carga/Descarga)</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">100 mil <span className="text-xs font-normal text-slate-400">por peón</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DE MUDANZAS */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Truck className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu flete exacto</h2>
              <p className="text-xs text-slate-400 font-medium">Elegí la carga, distancia y personal necesario</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TAMAÑO DE CARGA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de traslado / Carga</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'chico', label: '1 Mueble / Electrodom.', icon: Package },
                  { id: 'estandar', label: 'Casa o Dpto Estándar', icon: Boxes },
                  { id: 'grande', label: 'Casa Grande u Oficina', icon: Warehouse }
                ].map(item => {
                  const IconComp = item.icon;
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => setTamano(item.id)} 
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${tamano === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black' : 'border-slate-100 text-slate-500 font-bold'}`}
                    >
                      <IconComp className="w-5 h-5" />
                      <span className="text-[9px] uppercase text-center leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DISTANCIA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Distancia del traslado</label>
              <select 
                value={distancia} 
                onChange={(e) => setDistancia(e.target.value)}
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-xs appearance-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all text-slate-700"
              >
                <option value="local">Misma ciudad / Zona cercana (0 a 10 km)</option>
                <option value="20km">Entre ciudades vecinas (ej: Asu a Luque, San Lorenzo - 10 a 25 km)</option>
                <option value="50km">Distancia media (ej: Asu a Ypacaraí, Caacupé - 25 a 60 km)</option>
                <option value="larga">Larga distancia al interior (+100 km)</option>
              </select>
            </div>

            {/* AYUDANTES */}
            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ayudantes de Carga (Peones)</p>
                <p className="text-xs text-slate-500 font-medium">Recomendado 2 para heladeras o roperos grandes</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setAyudantes(Math.max(0, ayudantes - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">-</button>
                <span className="font-black text-2xl text-slate-800">{ayudantes}</span>
                <button onClick={() => setAyudantes(ayudantes + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">+</button>
              </div>
            </div>
          </div>

          <button 
            onClick={calcular} 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
            Calcular Costo del Flete
          </button>

          {/* RESULTADO Y LEAD */}
          {resultado && (
            <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Estimado Total</p>
                <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200/60 text-xs font-bold text-slate-500">
                  <span>Vehículo: Gs. {new Intl.NumberFormat('es-PY').format(resultado.base + resultado.kmExtra)}</span>
                  <span>•</span>
                  <span>Ayudantes: Gs. {new Intl.NumberFormat('es-PY').format(resultado.costoAyudantes)}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuestos a Fleteros Verificados</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. CROWDSOURCING: ¿CUÁNTO PAGASTE POR TU MUDANZA? */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Te mudaste o hiciste un flete hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Compartí tu precio de forma anónima para que todos sepamos cuánto es lo justo pagar por un traslado en Paraguay.
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
            Los valores corresponden a tarifas de referencia relevadas entre transportistas y fleteros independientes de Asunción, Luque, San Lorenzo y Capiatá. No contemplan el desmontaje complejo de placares empotrados, grúas para subir muebles por balcones ni peajes interurbanos en rutas concesionadas, los cuales se adicionan al presupuesto final.
          </p>
        </div>
      </section>

      {/* MODAL 1: LEAD (FLETERO VERIFICADO) */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Un fletero de tu zona se comunicará con vos.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Contactar Fleteros</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad de Origen (ej: Luque)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
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
                <p className="text-xs text-slate-400 font-medium">Tu aporte ayuda a transparentar los fletes en Paraguay.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te costó?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Desde qué ciudad (ej: Fernando)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="ayudantes" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="si">Incluyó ayudantes de carga</option>
                    <option value="no">Solo chofer (sin carga)</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: mudanza de dpto en 2do piso por escalera)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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