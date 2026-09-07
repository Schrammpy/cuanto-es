'use client';
import React, { useState } from 'react';
import { 
  Truck, Info, ChevronRight, CheckCircle2, 
  Calculator, ArrowLeft, Loader2, User, Phone, 
  MapPin, X, Check, Send, Package, Boxes, Warehouse 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadFlete } from './action';



export default function FletesPage() {
  const [tamano, setTamano] = useState('estandar');
  const [ayudantes, setAyudantes] = useState(1);
  const [distancia, setDistancia] = useState('local'); // local, 20km, 50km, larga
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let base = 0;
        let kmExtra = 0;

        // Precios base por tipo de vehículo
        if (tamano === 'chico') base = 150000;
        else if (tamano === 'estandar') base = 350000;
        else base = 650000;

        // Recargo por distancia
        if (distancia === '20km') kmExtra = 80000;
        else if (distancia === '50km') kmExtra = 250000;
        else if (distancia === 'larga') kmExtra = 600000;

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
    const res = await enviarLeadFlete(data);
    if (res.success) {
        setLeadSent(true);
        setTimeout(() => { setShowForm(false); setLeadSent(false); }, 3000);
    }
    setFormLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 pt-8 text-slate-700">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Inicio
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* COLUMNA IZQUIERDA: INFO */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full">
              <Truck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logística y Mudanzas</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter leading-none">
              ¿Cuánto sale <br/> <span className="text-blue-600 italic font-black">un flete hoy?</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                Calculá el costo estimado para tu mudanza o traslado de mercaderías en Paraguay.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 space-y-4">
            <h3 className="text-sm font-black uppercase text-blue-700">Tips para tu mudanza:</h3>
            <ul className="space-y-3">
                {[
                    "Desarmá tus muebles antes para ahorrar tiempo.",
                    "El precio varía si hay que subir pisos por escalera.",
                    "Asegurá tus objetos frágiles con film o burbuja.",
                    "Reservá el flete con al menos 48hs de antelación."
                ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-blue-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {txt}
                    </li>
                ))}
            </ul>
          </div>
        </div>

        {/* COLUMNA DERECHA: CALCULADORA */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100 space-y-8 sticky top-24 text-slate-700">
            <div className="space-y-6">
              
              {/* TAMAÑO DE CARGA */}
              <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de Carga / Camión</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'chico', label: 'Solo 1 mueble', icon: <Package className="w-4 h-4" /> },
                        { id: 'estandar', label: 'Dpto / Casa', icon: <Boxes className="w-4 h-4" /> },
                        { id: 'grande', label: 'Oficina / XL', icon: <Warehouse className="w-4 h-4" /> }
                    ].map(item => (
                        <button key={item.id} onClick={() => setTamano(item.id)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${tamano === item.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'}`}>
                            {item.icon}
                            <span className="text-[8px] font-black uppercase text-center leading-tight">{item.label}</span>
                        </button>
                    ))}
                  </div>
              </div>

              {/* DISTANCIA */}
              <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Distancia del viaje</label>
                  <select 
                    value={distancia} 
                    onChange={(e) => setDistancia(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-sm appearance-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all"
                  >
                    <option value="local">Misma ciudad / Zona (0-10km)</option>
                    <option value="20km">Entre ciudades cercanas (10-25km)</option>
                    <option value="50km">Distancia media (25-60km)</option>
                    <option value="larga">Larga distancia (+100km)</option>
                  </select>
              </div>

              {/* AYUDANTES */}
              <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Ayudantes</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Carga y descarga</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setAyudantes(Math.max(0, ayudantes - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">-</button>
                    <span className="font-black text-xl text-slate-800">{ayudantes}</span>
                    <button onClick={() => setAyudantes(ayudantes + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">+</button>
                </div>
              </div>
            </div>

            <button onClick={calcular} disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
              Calcular flete
            </button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Presupuesto Estimado</p>
                    <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic leading-none">
                        Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Vehículo</p>
                        <p className="text-sm font-black text-slate-700">Gs. {new Intl.NumberFormat('es-PY').format(resultado.base + resultado.kmExtra)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Personal</p>
                        <p className="text-sm font-black text-slate-700">Gs. {new Intl.NumberFormat('es-PY').format(resultado.costoAyudantes)}</p>
                    </div>
                </div>

                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group">
                  <span className="uppercase tracking-widest text-xs font-black">Solicitar Flete Verificado</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
        </div>
      </section>

      {/* MODAL LEAD */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
            <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl text-slate-700">
                <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
                {leadSent ? (
                    <div className="text-center py-10 space-y-4">
                        <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center"><Check className="w-8 h-8" /></div>
                        <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">¡Pedido enviado!</h3>
                        <p className="text-sm text-slate-500 font-medium leading-tight">Un fletero verificado te contactará pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-6">
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">Confirmar Mudanza</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recibí presupuestos reales ahora</p>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100"><User className="w-4 h-4 text-slate-300 mr-3" /><input name="nombre" required placeholder="Nombre y Apellido" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" /></div>
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100"><Phone className="w-4 h-4 text-slate-300 mr-3" /><input name="telefono" required type="tel" placeholder="Nro de Teléfono" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" /></div>
                            <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100"><MapPin className="w-4 h-4 text-slate-300 mr-3" /><input name="ciudad" required placeholder="Ciudad de Origen" className="bg-transparent w-full outline-none text-sm font-bold text-slate-700" /></div>
                        </div>
                        <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                            {formLoading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Enviar Solicitud</>}
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