'use client';
import React, { useState } from 'react';
import { 
  Search, Sparkles, Check, MessageCircle, 
  Link as LinkIcon, MapPin, AlertTriangle, ChevronRight,
  Loader2, Info, ChevronDown
} from 'lucide-react';
import { buscarEscapadaAction } from './action';
import Footer from '@/components/Footer';

export default function EscapadasHome() {
  const [loading, setLoading] = useState(false);
  const [resultados, setRecomendaciones] = useState<any[]>([]);
  const [abierto, setAbierto] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setRecomendaciones([]);
    setAbierto(null);
    
    try {
        const formData = new FormData(e.currentTarget);
        const consulta = formData.get('consulta') as string;
        const data = await buscarEscapadaAction(consulta);
        
        if (data && 'error' in data) {
            alert(data.error);
        } else if (Array.isArray(data)) {
            setRecomendaciones(data);
        }
    } catch (err) {
        alert("Error de conexión.");
    } finally {
        setLoading(false);
    }
  };

  const formatGs = (num: number) => {
    return new Intl.NumberFormat('es-PY').format(Math.round(num));
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 pt-6">
        
        <header className="text-center space-y-2">
            <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter leading-tight italic">
                ¿HASTA DÓNDE <br/> <span className="text-blue-600 uppercase">LLEGO HOY?</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Tu presupuesto primero. El destino después.
            </p>
        </header>

        <form onSubmit={handleSearch} className="space-y-4">
            <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100">
                <div className="flex items-center gap-2 mb-3 px-1 text-blue-500">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contale tus planes a la IA</span>
                </div>
                <textarea 
                    name="consulta"
                    placeholder="Ej: Somos 2 de Asu, tenemos 600 mil y queremos naturaleza..."
                    className="w-full h-24 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed"
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-[900] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-200"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="tracking-tight uppercase text-xs">VER OPCIONES REALES</span>
                </button>
            </div>
        </form>

        <div className="space-y-6 pb-10">
            {resultados.map((res, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg uppercase">
                                {res.ciudad}, {res.departamento}
                            </span>
                            <h3 className="text-xl font-[900] text-slate-800 leading-tight pt-1">{res.nombre}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gasto Seguro</p>
                            <p className="text-xl font-[900] text-emerald-600 leading-none mt-1">Gs. {formatGs(res.gastoProbable)}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4 flex justify-between items-center border border-blue-100 shadow-inner mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-blue-600 uppercase leading-none">Te sobran</span>
                            <span className="text-[8px] text-blue-400 font-bold uppercase mt-1 italic">Para el asado/bebida</span>
                        </div>
                        <span className="text-lg font-[900] text-blue-700 italic">Gs. {formatGs(res.colchon)} 🛡️</span>
                    </div>

                    {/* BOTÓN DESGLOSE */}
                    <button 
                        onClick={() => setAbierto(abierto === i ? null : i)}
                        className="w-full flex items-center justify-center gap-2 py-2 mb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                    >
                        <Info className="w-3 h-3" />
                        {abierto === i ? 'Ocultar detalles' : '¿Cómo se calculó esto?'}
                        <ChevronDown className={`w-3 h-3 transition-transform ${abierto === i ? 'rotate-180' : ''}`} />
                    </button>

                    {/* TABLA DE DESGLOSE */}
                    {abierto === i && (
                        <div className="mb-6 p-5 bg-slate-50 rounded-3xl space-y-3 animate-in slide-in-from-top-2 duration-300 border border-slate-100">
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-400 font-bold">Hospedaje + Entradas</span>
                                <span className="text-slate-700 font-black italic">Gs. {formatGs(res.detalles.alojamiento + res.detalles.entradas)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-400 font-bold">Combustible Est.</span>
                                <span className="text-slate-700 font-black italic">Gs. {formatGs(res.detalles.nafta)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-400 font-bold">Peajes (Ida y Vuelta)</span>
                                <span className="text-slate-700 font-black italic">Gs. {formatGs(res.detalles.peajes)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-400 font-bold">Comida y Agua (Sug.)</span>
                                <span className="text-slate-700 font-black italic">Gs. {formatGs(res.detalles.comida)}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 text-center">
                                <p className="text-[8px] text-slate-400 italic">Cálculos para tu grupo basados en promedios reales.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {res.telefono_reserva && (
                            <a href={`https://api.whatsapp.com/send?phone=${res.telefono_reserva}&text=Hola!%20Consulta%20desde%20CuantoEs.com.py`} target="_blank" className="bg-[#25D366] text-white py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-100">
                                <MessageCircle className="w-4 h-4" /> Reservar
                            </a>
                        )}
                        {res.sitio_web_oficial && (
                            <a href={res.sitio_web_oficial} target="_blank" className="bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <LinkIcon className="w-4 h-4 text-blue-500" /> Ver Más
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>

        <Footer />
      </div>
    </main>
  );
}