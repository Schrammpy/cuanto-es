'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getOrCreateUser } from '@/lib/user-store';
import { useRouter } from 'next/navigation';
import { Send, Clock, Shield, AlertTriangle, ChevronRight, Terminal, Activity } from 'lucide-react';

export default function MuroPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [sala, setSala] = useState<any>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMsg, setNuevoMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    const userData = getOrCreateUser();
    setUser(userData);
    fetchDatos();

    const channel = supabase
      .channel(`realtime_sala_${slug}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, 
      (payload) => { setMensajes((prev) => [payload.new, ...prev]); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [slug]);

  async function fetchDatos() {
    const { data: salaData } = await supabase.from('salas').select('*').eq('slug', slug).single();
    if (salaData) {
      setSala(salaData);
      const { data: msgs } = await supabase.from('mensajes').select('*').eq('sala_id', salaData.id).order('created_at', { ascending: false });
      if (msgs) setMensajes(msgs);
    }
    setLoading(false);
  }

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoMsg.trim() || !user || !sala) return;
    const { error } = await supabase.from('mensajes').insert([{
      sala_id: sala.id, autor_uuid: user.id, autor_nick: user.nick, contenido: nuevoMsg
    }]);
    if (!error) setNuevoMsg('');
  }

  if (loading) return <div className="h-screen bg-[#060B16] flex items-center justify-center font-mono text-blue-500 animate-pulse uppercase tracking-[0.3em]">Inicializando HUD...</div>;
  if (!sala) return <div className="h-screen bg-[#060B16] flex items-center justify-center text-white font-mono uppercase text-[10px]">Error: Nodo no encontrado</div>;

  return (
    <main className="min-h-screen bg-[#060B16] text-white flex flex-col items-center overflow-hidden font-sans">
      <div className="max-w-md w-full flex flex-col h-screen relative">
        
        {/* HEADER INMERSIVO (Sin Logo, solo la Sala) */}
        <header className="p-6 border-b border-white/5 bg-[#0A101F]/95 backdrop-blur-xl">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                        <h1 className="text-lg font-black uppercase tracking-tight text-slate-100">{sala.nombre}</h1>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Activity className="w-2.5 h-2.5 text-slate-600" />
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Canal de proximidad activo</span>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex flex-col items-end shrink-0">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter leading-none">{user?.nick}</span>
                    <span className="text-[6px] text-slate-500 font-bold uppercase mt-1">Status: Anon</span>
                </div>
            </div>
        </header>

        {/* CHAT/MURO AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col-reverse scrollbar-hide">
            {mensajes.map((m) => (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className={`text-[9px] font-black tracking-widest uppercase ${m.autor_uuid === user?.id ? 'text-blue-500' : 'text-slate-500'}`}>
                            {m.autor_nick}
                        </span>
                        <span className="text-[7px] text-slate-700 font-bold uppercase">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className={`p-4 rounded-2xl rounded-tl-none max-w-[95%] text-sm font-medium leading-relaxed ${m.autor_uuid === user?.id ? 'bg-blue-600/10 border border-blue-500/20 text-blue-50 shadow-[0_0_15px_rgba(37,99,235,0.05)]' : 'bg-white/5 border border-white/5 text-slate-300'}`}>
                        {m.contenido}
                    </div>
                </div>
            ))}

            <div className="bg-blue-900/10 border border-blue-500/10 p-8 rounded-[2.5rem] text-center mb-10 border-dashed">
                <Shield className="w-6 h-6 text-blue-500/40 mx-auto mb-3" />
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Espacio Efímero</p>
                <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight italic">
                    Este muro se purga automáticamente cada 24 horas. <br/> Sin rastro, sin archivos.
                </p>
            </div>
        </div>

        {/* INPUT FIJO */}
        <div className="p-4 bg-[#0A101F] border-t border-white/5">
            <form onSubmit={enviarMensaje} className="flex gap-2">
                <input 
                    value={nuevoMsg}
                    onChange={(e) => setNuevoMsg(e.target.value)}
                    placeholder="Escribí un mensaje..."
                    className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500/30 text-sm placeholder:text-slate-800 transition-all font-medium text-slate-200"
                />
                <button className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl active:scale-90 transition-all shadow-xl shadow-blue-900/30">
                    <Send className="w-5 h-5 text-white" />
                </button>
            </form>
        </div>

        {/* FOOTER EXCLUSIVO CON ADVERTENCIA */}
        <footer className="px-6 py-4 bg-[#060B16] border-t border-white/5">
            <button 
                onClick={() => setShowExitWarning(true)}
                className="w-full flex items-center justify-between group"
            >
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-slate-700" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.1em]">
                        Herramienta exclusiva de <span className="text-blue-900 group-hover:text-blue-600 transition-colors italic">CuantoEs.com.py</span>
                    </span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-800 group-hover:text-blue-600" />
            </button>
        </footer>

        {/* MODAL DE ADVERTENCIA AL SALIR */}
        {showExitWarning && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowExitWarning(false)}></div>
                <div className="bg-slate-900 border-2 border-red-500/30 p-8 rounded-[2.5rem] w-full max-w-sm relative z-110 shadow-2xl text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Estás saliendo del muro</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                        Este espacio es efímero. Para volver a ingresar deberás <span className="text-white font-bold italic underline decoration-red-500">escanear el código QR</span> nuevamente. <br/><br/> ¿Querés continuar?
                    </p>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => router.push('/')}
                            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-900/40"
                        >
                            SÍ, IR AL INICIO
                        </button>
                        <button 
                            onClick={() => setShowExitWarning(false)}
                            className="w-full bg-transparent text-slate-500 font-bold py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:text-white"
                        >
                            CANCELAR Y QUEDARME
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </main>
  );
}