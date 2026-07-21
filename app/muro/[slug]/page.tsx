'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getOrCreateUser } from '@/lib/user-store';
import { Send, Clock, Shield, Terminal, Activity, Wifi } from 'lucide-react';

export default function MuroPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [user, setUser] = useState<any>(null);
  const [sala, setSala] = useState<any>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMsg, setNuevoMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = getOrCreateUser();
    setUser(userData);
    fetchDatos();

    const channel = supabase
      .channel(`realtime_sala_${slug}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensajes',
        filter: `sala_id=eq.${sala?.id}` // Filtro opcional si tenés el ID
      }, (payload) => {
        setMensajes((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [slug, sala?.id]);

  async function fetchDatos() {
    const { data: salaData } = await supabase.from('salas').select('*').eq('slug', slug).single();
    if (salaData) {
      setSala(salaData);
      const { data: msgs } = await supabase
        .from('mensajes')
        .select('*')
        .eq('sala_id', salaData.id)
        .order('created_at', { ascending: false });
      if (msgs) setMensajes(msgs);
    }
    setLoading(false);
  }

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoMsg.trim() || !user || !sala) return;
    const msgAEnviar = nuevoMsg;
    setNuevoMsg('');

    const { error } = await supabase.from('mensajes').insert([{
      sala_id: sala.id,
      autor_uuid: user.id,
      autor_nick: user.nick,
      contenido: msgAEnviar
    }]);
    if (error) alert("Error: " + error.message);
  }

  if (loading) return <div className="h-screen bg-[#0F172A] flex items-center justify-center font-mono text-blue-500 animate-pulse uppercase tracking-[0.3em]">Cargando Sistema...</div>;
  if (!sala) return <div className="h-screen bg-[#0F172A] flex items-center justify-center text-white font-mono">Error 404: Muro inexistente</div>;

  return (
    <main className="min-h-screen bg-[#060B16] text-white flex flex-col items-center overflow-hidden">
      <div className="max-w-md w-full flex flex-col h-screen border-x border-white/5 shadow-2xl shadow-blue-900/20">
        
        {/* HEADER TIPO HUD */}
        <header className="p-5 border-b border-white/10 bg-[#0F172A]/90 backdrop-blur-xl">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        <h1 className="text-lg font-black uppercase tracking-tighter text-blue-400">{sala.nombre}</h1>
                    </div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Activity className="w-2 h-2" /> Server Status: Online
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-lg text-[9px] font-black border border-blue-400/20 uppercase tracking-widest">
                        {user?.nick}
                    </span>
                    <span className="text-[7px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">ID: {user?.id.substring(0,8)}</span>
                </div>
            </div>
        </header>

        {/* ÁREA DE MENSAJES (Scroll Inverso) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col-reverse scrollbar-hide">
            <div ref={scrollRef} />
            {mensajes.map((m) => (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-2 mb-1.5 opacity-80">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-tighter uppercase ${m.autor_uuid === user?.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-300'}`}>
                            {m.autor_nick}
                        </span>
                        <span className="text-[7px] text-slate-600 font-bold">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className={`p-4 rounded-2xl rounded-tl-none max-w-[92%] text-[13px] leading-relaxed shadow-sm ${m.autor_uuid === user?.id ? 'bg-blue-600/15 border border-blue-500/20 text-blue-50' : 'bg-white/5 border border-white/5 text-slate-300'}`}>
                        {m.contenido}
                    </div>
                </div>
            ))}

            {/* Aviso de Privacidad Estilo Terminal */}
            <div className="bg-blue-900/10 border border-blue-500/10 p-6 rounded-[2.5rem] text-center mb-8 border-dashed">
                <Shield className="w-6 h-6 text-blue-500/50 mx-auto mb-3" />
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Encriptación de Sesión</p>
                <p className="text-[9px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
                    Este muro es efímero. Los registros se purgan automáticamente cada 24 horas. <br/> Sin rastro, sin archivos.
                </p>
            </div>
        </div>

        {/* INPUT BAR (Flotante sobre el nuevo footer) */}
        <div className="p-4 bg-[#0F172A] border-t border-white/5">
            <form onSubmit={enviarMensaje} className="flex gap-2">
                <input 
                    value={nuevoMsg}
                    onChange={(e) => setNuevoMsg(e.target.value)}
                    placeholder="Escribí un mensaje..."
                    className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500/50 text-sm placeholder:text-slate-700 transition-all font-medium"
                />
                <button className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl active:scale-90 transition-all shadow-xl shadow-blue-900/20">
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>

        {/* NUEVO MURO-FOOTER ESPECÍFICO */}
        <footer className="px-6 py-3 bg-[#060B16] flex justify-between items-center border-t border-white/5">
            <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-1">
                    <Terminal className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">CUANTOES_CORE_V1</span>
                </div>
                <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-emerald-950" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Realtime Active</span>
                </div>
            </div>
            <div>
                <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
                    Developed by <span className="text-slate-500">Diego Schramm</span>
                </p>
            </div>
        </footer>

      </div>
    </main>
  );
}