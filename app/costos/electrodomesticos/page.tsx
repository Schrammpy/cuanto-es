'use client';
import React, { useState } from 'react';
import { 
  Plug, Tv, Refrigerator, Microwave, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, User, Phone, MapPin, X, Send 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadElectro, guardarPrecioElectro } from './action';

export default function ElectroCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  const [equipo, setEquipo] = useState('heladera');
  const [problema, setProblema] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Modales
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const formatGs = (num: number) => new Intl.NumberFormat('es-PY').format(Math.round(num));

  // Datos para los menús dinámicos
  const problemasMap: any = {
    heladera: [
      { id: 'gas', label: 'No enfría bien (Carga de gas)', min: 250000, max: 450000 },
      { id: 'termostato', label: 'Congela demasiado', min: 200000, max: 350000 },
      { id: 'compresor', label: 'No enciende (Motor/Compresor)', min: 600000, max: 1200000 },
      { id: 'placa', label: 'Falla electrónica', min: 350000, max: 700000 },
      { id: 'diagnostico', label: 'No sé / Solo revisión', min: 80000, max: 120000 },
    ],
    lavarropas: [
      { id: 'bomba', label: 'No desagota el agua', min: 250000, max: 450000 },
      { id: 'motor', label: 'No gira / No centrifuga', min: 450000, max: 800000 },
      { id: 'placa', label: 'No enciende', min: 350000, max: 700000 },
      { id: 'fuga', label: 'Pierde agua', min: 150000, max: 300000 },
      { id: 'diagnostico', label: 'No sé / Solo revisión', min: 80000, max: 120000 },
    ],
    microondas: [
      { id: 'magnetron', label: 'No calienta', min: 300000, max: 550000 },
      { id: 'general', label: 'Plato no gira / Botonera', min: 150000, max: 300000 },
      { id: 'diagnostico', label: 'No enciende', min: 120000, max: 250000 },
    ],
    tv: [
      { id: 'backlight', label: 'Sin imagen (tiene sonido)', min: 250000, max: 500000 },
      { id: 'fuente', label: 'No enciende', min: 200000, max: 400000 },
      { id: 'pantalla', label: 'Pantalla rota', min: 0, max: 0, custom: 'Requiere cotización exacta' },
    ]
  };

  const calcular = () => {
    if (!problema) {
        alert("Elegí cuál es la falla del equipo.");
        return;
    }

    setLoading(true);
    setTimeout(() => {
        const fallaSel = problemasMap[equipo].find((p: any) => p.id === problema);
        
        setResultado({ 
            min: fallaSel.min, 
            max: fallaSel.max, 
            custom: fallaSel.custom,
            equipo,
            problema: fallaSel.label,
            rango: fallaSel.custom ? 'A cotizar' : `${formatGs(fallaSel.min)} - ${formatGs(fallaSel.max)}`
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
        detalles: { ...resultado }
    };
    const res = await enviarLeadElectro(data);
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
      equipo: formData.get('equipo'),
      incluyoMateriales: formData.get('incluyoMateriales'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioElectro(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  // Cuando cambian el equipo, reseteamos el problema
  const handleEquipoChange = (nuevoEquipo: string) => {
    setEquipo(nuevoEquipo);
    setProblema('');
    setResultado(null);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      
      {/* 1. RESUMEN INICIAL */}
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cuesta reparar un <span className="text-blue-500 italic">electrodoméstico?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Rangos de precios estimados para reparaciones a domicilio o en taller. El costo final siempre depende del diagnóstico técnico presencial.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diagnóstico / Revisión</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">80 a 120 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Reparaciones Sencillas</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">150 a 250 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reparaciones Medias</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">Desde 250 mil</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Plug className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Cotizá tu reparación</h2>
                    <p className="text-xs text-slate-400 font-medium">Elegí el equipo y la falla principal</p>
                </div>
            </div>

            <div className="space-y-6">
              {/* TIPO DE EQUIPO */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">1. Equipo</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'heladera', label: 'Heladera / Freezer', icon: Refrigerator },
                    { id: 'lavarropas', label: 'Lavarropas', icon: CheckCircle2 },
                    { id: 'microondas', label: 'Microondas', icon: Microwave },
                    { id: 'tv', label: 'Televisor (TV)', icon: Tv }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.id} onClick={() => handleEquipoChange(item.id)} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${equipo === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-500'}`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* PROBLEMA (Dinámico) */}
              <div className="space-y-2 animate-in fade-in">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">2. Problema aparente</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {problemasMap[equipo].map((p: any) => (
                        <button key={p.id} onClick={() => setProblema(p.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${problema === p.id ? 'border-blue-600 bg-blue-50/30 font-bold' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <span className="text-xs font-black uppercase text-slate-700">{p.label}</span>
                        </button>
                    ))}
                </div>
              </div>
            </div>

            <button onClick={calcular} disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
              Ver Rango Estimado
            </button>

            {/* RESULTADO Y LEAD */}
            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
                <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Reparación Estimada</p>
                    {resultado.custom ? (
                        <p className="text-3xl font-[900] text-red-600 tracking-tighter italic leading-none my-3 uppercase">
                            {resultado.custom}
                        </p>
                    ) : (
                        <p className="text-4xl md:text-5xl font-[900] text-emerald-600 tracking-tighter italic leading-none my-3">
                            {formatGs(resultado.min)} - {formatGs(resultado.max)}
                        </p>
                    )}
                    
                    <p className="text-xs font-bold text-slate-400 uppercase mt-4 max-w-sm mx-auto text-pretty">
                        * Incluye diagnóstico y mano de obra estimada. El valor puede aumentar si requiere cambio de motor o repuestos específicos.
                    </p>
                </div>

                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group">
                  <span className="uppercase tracking-widest text-xs font-black">Contactar Técnicos de la Zona</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
        </div>
      </section>

      {/* 3. CROWDSOURCING */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-600 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center text-white shadow-xl">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight">¿Mandaste a arreglar algo hace poco?</h3>
            <p className="text-xs font-medium leading-relaxed opacity-90">
              Ayudá a transparentar el servicio técnico en Paraguay. Tu reporte es 100% anónimo y ayuda a evitar estafas.
            </p>
          </div>
          <button onClick={() => setShowReportModal(true)} className="bg-white text-blue-600 font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest shrink-0">
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
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Los valores son rangos de referencia basados en servicios técnicos que publicitan reparaciones a domicilio en el Gran Asunción. Las estimaciones asumen fallas comunes (ej: cambio de gas, correas, sensores). Las placas electrónicas o displays (paneles de TV) tienen una alta variabilidad de precio según marca y disponibilidad de repuesto original, por lo que requieren cotización exacta in situ.
          </p>
        </div>
      </section>

      {/* MODALES DE FORMULARIOS */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Un técnico verificador te contactará pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Pedir Revisión</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                </div>
                <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  {formLoading ? "Enviando..." : "Enviar a Técnicos"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {reportSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Aporte Guardado!</p>
                <p className="text-xs text-slate-400 font-medium">Gracias por cuidar el bolsillo de todos.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te cobraron?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="equipo" required placeholder="¿Qué arreglaste? (ej: Heladera LG)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: San Lorenzo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="si">Incluyó repuestos / piezas</option>
                    <option value="no">Solo revisión o mano de obra</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles de la falla" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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