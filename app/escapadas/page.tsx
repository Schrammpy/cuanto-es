'use client';
import React, { useState } from 'react';
import { Search, Wallet, Users, Car, ChevronRight, Sparkles } from 'lucide-react';
import { buscarEscapadaAction } from './action';

export default function EscapadasHome() {
  const [loading, setLoading] = useState(false);
  const [resultados, setRecomendaciones] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setRecomendaciones([]); // Limpiamos resultados anteriores
    
    try {
        const formData = new FormData(e.currentTarget);
        const consulta = formData.get('consulta') as string;
        
        if (!consulta) {
            alert("Escribí algo primero, socio.");
            setLoading(false);
            return;
        }

        const data = await buscarEscapadaAction(consulta);
        
        if (Array.isArray(data)) {
            setRecomendaciones(data);
            if (data.length === 0) alert("Hína... con ese presupuesto no llegamos a los destinos cargados. Probá subiendo el monto.");
        } else {
            alert("E'a, Gemini se mareó. Probá de nuevo.");
        }
    } catch (err) {
        alert("Ocurrió un error inesperado.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 pt-6">
        
        <header className="text-center space-y-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">
                ¿HASTA DÓNDE <br/> <span className="text-blue-600 italic">LLEGO HOY?</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Tu presupuesto primero. El destino después.
            </p>
        </header>

        {/* INPUT NATURAL (El gancho) */}
        <form onSubmit={handleSearch} className="space-y-4">
            <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100">
                <textarea 
                    name="consulta"
                    placeholder="Ej: Somos 3 de Asu, tenemos 1 millón y medio, queremos naturaleza con arroyo..."
                    className="w-full h-24 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none"
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-200"
                >
                    {loading ? <span className="animate-pulse">Calculando rutas...</span> : <><Sparkles className="w-4 h-4" /> VER OPCIONES POSIBLES</>}
                </button>
            </div>
        </form>

        {/* LISTA DE RESULTADOS (Las 3 OPCIONES) */}
        <div className="space-y-4">
            {resultados.map((res, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg uppercase">{res.departamento}</span>
                            <h3 className="text-xl font-black text-slate-800 mt-1">{res.nombre}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Gasto Probable</p>
                            <p className="text-lg font-black text-emerald-600">Gs. {new Intl.NumberFormat('es-PY').format(res.gastoProbable)}</p>
                        </div>
                    </div>
                    
                    {/* BARRA DE COLCHÓN */}
                    <div className="bg-slate-50 rounded-2xl p-3 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Colchón de seguridad</span>
                        <span className="text-xs font-black text-slate-700">Gs. {new Intl.NumberFormat('es-PY').format(res.colchon)} ✅</span>
                    </div>

                    <button className="w-full mt-4 py-3 text-[10px] font-black uppercase text-blue-600 border-2 border-blue-50 rounded-xl hover:bg-blue-50 transition-colors">
                        Ver Itinerario Seguro
                    </button>
                </div>
            ))}
        </div>
      </div>
    </main>
  );
}