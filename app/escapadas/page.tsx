'use client';
import React, { useState } from 'react';
import { 
  Search, Sparkles, Check, MessageCircle, 
  Instagram, MapPin, AlertTriangle, ChevronRight,
  Wallet, Users, Loader2
} from 'lucide-react';
import { buscarEscapadaAction } from './action';
import Footer from '@/components/Footer';

export default function EscapadasHome() {
  const [loading, setLoading] = useState(false);
  const [resultados, setRecomendaciones] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setRecomendaciones([]);
    
    try {
        const formData = new FormData(e.currentTarget);
        const consulta = formData.get('consulta') as string;
        
        if (!consulta) {
            alert("Escribí algo primero, socio.");
            setLoading(false);
            return;
        }

        const data = await buscarEscapadaAction(consulta);
        
        if (data && 'error' in data) {
            alert("Detalle: " + data.error);
        } else if (Array.isArray(data)) {
            setRecomendaciones(data);
            if (data.length === 0) {
                alert("Hína... con ese presupuesto no llegamos a los destinos cargados. Probá subiendo un poco el monto.");
            }
        }
    } catch (err) {
        alert("Ocurrió un error al conectar con el servidor.");
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
        
        {/* CABECERA */}
        <header className="text-center space-y-2">
            <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter leading-tight">
                ¿HASTA DÓNDE <br/> <span className="text-blue-600 italic uppercase">LLEGO HOY?</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                Tu presupuesto primero. El destino después.
            </p>
        </header>

        {/* INPUT DE BÚSQUEDA IA */}
        <form onSubmit={handleSearch} className="space-y-4">
            <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contale tus planes a la IA</span>
                </div>
                <textarea 
                    name="consulta"
                    placeholder="Ej: Somos 2 de Asu, tenemos 800 mil y queremos ir a un arroyo este finde..."
                    className="w-full h-24 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed"
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-[900] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="tracking-tight uppercase text-xs">Calculando Gasto Seguro...</span>
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4" /> 
                            <span className="tracking-tight uppercase text-xs">VER OPCIONES REALES</span>
                        </>
                    )}
                </button>
            </div>
        </form>

        {/* LISTA DE RESULTADOS */}
        <div className="space-y-6 pb-10">
            {resultados.map((res, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-tighter">
                                    {res.ciudad}, {res.departamento}
                                </span>
                                {res.precio_confirmado && (
                                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg uppercase tracking-tighter flex items-center gap-1">
                                        <Check className="w-2.5 h-2.5" /> Verificado
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-[900] text-slate-800 leading-tight pt-1">{res.nombre}</h3>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gasto Seguro</p>
                            <p className="text-xl font-[900] text-emerald-600 leading-none mt-1">Gs. {formatGs(res.gastoProbable)}</p>
                        </div>
                    </div>

                    {/* DESGLOSE RÁPIDO */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
                            <p className="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Alojamiento est.</p>
                            <p className="text-xs font-black text-slate-700">Gs. {formatGs(res.alojamiento_base)}</p>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
                            <p className="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Entrada/Acceso</p>
                            <p className="text-xs font-black text-slate-700">Gs. {formatGs(res.precio_acceso)}</p>
                        </div>
                    </div>
                    
                    {/* BARRA DE COLCHÓN */}
                    <div className="bg-blue-50 rounded-2xl p-4 flex justify-between items-center border border-blue-100 shadow-inner">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-blue-600 uppercase leading-none">Te sobran</span>
                            <span className="text-[8px] text-blue-400 font-bold uppercase mt-1 italic">Para el asado/bebida</span>
                        </div>
                        <span className="text-lg font-[900] text-blue-700 italic">Gs. {formatGs(res.colchon)} 🛡️</span>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="grid grid-cols-2 gap-3 mt-5">
                        {res.telefono_reserva && (
                            <a 
                                href={`https://api.whatsapp.com/send?phone=${res.telefono_reserva}&text=Hola!%20Vi%20tu%20lugar%20en%20CuantoEs.com.py%20y%20quisiera%20consultar%20disponibilidad.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] text-white py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"
                            >
                                <MessageCircle className="w-4 h-4" /> Reservar
                            </a>
                        )}
                        {res.sitio_web_oficial && (
                            <a 
                                href={res.sitio_web_oficial}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                <Instagram className="w-4 h-4 text-pink-500" /> Ver Fotos
                            </a>
                        )}
                    </div>
                    
                    {/* ALERTA CAMINO TIERRA */}
                    {res.es_camino_tierra && (
                        <div className="flex items-center justify-center gap-1.5 mt-4 opacity-70">
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