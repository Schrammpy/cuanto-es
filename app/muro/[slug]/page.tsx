'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getOrCreateUser } from '@/lib/user-store';
import { useRouter } from 'next/navigation';
import { 
  Send, MessageSquare, LayoutList, Users, 
  ArrowLeft, Clock, Shield, AlertTriangle, Terminal, Activity, ChevronRight 
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
    if (view !== 'LOBBY') window.history.pushState({ view }, "");
    const handleBackButton = (event: PopStateEvent) => {
      if (view !== 'LOBBY') { event.preventDefault(); setView('LOBBY'); }
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
    if (sala && view !== 'LOBBY') fetchMensajes();
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
    supabase.channel(`mensajes_${slug}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes', filter: `sala_id=eq.${salaId}` }, (p) => {
        setMensajes(prev => prev.find(m => m.id === p.new.id) ? prev : [p.new, ...prev]);
    }).subscribe();

    const presenceChannel = supabase.channel(`presencia_${slug}`);
    presenceChannel.on('presence', { event: 'sync' }, () => {
        setUserCount(Object.keys(presenceChannel.presenceState()).length);
    }).subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await presenceChannel.track({ user: currentUser.nick, online_at: new Date().toISOString() });
    });
  }

  async function fetchMensajes() {
    const { data } = await supabase.from('mensajes').select('*').eq('sala_id', sala.id).eq('es_chat', view === 'CHAT').order('created_at', { ascending: false }).limit(50);
    if (data) setMensajes(data);
  }

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoMsg.trim() || !user || !sala) return;
    const { error } = await supabase.from('mensajes').insert([{ sala_id: sala.id, autor_uuid: user.id, autor_nick: user.nick, contenido: nuevoMsg, es_chat: view === 'CHAT' }]);
    if (!error) setNuevoMsg('');
  }

  if (loading) return <div className="h-screen bg-[#060B16] flex items-center justify-center font-mono text-blue-500 animate-pulse uppercase tracking-[0.3em]">Inicializando...</div>;
  if (!sala) return <div className="h-screen bg-[#060B16] flex items-center justify-center text-white">404: Punto no encontrado</div>;

  // --- CONFIGURACIÓN DE SKIN DINÁMICA ---
  const brandColor = sala.color_hex || '#2563EB'; // Color por defecto si no es Pro
  const isPremium = sala.es_premium;

  // --- VISTA: LOBBY ---
  if (view === 'LOBBY') {
    return (
      <main className="min-h-screen bg-[#060B16] text-white p-6 flex flex-col items-center justify-center space-y-10">
        <header className="text-center space-y-4">
            {sala.logo_url && <img src={sala.logo_url} alt="Logo" className="h-16 mx-auto mb-4 animate-in zoom-in-50 duration-700" />}
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-100 italic leading-none">{sala.nombre}</h1>
            <div className="flex items-center justify-center gap-2" style={{ color: brandColor }}>
                <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: brandColor }}></div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">Punto Activo</p>
            </div>
        </header>

        <div className="w-full max-w-xs space-y-4">
            <button onClick={() => setView('MURO')} className="w-full bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <LayoutList className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: brandColor }} />
                <div className="text-center">
                    <span className="block font-black uppercase text-sm tracking-tight text-slate-200">{sala.welcome_text || 'Buzón de Sugerencias'}</span>
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

        <footer className="w-full max-w-xs flex flex-col items-center gap-8 pt-6">
            <div className="text-center px-4">
                <p className="text-[8px] text-slate-500 uppercase leading-relaxed font-bold tracking-tighter">
                    Espacio anónimo y efímero. Al usar este punto aceptás los <a href="/legal" className="underline">términos de uso</a>.
                </p>
            </div>

            {/* Solo mostramos la salida si NO es premium, o lo dejamos muy sutil */}
            {!isPremium && (
                <button onClick={() => setShowExitWarning(true)} className="group flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity border-t border-white/5 pt-6 w-full justify-center">
                    <Terminal className="w-3 h-3 text-slate-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Powered by CuantoEs.py</span>
                </button>
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
        <button onClick={() => setView('LOBBY')} className="p-2 bg-white/5 rounded-xl text-slate-400"><ArrowLeft className="w-5 h-5" /></button>
        <div className="text-center flex-1 mx-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] leading-none" style={{ color: brandColor }}>{view}</h2>
            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 italic tracking-widest truncate max-w-[150px] mx-auto">{sala.nombre}</p>
        </div>
        <div className="bg-white/5 px-3 py-2 rounded-xl text-[10px] font-black border border-white/10 shrink-0" style={{ color: brandColor }}>{user?.nick}</div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col-reverse scrollbar-hide">
        {mensajes.map((m) => (
            <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: m.autor_uuid === user?.id ? brandColor : '#64748b' }}>{m.autor_nick}</span>
                    <span className="text-[7px] text-slate-700 font-bold uppercase">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`p-4 rounded-2xl rounded-tl-none max-w-[95%] text-sm font-medium leading-relaxed ${m.autor_uuid === user?.id ? 'bg-white/10 border border-white/10 text-white' : 'bg-white/5 border border-white/5 text-slate-300'}`}>
                    {m.contenido}
                </div>
            </div>
        ))}
      </div>

      <div className="p-4 bg-black/60 border-t border-white/5 pb-8">
        <form onSubmit={enviarMensaje} className="flex gap-2">
            <input value={nuevoMsg} onChange={e => setNuevoMsg(e.target.value)} placeholder="Escribí aquí..." className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-sm font-medium text-white" />
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
                <p className="text-xs text-slate-400 leading-relaxed mb-8 font-medium px-4">Para volver a este espacio deberás escanear el código QR nuevamente.</p>
                <div className="space-y-3">
                    <button onClick={onConfirm} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-900/40">SÍ, IR AL INICIO</button>
                    <button onClick={onCancel} className="w-full bg-transparent text-slate-500 font-bold py-2 text-[10px] uppercase tracking-widest">ME QUEDO ACÁ</button>
                </div>
            </div>
        </div>
    );
}