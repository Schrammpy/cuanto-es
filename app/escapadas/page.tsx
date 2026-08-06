'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, Check, MessageCircle, 
  Link as LinkIcon, MapPin, AlertTriangle, ChevronRight,
  Loader2, Info, ChevronDown, Locate
} from 'lucide-react';
import { buscarEscapadaAction } from './action';
import Footer from '@/components/Footer';

export default function EscapadasHome() {
  const [loading, setLoading] = useState(false);
  const [resultados, setRecomendaciones] = useState<any[]>([]);
  const [abierto, setAbierto] = useState<number | null>(null);
  
  // Lógica para el texto dinámico del subtítulo
  const departamentos = ["Cordillera", "Paraguarí", "Guairá", "Itapúa", "Misiones", "Central"];
  const [indexDept, setIndexDept] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndexDept((prev) => (prev + 1) % departamentos.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
        
        {/* CABECERA CON TEXTO DINÁMICO */}
        <header className="text-center space-y-2">
            <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter leading-tight uppercase">
                Descubrí tu <span className="text-blue-600 italic">próximo destino</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest h-5 transition-all duration-500">
                ¿Cuánto me sale una escapada a <span className="text-blue-500 border-b-2 border-blue-100">{departamentos[indexDept]}</span>?
            </p>
        </header>

        {/* BUSCADOR IA MEJORADO */}
        <form onSubmit={handleSearch} className="space-y-4">
            <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100">
                <div className="flex items-center gap-2 mb-3 px-1 text-slate-400">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Comentanos tus planes y te ayudamos</span>
                </div>
                <textarea 
                    name="consulta"
                    placeholder="Ej: Somos 2 de Asu, tenemos 600 mil y queremos naturaleza..."
                    className="w-full h-24 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed"
                />
                
                {/* EJEMPLOS CORTOS */}
                <div className="flex flex-wrap gap-2 mb-4 px-1">
                    <p className="text-[8px] font-bold text-slate-300 uppercase w-full">Sugerencias:</p>
                    <span className="text-[9px] bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 italic">"Piscina para 4 amigos"</span>
                    <span className="text-[9px] bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 italic">"Algo tranqui solo, bajo presupuesto"</span>
                </div>

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
                    
                    <div className="flex justify-between items-start mb-6">
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

                    {/* RESUMEN DEL DESTINO UNIFICADO */}
                    <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-6">
                        <div className="flex items-center gap-2 mb-3 text-blue-600">
                            <Locate className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-[900] uppercase tracking-[0.2em]">Resumen del Destino</span>
                        </div>
                        <p className="text-[12px] font-medium text-slate-600 leading-relaxed italic">
                            Ubicado en <span className="text-slate-900 font-bold">{res.ciudad}</span>, a unos <span className="text-slate-900 font-bold">{res.distancia_km} km</span> de la capital. 
                            Es un lugar ideal para {interpretarVibe(res.tags)}.
                            
                            {/* Lógica condicional de precios en el texto */}
                            {res.alojamiento_base > 0 && (
                                <> El precio de alojamiento ronda los <span className="text-blue-600 font-bold not-italic">Gs. {formatGs(res.alojamiento_base)}</span> por persona.</>
                            )}
                            
                            {res.precio_acceso > 0 ? (
                                <> Y si solo querés pasar el día, el costo de acceso es de <span className="text-blue-600 font-bold not-italic">Gs. {formatGs(res.precio_acceso)}</span> por persona.</>
                            ) : (
                                (res.precio_acceso === 0 && res.alojamiento_base === 0) && (
                                    <> Cabe destacar que el <span className="text-blue-600 font-bold underline not-italic">acceso es libre y gratuito</span>.</>
                                )
                            )}
                        </p>
                    </div>

                    {/* DETALLE DESPLEGABLE */}
                    <button 
                        onClick={() => setAbierto(abierto === i ? null : i)}
                        className="w-full flex items-center justify-center gap-2 py-3 mb-6 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors border-y border-slate-50"
                    >
                        <Info className="w-3 h-3" />
                        {abierto === i ? 'OCULTAR DESGLOSE' : '¿CÓMO LLEGAMOS A ESTE MONTO?'}
                        <ChevronDown className={`w-3 h-3 transition-transform ${abierto === i ? 'rotate-180' : ''}`} />
                    </button>

                    {abierto === i && (
                        <div className="mb-6 p-5 bg-blue-50/50 rounded-3xl space-y-3 animate-in slide-in-from-top-2 duration-300 border border-blue-100">
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Hospedaje + Entradas</span>
                                <span className="text-slate-800 font-black italic">Gs. {formatGs(res.detalles.alojamiento + res.detalles.entradas)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Combustible (Ida y Vuelta)</span>
                                <span className="text-slate-800 font-black italic">Gs. {formatGs(res.detalles.nafta)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Peajes Estimados</span>
                                <span className="text-slate-800 font-black italic">Gs. {formatGs(res.detalles.peajes)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase">
                                <span className="text-slate-500 font-bold">Comida y Bebida (Sug.)</span>
                                <span className="text-slate-800 font-black italic">Gs. {formatGs(res.detalles.comida)}</span>
                            </div>
                        </div>
                    )}

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
                        <div className="flex items-center justify-center gap-1.5 mt-6 opacity-60">
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            <p className="text-[8px] text-orange-600 font-bold uppercase italic tracking-tighter">
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