'use client';
import React, { useState } from 'react';
import { 
  Sparkle, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, 
  User, Phone, MapPin, X, Sofa, Building2, Home as HomeIcon 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadLimpieza, guardarPrecioLimpieza } from './action';

export default function LimpiezaCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  const [tipo, setTipo] = useState('post_obra'); // jornada, post_obra, tapizados
  const [medida, setMedida] = useState(80); // m2 para post-obra, días para jornada, juegos para tapizados
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
        let total = 0;

        if (tipo === 'jornada') {
            // Jornada estándar Gs. 140.000 por día
            total = medida * 140000;
        } else if (tipo === 'post_obra') {
            // Fin de obra base Gs. 350.000 + Gs. 4.500 por m2 a partir de 50 m2
            const m2 = Math.max(30, medida);
            total = Math.max(350000, Math.round(m2 * 4800));
        } else {
            // Lavado de tapizados Gs. 180.000 por juego
            total = medida * 180000;
        }

        setResultado({ 
            total, 
            tipo,
            medida
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
          cantidad: `${medida} ${tipo === 'jornada' ? 'jornadas' : tipo === 'post_obra' ? 'm²' : 'juegos'}`,
          total: new Intl.NumberFormat('es-PY').format(resultado.total) 
        }
    };
    const res = await enviarLeadLimpieza(data);
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
      incluyoProductos: formData.get('incluyoProductos'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioLimpieza(data);
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
            ¿Cuánto cuesta un <span className="text-blue-500 italic">servicio de limpieza?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Tarifas reales observadas para limpieza doméstica por jornada, cuadrillas de fin de obra y lavado de sofás en Asunción y Central.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jornada Doméstica (8 hs)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 140.000 <span className="text-xs font-normal opacity-50">promedio</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Limpieza Fin de Obra</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">350 a 850 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lavado de Tapizados</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">180 mil <span className="text-xs font-normal text-slate-400">por juego</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-teal-50 p-3 rounded-2xl text-teal-600"><Sparkle className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu limpieza</h2>
              <p className="text-xs text-slate-400 font-medium">Elegí la modalidad y el volumen del trabajo</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TIPO DE SERVICIO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de servicio</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'jornada', label: 'Jornada Doméstica', desc: 'Aseo general de casa o dpto (1 día)', icon: HomeIcon },
                  { id: 'post_obra', label: 'Fin de Obra / Mudanza', desc: 'Limpieza profunda de polvillo, vidrios y pisos', icon: Building2 },
                  { id: 'tapizados', label: 'Lavado de Tapizados', desc: 'Desinfección de sofás, sillones o colchones', icon: Sofa }
                ].map(item => {
                  const IconC = item.icon;
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => { setTipo(item.id); setMedida(item.id === 'jornada' ? 1 : item.id === 'post_obra' ? 80 : 1); }} 
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

            {/* CONTROL DE VOLUMEN SEGÚN TIPO */}
            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {tipo === 'jornada' ? 'Cantidad de Jornadas (Días)' : tipo === 'post_obra' ? 'Metros cuadrados aprox. (m²)' : 'Juegos de Living / Colchones'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {tipo === 'jornada' ? '8 horas por jornada' : tipo === 'post_obra' ? 'Superficie de piso a desinfectar' : 'Cantidad de muebles a lavar'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setMedida(Math.max(tipo === 'post_obra' ? 30 : 1, medida - (tipo === 'post_obra' ? 10 : 1)))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">-</button>
                <span className="font-black text-2xl text-slate-800">{medida}</span>
                <button onClick={() => setMedida(medida + (tipo === 'post_obra' ? 10 : 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">+</button>
              </div>
            </div>
          </div>

          <button 
            onClick={calcular} 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
            Calcular Costo Estimado
          </button>

          {/* RESULTADO */}
          {resultado && (
            <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Estimado</p>
                <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2">
                  {tipo === 'jornada' ? '* No incluye productos de limpieza pesados.' : '* Incluye cuadrilla, aspiradoras industriales e insumos de limpieza.'}
                </p>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuesto a Cuadrillas Verificadas</span>
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
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Contrataste limpieza hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Tu reporte anónimo ayuda a regular los precios de cuadrillas y aseo domiciliario en Paraguay.
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
            Las tarifas por jornada corresponden al salario diario de empleo doméstico según disposiciones del Ministerio de Trabajo (MTESS) más plus de pasaje. Las cotizaciones de fin de obra y lavado de sofás reflejan promedios de empresas y cuadrillas especializadas de Asunción, Luque, San Lorenzo y Fernando de la Mora que emplean maquinaria propia (hidrolavadoras, aspiradoras polvo/agua y químicos neutros).
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
                <p className="text-xs text-slate-400 font-medium">Conectaremos tu pedido con prestadores disponibles.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Pedir Servicio</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio (ej: Luque)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
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
                <p className="text-xs text-slate-400 font-medium">Tu aporte ayuda a transparentar el sector de limpieza.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te cobraron?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: Lambaré, Asunción)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoProductos" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="si">Incluyó máquinas y productos</option>
                    <option value="no">Solo mano de obra</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: limpiaron dpto de 2 piezas después de pintar)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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