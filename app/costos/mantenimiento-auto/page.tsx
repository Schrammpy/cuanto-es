'use client';
import React, { useState } from 'react';
import { 
  Car, Wrench, Settings, TrendingUp, Calculator, 
  ChevronRight, CheckCircle2, Loader2, User, 
  Phone, MapPin, X, Send, Activity, Settings2 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadAutomotor, guardarPrecioAutomotor } from './action';

export default function AutomotorPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados del vehículo
  const [vehiculo, setVehiculo] = useState('auto'); // auto, suv, pickup, utilitario
  
  // Estados de servicios (Checkboxes)
  const [servicios, setServicios] = useState({
    aceite: false,
    alineacion: false,
    balanceo: false,
    pastillas: false,
    scanner: false,
    inyectores: false
  });

  // Sub-opciones
  const [tipoAceite, setTipoAceite] = useState('semi'); // mineral, semi, sintetico
  const [ejePastillas, setEjePastillas] = useState('delanteras'); // delanteras, traseras, ambas

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Modales
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const formatGs = (num: number) => new Intl.NumberFormat('es-PY').format(Math.round(num));

  const toggleServicio = (key: keyof typeof servicios) => {
    setServicios(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let totalBase = 0;
        let desglose = [];

        // 1. Cálculo de Aceite y Filtros
        if (servicios.aceite) {
            let precioAceite = 250000;
            if (tipoAceite === 'semi') precioAceite = 300000;
            if (tipoAceite === 'sintetico') precioAceite = 380000;
            totalBase += precioAceite;
            desglose.push({ nombre: `Cambio de Aceite (${tipoAceite}) + Filtros`, precio: precioAceite });
        }

        // 2. Alineación y Balanceo (Combo o separados)
        if (servicios.alineacion && servicios.balanceo) {
            totalBase += 200000; // Precio combo
            desglose.push({ nombre: 'Alineación + Balanceo', precio: 200000 });
        } else {
            if (servicios.alineacion) {
                totalBase += 110000;
                desglose.push({ nombre: 'Alineación', precio: 110000 });
            }
            if (servicios.balanceo) {
                totalBase += 130000;
                desglose.push({ nombre: 'Balanceo', precio: 130000 });
            }
        }

        // 3. Pastillas de Freno
        if (servicios.pastillas) {
            const multEje = ejePastillas === 'ambas' ? 2 : 1;
            const precioPastillas = 140000 * multEje;
            totalBase += precioPastillas;
            desglose.push({ nombre: `Pastillas de Freno (${ejePastillas}) - Mano de obra`, precio: precioPastillas });
        }

        // 4. Scanner e Inyectores
        if (servicios.scanner) {
            totalBase += 115000;
            desglose.push({ nombre: 'Diagnóstico Scanner', precio: 115000 });
        }
        if (servicios.inyectores) {
            totalBase += 225000;
            desglose.push({ nombre: 'Limpieza Inyectores', precio: 225000 });
        }

        if (totalBase === 0) {
            alert("⚠️ Seleccioná al menos un servicio para calcular.");
            setLoading(false);
            return;
        }

        // 5. Multiplicador por tipo de Vehículo (Según PDF)
        let multiplicador = 1.0;
        if (vehiculo === 'suv') multiplicador = 1.10;
        if (vehiculo === 'pickup') multiplicador = 1.15;
        if (vehiculo === 'utilitario') multiplicador = 1.20;

        const totalFinal = Math.round((totalBase * multiplicador) / 1000) * 1000;

        setResultado({ 
            total: totalFinal, 
            vehiculo,
            servicios_activos: desglose,
            multiplicador
        });
        setLoading(false);
    }, 600);
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
    const res = await enviarLeadAutomotor(data);
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
    const res = await guardarPrecioAutomotor(data);
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
            ¿Cuánto cuesta el mantenimiento <span className="text-blue-500 italic">de un auto?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Estimación referencial para servicios preventivos estandarizados en Paraguay. No incluye reparaciones complejas de motor o chapería.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aceite + Filtros (Auto)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">280 a 350 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Alineación + Balanceo</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">150 a 250 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mano de Obra Gral.</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">Desde 100 mil</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DINÁMICA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-6 md:p-12 border border-slate-100 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Car className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Armá tu presupuesto</h2>
                    <p className="text-xs text-slate-400 font-medium">Marcá los servicios que necesitás</p>
                </div>
            </div>

            <div className="space-y-8">
              
              {/* TIPO DE VEHÍCULO */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">1. Tipo de Vehículo</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'auto', label: 'Automóvil' },
                    { id: 'suv', label: 'Camioneta / SUV' },
                    { id: 'pickup', label: 'Pickup (4x4)' },
                    { id: 'utilitario', label: 'Utilitario / Furgón' }
                  ].map(item => (
                    <button key={item.id} onClick={() => setVehiculo(item.id)} className={`p-3 rounded-2xl border-2 text-center transition-all ${vehiculo === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-black shadow-sm' : 'border-slate-100 text-slate-500 font-bold hover:bg-slate-50'}`}>
                      <span className="text-[11px] uppercase">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SERVICIOS PRINCIPALES (Checkboxes Visuales) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">2. Servicios a realizar</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Item: Aceite */}
                  <div className={`border-2 rounded-2xl p-4 transition-all ${servicios.aceite ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={servicios.aceite} onChange={() => toggleServicio('aceite')} className="w-5 h-5 accent-blue-600" />
                        <span className="font-bold text-sm text-slate-700 uppercase">Cambio de Aceite + Filtros</span>
                    </label>
                    {/* Sub-opciones de Aceite */}
                    {servicios.aceite && (
                        <div className="mt-4 pl-8 space-y-2 animate-in fade-in duration-300">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Calidad del Aceite:</p>
                            <div className="flex gap-2">
                                {['mineral', 'semi', 'sintetico'].map(t => (
                                    <button key={t} onClick={() => setTipoAceite(t)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${tipoAceite === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                                        {t === 'semi' ? 'Semi-Sint.' : t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>

                  {/* Item: Frenos */}
                  <div className={`border-2 rounded-2xl p-4 transition-all ${servicios.pastillas ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={servicios.pastillas} onChange={() => toggleServicio('pastillas')} className="w-5 h-5 accent-blue-600" />
                        <span className="font-bold text-sm text-slate-700 uppercase">Cambio de Pastillas</span>
                    </label>
                    {/* Sub-opciones de Frenos */}
                    {servicios.pastillas && (
                        <div className="mt-4 pl-8 space-y-2 animate-in fade-in duration-300">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Eje a reparar:</p>
                            <div className="flex gap-2">
                                {['delanteras', 'traseras', 'ambas'].map(t => (
                                    <button key={t} onClick={() => setEjePastillas(t)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${ejePastillas === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[8px] text-slate-400 italic pt-1">* Calculamos solo mano de obra.</p>
                        </div>
                    )}
                  </div>

                  {/* Items Simples */}
                  {[
                      { key: 'alineacion', label: 'Alineación' },
                      { key: 'balanceo', label: 'Balanceo (4 ruedas)' },
                      { key: 'scanner', label: 'Diagnóstico Scanner' },
                      { key: 'inyectores', label: 'Limpieza Inyectores' }
                  ].map(item => (
                    <label key={item.key} className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer transition-all ${servicios[item.key as keyof typeof servicios] ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={servicios[item.key as keyof typeof servicios]} onChange={() => toggleServicio(item.key as keyof typeof servicios)} className="w-5 h-5 accent-blue-600" />
                        <span className="font-bold text-sm text-slate-700 uppercase">{item.label}</span>
                    </label>
                  ))}

                </div>
              </div>

            </div>

            <button onClick={calcular} disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings2 className="w-5 h-5 text-blue-400" />}
              Calcular Mantenimiento
            </button>

            {/* RESULTADO Y LEAD */}
            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
                <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Presupuesto Estimado Total</p>
                    <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic leading-none my-3">
                        Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                    </p>
                    {resultado.multiplicador > 1 && (
                        <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mb-4">
                            Incluye recargo por tipo de vehículo ({resultado.vehiculo})
                        </p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 text-left space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Desglose de servicios:</p>
                        {resultado.servicios_activos.map((s: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                                <span className="uppercase flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> {s.nombre}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group">
                  <span className="uppercase tracking-widest text-xs font-black">Solicitar Talleres Verificados</span>
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
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Llevaste tu vehículo al taller hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Ayudá a que los precios en Paraguay sean justos. Reportá tu costo de forma 100% anónima para actualizar el índice.
            </p>
          </div>
          <button onClick={() => setShowReportModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest shrink-0">
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
            Los valores son referenciales y pueden variar según marca, modelo, estado, ubicación, repuestos y profesional contratado. Las estimaciones de CuantoEs combinan investigaciones en portales locales, aportes de usuarios y datos de talleres estándar. Para reparaciones complejas, siempre se requiere inspección presencial.
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
                <p className="text-xs text-slate-400 font-medium">Conectaremos tu pedido con talleres recomendados.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Contactar Talleres</h3>
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

      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {reportSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Aporte Guardado!</p>
                <p className="text-xs text-slate-400 font-medium">Gracias por sumar transparencia al mercado automotor.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te cobraron?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: San Lorenzo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="si">Incluyó repuestos / aceite</option>
                    <option value="no">Solo mano de obra</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: auto Kia Rio, cambio de aceite sintético)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
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