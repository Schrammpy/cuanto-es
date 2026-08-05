'use client';
import React, { useState } from 'react';
import { 
  Search, Sparkles, Check, MessageCircle, 
  Link as LinkIcon, MapPin, AlertTriangle, ChevronRight,
  Loader2, Info, ChevronDown, Navigation, Locate
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

  // Función para interpretar la "onda" del lugar según los tags
  const interpretarVibe = (tags: string[]) => {
    if (tags.includes('arroyo') || tags.includes('cascada')) return "mojarte y conectar con la naturaleza";
    if (tags.includes('piscina')) return "darte un chapuzón y relajarte";
    if (tags.includes('cerro') || tags.includes('aventura')) return "una aventura con vistas increíbles";
    if (tags.includes('historia') || tags.includes('cultura')) return "un paseo cultural y educativo";
    if (tags.includes('relax') || tags.includes('paz')) return "desconectarte y descansar del ruido";
    return "una escapada diferente";
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
                    placeholder="Ej: Somos 2, tenemos 500 mil y queremos relax..."
                    className="w-full h-24 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed"
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-[900] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-200"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="tracking-tight uppercase text-[11px]">CALCULAR ESCAPADA</span>
                </button>
            </div>
        </form>

        <div className="space-y-8 pb-10">
            {resultados.map((res, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* CABECERA DE LA TARJETA */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-tighter">
                                    {res.departamento}
                                </span>
                                {res.precio_confirmado && (
                                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg uppercase tracking-tighter flex items-center gap-1">
                                        <Check className="w-2 h-2" /> Verificado
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-[900] text-slate-800 leading-tight pt-1">{res.nombre}</h3>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gasto Estimado</p>
                            <p className="text-xl font-[900] text-emerald-600 leading-none mt-1">Gs. {formatGs(res.gastoProbable)}</p>
                        </div>
                    </div>

                    {/* RESUMEN DEL LUGAR (Reemplaza a "Te Sobran") */}
                    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 mb-6">
                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                            <Locate className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Resumen del Destino</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600 leading-relaxed italic">
                            Ubicado en <span className="text-slate-900">{res.ciudad}</span>, a unos <span className="text-slate-900">{res.distancia_km} km</span> de la capital. 
                            Es un lugar ideal para <span className="text-blue-600 font-bold">{interpretarVibe(res.tags)}</span>.
                        </p>
                    </div>

                    {/* MINI TABLA DE PRECIOS BASE */}
                    <div className="grid grid-cols-2 gap-3 mb-6 px-1">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Alojamiento/Pers.</span>
                            <div className="bg-slate-50 py-2 rounded-xl text-center font-black text-slate-700 text-xs italic">
                                Gs. {formatGs(res.alojamiento_base)}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Entrada/Acceso</span>
                            <div className="bg-slate-50 py-2 rounded-xl text-center font-black text-slate-700 text-xs italic">
                                Gs. {formatGs(res.precio_acceso)}
                            </div>
                        </div>
                    </div>

                    {/* DETALLE DESPLEGABLE */}
                    <button 
                        onClick={() => setAbierto(abierto === i ? null : i)}
                        className="w-full flex items-center justify-center gap-2 py-2 mb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors border-y border-slate-50"
                    >
                        <Info className="w-3 h-3" />
                        {abierto === i ? 'OCULTAR DESGLOSE' : '¿CÓMO LLEGAMOS A ESTE MONTO?'}
                        <ChevronDown className={`w-3 h-3 transition-transform ${abierto === i ? 'rotate-180' : ''}`} />
                    </button>

                    {abierto === i && (
                        <div className="mb-6 p-5 bg-blue-50/50 rounded-3xl space-y-3 animate-in slide-in-from-top-2 duration-300 border border-blue-100">
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Hospedaje + Entradas</span>
                                <span className="text-slate-800 font-black">Gs. {formatGs(res.detalles.alojamiento + res.detalles.entradas)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Combustible (Ida y Vuelta)</span>
                                <span className="text-slate-800 font-black">Gs. {formatGs(res.detalles.nafta)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Peajes Estimados</span>
                                <span className="text-slate-800 font-black">Gs. {formatGs(res.detalles.peajes)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Comida y Bebida (Sug.)</span>
                                <span className="text-slate-800 font-black">Gs. {formatGs(res.detalles.comida)}</span>
                            </div>
                        </div>
                    )}

                    {/* BOTONES DE ACCIÓN ACTUALIZADOS */}
                    <div className="grid grid-cols-2 gap-3">
                        {res.telefono_reserva && (
                            <a href={`https://api.whatsapp.com/send?phone=${res.telefono_reserva}&text=Hola!%20Consulta%20desde%20CuantoEs.com.py`} target="_blank" className="bg-[#25D366] text-white py-4 rounded-2xl text-[9px] font-black uppercase flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-lg shadow-green-100">
                                <MessageCircle className="w-4 h-4" /> 
                                WHATSAPP PARA RESERVAS
                            </a>
                        )}
                        {res.sitio_web_oficial && (
                            <a href={res.sitio_web_oficial} target="_blank" className="bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl text-[9px] font-black uppercase flex flex-col items-center justify-center gap-1 active:scale-95 transition-all">
                                <LinkIcon className="w-4 h-4 text-blue-500" /> 
                                SITIO OFICIAL
                            </a>
                        )}
                    </div>

                    {res.es_camino_tierra && (
                        <div className="flex items-center justify-center gap-1.5 mt-5 opacity-70">
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            <p className="text-[8px] text-orange-600 font-bold uppercase italic">
                                Acceso con tramos de tierra
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>

        <Footer />
      </div>
    </main>
  );
}