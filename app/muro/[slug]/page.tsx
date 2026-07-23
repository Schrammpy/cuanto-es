'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getOrCreateUser } from '@/lib/user-store';
import { useRouter } from 'next/navigation';
import { ThinkingOrb } from 'thinking-orbs';
import { 
  Send, MessageSquare, LayoutList, Users, 
  ArrowLeft, Clock, Shield, AlertTriangle, Terminal, Activity, ChevronRight, Lock
} from 'lucide-react';

type Vista = 'LOBBY' | 'MURO' | 'CHAT';

export default function MuroInmersivo({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [view, setView] = useState<Vista>('LOBBY');
  const [user, setUser] = useState<any>(null);
  const [sala, setSala] = useState<any>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMsg, setNuevoMsg] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExitWarning, setShowExitWarning] = useState(false);

  // --- LÓGICA DEL BOTÓN ATRÁS ---
  useEffect(() => {
    if (view !== 'LOBBY') {
      window.history.pushState({ view }, "");
    }
    const handleBackButton = (event: PopStateEvent) => {
      if (view !== 'LOBBY') {
        event.preventDefault();
        setView('LOBBY');
      }
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [view]);

  useEffect(() => {
    const userData = getOrCreateUser();
    setUser(userData);
    fetchSala(userData);
  }, [slug]);

  useEffect(() => {
    if (sala && view !== 'LOBBY') {
      fetchMensajes();
    }
  }, [view, sala]);

  async function fetchSala(currentUser: any) {
    const { data } = await supabase.from('salas').select('*').eq('slug', slug).single();
    if (data) {
      setSala(data);
      setupRealtime(data.id, currentUser);
    }
    setLoading(false);
  }

  function setupRealtime(salaId: string, currentUser: any) {
    const msgChannel = supabase.channel(`mensajes_${slug}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensajes', 
        filter: `sala_id=eq.${salaId}` 
      }, (p) => {
        setMensajes(prev => {
            if (prev.find(m => m.id === p.new.id)) return prev;
            return [p.new, ...prev];
        });
      })
      .subscribe();

    const presenceChannel = supabase.channel(`presencia_${slug}`);
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        setUserCount(Object.keys(presenceChannel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user: currentUser.nick, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(presenceChannel);
    };
  }

  async function fetchMensajes() {
    const isChat = view === 'CHAT';
    const { data } = await supabase.from('mensajes')
      .select('*')
      .eq('sala_id', sala.id)
      .eq('es_chat', isChat)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setMensajes(data);
  }

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoMsg.trim() || !user || !sala) return;
    const texto = nuevoMsg;
    setNuevoMsg('');
    const { error } = await supabase.from('mensajes').insert([{
      sala_id: sala.id, autor_uuid: user.id, autor_nick: user.nick, contenido: texto, es_chat: view === 'CHAT'
    }]);
    if (error) alert("Error: " + error.message);
  }

  // --- PANTALLA DE CARGA CON ORB ---
  if (loading) return (
    <div className="h-screen bg-[#060B16] flex flex-col items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center gap-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl scale-150"></div>
          <ThinkingOrb state="searching" size={64} speed={1} theme="dark" />
        </div>
        <div className="text-center space-y-3">
          <p className="font-mono text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">INGRESANDO AL PUNTO</p>
          <div className="w-32 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500 w-full -translate-x-full animate-[progress_2s_infinite]"></div>
          </div>
        </div>
      </div>
      <style jsx>{` @keyframes progress { 0% { transform: translateX(-100%); } 50% { transform: translateX(0); } 100% { transform: translateX(100%); } } `}</style>
    </div>
  );

  if (!sala) return <div className="h-screen bg-[#060B16] flex items-center justify-center text-white italic text-xs uppercase tracking-widest text-center px-10 leading-relaxed">404: PUNTO NO ENCONTRADO EN EL SISTEMA</div>;

  const brandColor = sala.color_hex || '#2563EB';
  const isPremium = sala.es_premium;

  // --- VISTA: LOBBY ---
  if (view === 'LOBBY') {
    const waLink = "https://api.whatsapp.com/send?phone=595992685363&text=Hola%2C%20estoy%20interesado%20en%20tener%20mi%20propio%20muro%2Fchat%20privado%2C%20como%20puedo%20hacer%3F";

    return (
      <main className="min-h-screen bg-[#060B16] text-white p-6 flex flex-col items-center justify-center space-y-10">
        <header className="text-center space-y-4">
            {sala.logo_url && <img src={sala.logo_url} alt="Logo" className="h-24 w-auto mx-auto mb-4 animate-in zoom-in-50 duration-700 object-contain rounded-2xl" />}
            <h1 className="text-3xl font-[900] text-slate-100 italic leading-tight uppercase tracking-tighter">{sala.nombre}</h1>
            <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-ping bg-emerald-500"></div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">Punto Activo</p>
            </div>
        </header>

        <div className="w-full max-w-xs space-y-4">
            <button onClick={() => setView('MURO')} className="w-full bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <LayoutList className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: brandColor }} />
                <div className="text-center">
                    <span className="block font-black uppercase text-sm tracking-tight text-slate-200">{sala.welcome_text || 'Muro de comentarios'}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">Historial de 7 días</span>
                </div>
            </button>

            <button onClick={() => setView('CHAT')} className="w-full bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-white/10 transition-all group relative">
                <div className="absolute top-4 right-6 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    <Users className="w-2.5 h-2.5" style={{ color: brandColor }} />
                    <span className="text-[8px] font-black" style={{ color: brandColor }}>{userCount}</span>
                </div>
                <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: brandColor }} />
                <div className="text-center">
                    <span className="block font-black uppercase text-sm tracking-tight text-slate-200">Chat en Vivo</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">Borrado cada 24hs</span>
                </div>
            </button>
        </div>

        <footer className="w-full max-w-xs flex flex-col items-center gap-10 pt-6">
            {isPremium ? (
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center space-y-4 shadow-2xl">
                    <div className="flex justify-center gap-2 mb-1">
                        <Lock className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Canal Directo y Privado</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-200 leading-relaxed italic px-2">
                        "Tu opinión es el motor de nuestra mejora. Sentite libre de compartir tus sugerencias, tips o felicitaciones de forma 100% anónima y segura."
                    </p>
                    <div className="pt-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-white/5 pt-3">
                            ¡Tu aporte suma muchísimo!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-10">
                    <div className="text-center px-4">
                        <p className="text-[8px] text-slate-500 uppercase leading-relaxed font-bold tracking-tighter">
                            Al utilizar este punto, aceptás los <a href="/legal" className="underline text-blue-500">términos de uso</a>. 
                            Los mensajes son públicos y anónimos. La plataforma no se hace responsable por lo vertido.
                        </p>
                    </div>
                    <div className="text-center space-y-4">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-tight px-6">¿Querés contar con tu propio muro o chat privado?</p>
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-5 py-2.5 rounded-xl border border-blue-500/20 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                            <MessageSquare className="w-3.5 h-3.5" /> Contactame
                        </a>
                    </div>
                    <button onClick={() => setShowExitWarning(true)} className="group flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity border-t border-white/5 pt-6 w-full justify-center">
                        <Terminal className="w-3 h-3 text-slate-500" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Powered by CuantoEs.py</span>
                    </button>
                </div>
            )}
        </footer>

        {showExitWarning && <ExitModal onConfirm={() => router.push('/')} onCancel={() => setShowExitWarning(false)} />}
      </main>
    );
  }

  // --- VISTA: MURO O CHAT ---
  return (
    <main className={`min-h-screen bg-[#060B16] text-white flex flex-col h-screen overflow-hidden`}>
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl z-50">
        <button onClick={() => setView('LOBBY')} className="p-2 bg-white/5 rounded-xl text-slate-400 active:scale-90 transition-all"><ArrowLeft className="w-5 h-5" /></button>
        <div className="text-center flex-1 mx-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] leading-none" style={{ color: brandColor }}>{view}</h2>
            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 italic tracking-widest truncate max-w-[150px] mx-auto">{sala.nombre}</p>
        </div>
        <div className="bg-blue-600/20 px-3 py-2 rounded-xl text-[10px] font-black border border-blue-500/30 shrink-0" style={{ color: brandColor }}>{user?.nick}</div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col-reverse scrollbar-hide">
        {mensajes.map((m) => (
            <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${m.autor_uuid === user?.id ? 'text-blue-400' : 'text-slate-500'}`} style={{ color: m.autor_uuid === user?.id ? brandColor : '#64748b' }}>
                        {m.autor_nick}
                    </span>
                    <span className="text-[7px] text-slate-700 font-bold uppercase">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`p-4 rounded-2xl rounded-tl-none max-w-[95%] text-sm font-medium leading-relaxed ${m.autor_uuid === user?.id ? 'bg-white/10 border border-white/10 text-white' : 'bg-white/5 border border-white/5 text-slate-300'}`}>
                    {m.contenido}
                </div>
            </div>
        ))}
        
        <div className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] text-center mb-6 border-dashed">
            <Shield className="w-5 h-5 text-slate-600 mx-auto mb-2" />
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest text-pretty px-4 italic leading-relaxed">
                {isPremium 
                    ? 'Este es un espacio de escucha activa para mejorar nuestro servicio.' 
                    : view === 'CHAT' 
                        ? 'Este chat es efímero y se borra cada 24hs.' 
                        : 'Este muro es comunitario y se borra cada 7 días.'
                }
            </p>
        </div>
      </div>

      <div className="p-4 bg-black/60 border-t border-white/5 pb-8">
        <form onSubmit={enviarMensaje} className="flex gap-2">
            <input value={nuevoMsg} onChange={e => setNuevoMsg(e.target.value)} placeholder={view === 'CHAT' ? "Escribí en vivo..." : "Dejá un tip o saludo..."} className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-sm font-medium focus:border-blue-500/50 transition-all text-white" />
            <button className="p-4 rounded-2xl active:scale-90 transition-all shadow-lg" style={{ backgroundColor: brandColor }}><Send className="w-5 h-5" /></button>
        </form>
      </div>
    </main>
  );
}

function ExitModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onCancel}></div>
            <div className="bg-[#0A101F] border border-white/10 p-8 rounded-[3rem] w-full max-w-sm relative z-10 shadow-2xl text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-black uppercase tracking-tighter mb-2">¿Saliendo del Punto?</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-8 font-medium px-4">Para volver a entrar a este espacio deberás <span className="text-white font-bold italic underline decoration-red-500">escanear el código QR</span> nuevamente.</p>
                <div className="space-y-3">
                    <button onClick={onConfirm} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-900/40">SÍ, IR AL INICIO</button>
                    <button onClick={onCancel} className="w-full bg-transparent text-slate-500 font-bold py-2 text-[10px] uppercase tracking-widest">ME QUEDO ACÁ</button>
                </div>
            </div>
        </div>
    );
}