'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getOrCreateUser } from '@/lib/user-store';
import { Send, Clock, Users, Shield, MessageSquare } from 'lucide-react';
import Footer from '@/components/Footer';

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

    // ESCUCHAR EN TIEMPO REAL (WebSockets)
    const channel = supabase
      .channel(`realtime_sala_${slug}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensajes' 
      }, (payload) => {
        // Solo agregamos el mensaje si pertenece a esta sala
        setMensajes((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [slug]);

  async function fetchDatos() {
    // 1. Buscar la sala
    const { data: salaData } = await supabase.from('salas').select('*').eq('slug', slug).single();
    
    if (salaData) {
      setSala(salaData);
      // 2. Traer mensajes de las últimas 24hs
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
    setNuevoMsg(''); // Limpiamos rápido para dar sensación de velocidad

    const { error } = await supabase.from('mensajes').insert([{
      sala_id: sala.id,
      autor_uuid: user.id,
      autor_nick: user.nick,
      contenido: msgAEnviar
    }]);

    if (error) alert("Error al enviar: " + error.message);
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-400 animate-pulse uppercase tracking-widest">Buscando Muro...</div>;
  if (!sala) return <div className="h-screen flex items-center justify-center font-bold">Muro no encontrado 404</div>;

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center">
      <div className="max-w-md w-full flex flex-col h-screen">
        
        {/* HEADER ESTILO LOBBY */}
        <header className="p-6 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-blue-400 leading-none">{sala.nombre}</h1>
                    <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Sala Efímera (24hs)</span>
                    </div>
                </div>
                <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black border border-blue-400/30">
                    {user?.nick}
                </div>
            </div>
        </header>

        {/* INPUT FIJO ARRIBA (Estilo moderno) */}
        <div className="p-4 bg-slate-800/50 border-b border-white/5">
            <form onSubmit={enviarMensaje} className="flex gap-2">
                <input 
                    value={nuevoMsg}
                    onChange={(e) => setNuevoMsg(e.target.value)}
                    placeholder="Escribí algo aquí..."
                    className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl outline-none focus:border-blue-500 text-sm placeholder:text-slate-600 font-medium"
                />
                <button className="bg-blue-600 hover:bg-blue-500 p-3 rounded-2xl active:scale-90 transition-all shadow-lg shadow-blue-600/20">
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>

        {/* LISTA DE MENSAJES (Scroll inverso) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col-reverse">
            <div ref={scrollRef} /> {/* Ancla para el scroll */}
            {mensajes.map((m) => (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${m.autor_uuid === user?.id ? 'bg-blue-600 text-white' : 'bg-white/10 text-blue-400'}`}>
                            {m.autor_nick} {m.autor_uuid === user?.id && '(Vos)'}
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className={`p-4 rounded-3xl rounded-tl-none max-w-[90%] text-sm font-medium leading-relaxed ${m.autor_uuid === user?.id ? 'bg-blue-600/10 border border-blue-600/20 text-blue-50' : 'bg-white/5 border border-white/5 text-slate-300'}`}>
                        {m.contenido}
                    </div>
                </div>
            ))}

            {/* Mensaje de bienvenida/instrucciones */}
            <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-[2.5rem] text-center mb-4">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-3 opacity-50" />
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Muro 100% Anónimo</p>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    Este espacio es libre. Los mensajes se borran solos cada 24 horas. ¡Sé buena onda con los demás!
                </p>
            </div>
        </div>

        <div className="p-4 opacity-50 bg-[#0F172A]">
            <Footer />
        </div>
      </div>
    </main>
  );
}