'use client';
import React, { useState } from 'react';
import { 
  Hammer, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, 
  User, Phone, MapPin, X, BrickWall, Layers, Ruler 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadAlbanileria, guardarPrecioAlbanileria } from './action';

export default function AlbanileriaCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  const [tipo, setTipo] = useState('muralla'); // muralla, contrapiso, revoque
  const [medida, setMedida] = useState(15); // metros lineales para muralla, m2 para los demás
  const [incluyeMateriales, setIncluyeMateriales] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioManoObraUnit = 0;
        let precioMaterialesUnit = 0;

        if (tipo === 'muralla') {
            // Muralla estándar 2m altura por metro lineal
            precioManoObraUnit = 220000;
            precioMaterialesUnit = 160000; // ladrillos comunes, cemento, varillas, arena
        } else if (tipo === 'contrapiso') {
            // Contrapiso y carpeta por m2
            precioManoObraUnit = 32000;
            precioMaterialesUnit = 35000;
        } else {
            // Revoque grueso y fino por m2
            precioManoObraUnit = 28000;
            precioMaterialesUnit = 18000;
        }

        const manoObraTotal = precioManoObraUnit * medida;
        const materialesTotal = incluyeMateriales ? precioMaterialesUnit * medida : 0;
        const total = manoObraTotal + materialesTotal;

        setResultado({ 
            total,
            manoObraTotal,
            materialesTotal,
            tipo,
            medida,
            unidad: tipo === 'muralla' ? 'metros lineales' : 'm²',
            incluyeMateriales
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
        detalles: { 
          ...resultado, 
          total: new Intl.NumberFormat('es-PY').format(resultado.total) 
        }
    };
    const res = await enviarLeadAlbanileria(data);
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
    const res = await guardarPrecioAlbanileria(data);
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
            ¿Cuánto cobra un <span className="text-blue-500 italic">albañil en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Costos de mano de obra y materiales para murallas perimetrales, revoques, contrapisos y reformas en Asunción y Central.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Muralla de 2m (Mano de obra)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 220.000 <span className="text-xs font-normal opacity-50">/metro lin.</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Rango en Obra Nueva</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">180 a 320 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revoque o Contrapiso</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">30 mil <span className="text-xs font-normal text-slate-400">por m²</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-stone-100 p-3 rounded-2xl text-stone-700"><Hammer className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu obra</h2>
              <p className="text-xs text-slate-400 font-medium">Elegí la tarea y la dimensión del trabajo</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TIPO DE TRABAJO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de trabajo</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'muralla', label: 'Muralla Perimetral', desc: 'Cimientos, encadenado y pared de 2m', icon: BrickWall },
                  { id: 'contrapiso', label: 'Contrapiso y Carpeta', desc: 'Base niveladora para colocar piso', icon: Layers },
                  { id: 'revoque', label: 'Revoque Fino y Grueso', desc: 'Terminación lisa de paredes y techos', icon: Ruler }
                ].map(item => {
                  const IconC = item.icon;
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => { setTipo(item.id); setMedida(item.id === 'muralla' ? 15 : 40); }} 
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${tipo === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-600'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconC className={`w-4 h-4 ${tipo === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-black uppercase">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-tight block">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* METROS */}
            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {tipo === 'muralla' ? 'Metros lineales de muralla' : 'Superficie total en m²'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {tipo === 'muralla' ? 'Largo total de la pared a levantar' : 'Ancho x largo del área a revocar o contrapisar'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setMedida(Math.max(5, medida - 5))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">-</button>
                <span className="font-black text-2xl text-slate-800">{medida}</span>
                <button onClick={() => setMedida(medida + 5)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">+</button>
              </div>
            </div>

            {/* TOGGLE MATERIALES */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs font-black uppercase text-slate-800">¿Querés incluir estimado de materiales?</p>
                <p className="text-[10px] text-slate-400 font-medium">Ladrillos, cemento, varillas, arena y triturada</p>
              </div>
              <button 
                onClick={() => setIncluyeMateriales(!incluyeMateriales)}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 ${incluyeMateriales ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${incluyeMateriales ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <button 
            onClick={calcular} 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
            Calcular Presupuesto de Obra
          </button>

          {/* RESULTADO */}
          {resultado && (
            <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Estimado</p>
                <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200/60 text-xs font-bold text-slate-500">
                  <span>Mano de obra: Gs. {new Intl.NumberFormat('es-PY').format(resultado.manoObraTotal)}</span>
                  {resultado.incluyeMateriales && (
                    <>
                      <span>•</span>
                      <span>Materiales: Gs. {new Intl.NumberFormat('es-PY').format(resultado.materialesTotal)}</span>
                    </>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuestos a Contratistas Verificados</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. CROWDSOURCING */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Hiciste una reforma o muralla hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Tu aporte anónimo ayuda a miles de paraguayos a saber cuánto es lo justo pagar por metro de albañilería.
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
            Los valores consideran cuadrillas de oficial albañil y ayudante en Gran Asunción. Las murallas incluyen zanja de cimiento de 40cm, viga de encadenado inferior y pilares cada 3 metros. No incluye demolición previa de murallas viejas, contenedores de escombros ni revoque fino de la muralla (el cual se cotiza por separado).
          </p>
        </div>
      </section>

      {/* MODAL LEAD */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl text-slate-700">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Conectaremos tu obra con contratistas verificados.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Pedir Contratista</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio (ej: Luque, Capiatá)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                </div>
                <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  {formLoading ? "Enviando..." : "Pedir Presupuestos"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL CROWDSOURCING */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl text-slate-700">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {reportSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Aporte Guardado!</p>
                <p className="text-xs text-slate-400 font-medium">Tu aporte construye el índice de precios de Paraguay.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto pagaste por metro?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad donde se hizo (ej: San Lorenzo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="no">Solo mano de obra</option>
                    <option value="si">Incluyó ladrillos y materiales</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: muralla de 20 metros con revoque de un lado)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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