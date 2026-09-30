'use client';
import React, { useState } from 'react';
import { 
  Smartphone, MonitorSmartphone, BatteryCharging, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, User, Phone, MapPin, X, Send 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadCelular, guardarPrecioCelular } from './action';

export default function CelularesCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  const [marca, setMarca] = useState('android'); // android, apple
  const [gama, setGama] = useState('media'); // entrada, media, alta, reciente, antiguo
  const [reparacion, setReparacion] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Modales
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const formatGs = (num: number) => new Intl.NumberFormat('es-PY').format(Math.round(num));

  // Opciones Dinámicas de Gama según la Marca
  const gamasMap = {
    android: [
      { id: 'entrada', label: 'Gama de Entrada (Básicos)' },
      { id: 'media', label: 'Gama Media (Ej: Galaxy A54, Redmi Note)' },
      { id: 'alta', label: 'Gama Alta / OLED (Galaxy S, Ultra)' }
    ],
    apple: [
      { id: 'antiguo', label: 'Modelos Antiguos (Hasta iPhone 11)' },
      { id: 'reciente', label: 'Modelos Recientes (iPhone 12 en adelante)' }
    ]
  };

  const calcular = () => {
    if (!reparacion) {
        alert("Elegí el tipo de reparación que necesitás.");
        return;
    }

    setLoading(true);
    setTimeout(() => {
        let min = 0;
        let max = 0;
        let custom = null;

        // LÓGICA DE PRECIOS BASE (Independiente de la gama)
        if (reparacion === 'diagnostico') { min = 50000; max = 100000; }
        else if (reparacion === 'software') { min = 70000; max = 150000; }
        else if (reparacion === 'pin') { min = 60000; max = 150000; }
        else if (reparacion === 'microfono') { min = 80000; max = 180000; }
        else if (reparacion === 'mojado') { min = 100000; max = 200000; }
        else if (reparacion === 'placa') { min = 200000; max = 600000; } // Base placa
        
        // LÓGICA DE BATERÍA (Depende fuertemente de la gama)
        else if (reparacion === 'bateria') {
            if (marca === 'android') {
                if (gama === 'entrada') { min = 100000; max = 180000; }
                else if (gama === 'media') { min = 150000; max = 250000; }
                else { min = 200000; max = 350000; }
            } else {
                if (gama === 'antiguo') { min = 150000; max = 250000; }
                else { min = 250000; max = 450000; }
            }
        }
        
        // LÓGICA DE PANTALLA (Depende de calidad y gama)
        else if (reparacion === 'pantalla') {
             if (marca === 'android') {
                if (gama === 'entrada') { min = 180000; max = 350000; }
                else if (gama === 'media') { min = 300000; max = 650000; }
                else { min = 600000; max = 1500000; } // OLED es caro
            } else {
                // iPhone varía demasiado entre LCD, Hard OLED, Soft OLED, Original Pulled.
                custom = "A cotizar según calidad (OLED/LCD)";
            }
        }

        const reparacionName = reparacion === 'pin' ? 'Pin de carga' : reparacion === 'pantalla' ? 'Cambio de Pantalla/Display' : reparacion === 'bateria' ? 'Cambio de Batería' : reparacion;

        setResultado({ 
            min, 
            max, 
            custom,
            marca,
            gama,
            reparacion: reparacionName,
            rango: custom ? custom : `${formatGs(min)} - ${formatGs(max)}`
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
    const res = await enviarLeadCelular(data);
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
      modelo: formData.get('modelo'),
      incluyoMateriales: formData.get('incluyoMateriales'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioCelular(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  const setMarcaYReset = (m: string) => {
      setMarca(m);
      setGama(m === 'android' ? 'media' : 'reciente');
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
            ¿Cuánto cuesta reparar un <span className="text-blue-500 italic">celular en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Rangos genéricos estimados para fallas comunes. Los precios de pantallas varían drásticamente según la calidad elegida (Original, OLED, IPS).
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pin de carga (Básico)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">60 a 150 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Batería (Gama Media)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">150 a 250 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Software / Flasheo</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">70 a 150 mil</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DINÁMICA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Smartphone className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Cotizá tu reparación</h2>
                    <p className="text-xs text-slate-400 font-medium">Marcá el tipo de equipo y falla</p>
                </div>
            </div>

            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">1. Ecosistema</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                  <button onClick={() => setMarcaYReset('android')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${marca === 'android' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Android</button>
                  <button onClick={() => setMarcaYReset('apple')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${marca === 'apple' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Apple / iPhone</button>
                </div>
              </div>

              <div className="space-y-2 animate-in fade-in">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">2. Gama o Generación</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {gamasMap[marca as keyof typeof gamasMap].map((g: any) => (
                        <button key={g.id} onClick={() => setGama(g.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${gama === g.id ? 'border-blue-600 bg-blue-50/30 text-blue-800' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <span className="text-xs font-black uppercase">{g.label}</span>
                        </button>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">3. Tipo de Reparación</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'pantalla', label: 'Pantalla Rota', icon: MonitorSmartphone },
                    { id: 'bateria', label: 'Batería Mala', icon: BatteryCharging },
                    { id: 'pin', label: 'Pin de Carga', icon: Smartphone },
                    { id: 'mojado', label: 'Equipo Mojado', icon: Droplets },
                    { id: 'software', label: 'Software / Logo', icon: Zap },
                    { id: 'placa', label: 'No prende (Placa)', icon: Wrench },
                    { id: 'microfono', label: 'Micrófono / Parlante', icon: Phone },
                    { id: 'diagnostico', label: 'Revisión General', icon: Search }
                  ].map(r => {
                      const Icon = r.icon;
                      return (
                        <button key={r.id} onClick={() => setReparacion(r.id)} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${reparacion === r.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-500'}`}>
                            <Icon className="w-5 h-5" />
                            <span className="text-[9px] font-black uppercase text-center">{r.label}</span>
                        </button>
                      )
                  })}
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Costo Estimado: {resultado.reparacion}</p>
                    {resultado.custom ? (
                        <p className="text-2xl md:text-3xl font-[900] text-red-600 tracking-tighter italic leading-tight my-3 uppercase">
                            {resultado.custom}
                        </p>
                    ) : (
                        <p className="text-4xl md:text-5xl font-[900] text-emerald-600 tracking-tighter italic leading-none my-3">
                            Gs. {formatGs(resultado.min)} - {formatGs(resultado.max)}
                        </p>
                    )}
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 max-w-sm mx-auto text-pretty leading-relaxed">
                        * Incluye repuesto básico y mano de obra. Los repuestos originales (100% Genuine) suelen tener un costo significativamente mayor en todas las marcas.
                    </p>
                </div>

                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group">
                  <span className="uppercase tracking-widest text-xs font-black">Contactar Servicios Técnicos</span>
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
            <h3 className="text-2xl font-black uppercase tracking-tight">¿Arreglaste tu celular hace poco?</h3>
            <p className="text-xs font-medium leading-relaxed opacity-90">
              Ayudá a evitar estafas en el rubro técnico. Tu reporte anónimo alimenta nuestra base de precios reales para todos los paraguayos.
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
            Los rangos de precios de pantallas y repuestos son altamente volátiles debido a la calidad del insumo (OLED original, OLED genérico, INCELL, LCD). Los valores reflejados en esta calculadora actúan como un piso base referencial (fallback) para calidades genéricas aceptables y mano de obra en talleres comerciales del Gran Asunción. Las reparaciones de placa base (microsoldadura) se estiman con un mínimo por diagnóstico invasivo.
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
                  <input name="modelo" required placeholder="¿Qué equipo? (ej: iPhone 11)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: San Lorenzo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="si">Incluyó repuestos originales / HQ</option>
                    <option value="no">Repuesto genérico o solo mano de obra</option>
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