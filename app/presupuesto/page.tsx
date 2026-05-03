'use client';
import React, { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';
import { 
  User, Wrench, Send, MessageSquare, PlusCircle, Landmark, 
  Smartphone, Fingerprint, Sparkles, UserCheck, Receipt, 
  Share2, ShieldCheck 
} from 'lucide-react';
import Footer from '@/components/Footer';

interface Item {
  desc: string;
  precio: string;
}

export default function PresupuestoPage() {
  const [profesional, setProfesional] = useState('');
  const [banco, setBanco] = useState('');
  const [tipoAlias, setTipoAlias] = useState('CI');
  const [alias, setAlias] = useState('');
  const [cliente, setCliente] = useState('');
  const [items, setItems] = useState<Item[]>([{ desc: '', precio: '' }]);
  const [resultado, setResultado] = useState<string | null>(null);

  useEffect(() => {
    setProfesional(localStorage.getItem('p_titular') || '');
    setBanco(localStorage.getItem('p_banco') || '');
    setTipoAlias(localStorage.getItem('p_tipoAlias') || 'CI');
    setAlias(localStorage.getItem('p_alias') || '');
  }, []);

  const formatGS = (val: string) => {
    const num = val.replace(/\D/g, "");
    return num ? new Intl.NumberFormat('es-PY').format(parseInt(num)) : "";
  };

  const handleMontoChange = (index: number, val: string) => {
    const newItems = [...items];
    newItems[index].precio = formatGS(val);
    setItems(newItems);
  };

  const handleTipoAliasChange = (tipo: string) => {
    setTipoAlias(tipo);
    if (tipo === 'CELULAR') {
      if (!alias.startsWith('+595')) setAlias('+595');
    } else {
      if (alias === '+595') setAlias('');
    }
  };

  const generar = () => {
    if (!profesional || !cliente || !items[0].precio || !banco || !alias) {
      alert("⚠️ ¡E'a! Completá todos los datos para generar un presupuesto pro.");
      return;
    }

    let total = 0;
    let tabla = "";
    items.forEach(i => {
      const p = parseInt(i.precio.replace(/\./g, "") || "0");
      if (p > 0) {
        total += p;
        tabla += `• ${i.desc || 'Servicio'}: ${i.precio} Gs.\n`;
      }
    });

    const msg = `📋 *PRESUPUESTO DE TRABAJO*\n━━━━━━━━━━━━━━━━━━\n👤 *De:* ${profesional}\n🤝 *Para:* ${cliente}\n📅 *Fecha:* ${new Date().toLocaleDateString('es-PY')}\n━━━━━━━━━━━━━━━━━━\n🛠 *DETALLE:*\n${tabla}━━━━━━━━━━━━━━━━━━\n💰 *TOTAL ESTIMADO:* ${formatGS(total.toString())} Gs.\n━━━━━━━━━━━━━━━━━━\n🏦 *DATOS DE PAGO/SEÑA:*\nBanco: ${banco}\nAlias ${tipoAlias}: \`${alias}\` \n\n✅ *Quedo atento a su confirmación.* \n\n_Generado en CuantoEs.com.py_`;
    
    setResultado(msg);
    
    localStorage.setItem('p_titular', profesional);
    localStorage.setItem('p_banco', banco);
    localStorage.setItem('p_tipoAlias', tipoAlias);
    localStorage.setItem('p_alias', alias);
    
    track('generar_presupuesto');

    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  // --- FUNCIÓN DE ENVÍO CON MEDICIÓN ---
  const enviarAlCliente = () => {
    if (resultado) {
      // 1. Medir en Google Analytics (Gratis)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'enviar_whatsapp', {
          'herramienta': 'presupuesto_profesional',
          'profesional': profesional
        });
      }

      // 2. Medir en Vercel Analytics
      track('enviar_presupuesto', { profesional });

      // 3. Abrir WhatsApp (Usamos api.whatsapp.com para mejor compatibilidad con Facebook)
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(resultado)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-10">
      <div className="max-w-md w-full space-y-6">
        
        <header className="text-center space-y-1">
            <h1 className="text-2xl font-[900] text-slate-800 tracking-tighter uppercase">
                Armar <span className="text-blue-600 italic">Presupuesto</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Herramienta para profesionales</p>
        </header>

        {/* MANUAL DE USO */}
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-[2rem] shadow-sm">
            <h3 className="text-blue-900 text-[10px] font-[800] uppercase tracking-widest mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> ¡Presupuestos Pro en segundos!
            </h3>
            <div className="space-y-4 text-slate-700">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-200 p-2 rounded-xl shrink-0"><UserCheck className="w-4 h-4 text-blue-700" /></div>
                    <p className="text-[11px] font-semibold leading-tight">Poné tus datos de cobro y el nombre del cliente.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-200 p-2 rounded-xl shrink-0"><Receipt className="w-4 h-4 text-blue-700" /></div>
                    <p className="text-[11px] font-semibold leading-tight">Cargá el detalle del trabajo y los materiales.</p>
                </div>
                <div className="flex items-center gap-4 text-blue-700">
                    <div className="bg-blue-600 p-2 rounded-xl shrink-0 text-white shadow-md shadow-blue-100"><Share2 className="w-4 h-4" /></div>
                    <p className="text-[11px] font-[800] leading-tight">¡Listo! Generá un presupuesto ideal para enviar a tu cliente.</p>
                </div>
            </div>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6">
            
            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tus Datos de Cobro</p>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <Wrench className="w-4 h-4 text-slate-400 mr-3" />
                    <input value={profesional} onChange={e=>setProfesional(e.target.value)} placeholder="Tu nombre o negocio" className="bg-transparent w-full outline-none font-bold text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all">
                        <Landmark className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <select value={banco} onChange={e=>setBanco(e.target.value)} className="bg-transparent w-full outline-none font-bold text-xs appearance-none cursor-pointer text-slate-600">
                            <option value="">¿Banco?</option>
                            <option value="Ueno">Ueno</option><option value="Itaú">Itaú</option><option value="Continental">Continental</option>
                            <option value="Eko">Eko</option><option value="Atlas">Atlas</option><option value="GNB">GNB</option>
                            <option value="Familiar">Familiar</option><option value="Sudameris">Sudameris</option><option value="Basa">Basa</option>
                            <option value="Vision">Vision</option><option value="BNF">BNF</option>
                        </select>
                    </div>
                    <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all">
                        <Smartphone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <select value={tipoAlias} onChange={e=>handleTipoAliasChange(e.target.value)} className="bg-transparent w-full outline-none font-bold text-xs appearance-none cursor-pointer text-slate-600">
                            <option value="CI">Alias CI</option><option value="RUC">Alias RUC</option><option value="CELULAR">Alias Celular</option><option value="CORREO">Alias Correo</option>
                        </select>
                    </div>
                </div>

                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <Fingerprint className="w-4 h-4 text-slate-400 mr-3" />
                    <input 
                        value={alias} 
                        onChange={e=>setAlias(e.target.value)} 
                        placeholder={
                            tipoAlias === 'CORREO' ? "ejemplo@correo.com" : 
                            tipoAlias === 'CELULAR' ? "Nro de Celular" : 
                            tipoAlias === 'RUC' ? "Nro de RUC" : "Nro de Cédula"
                        } 
                        className="bg-transparent w-full outline-none font-bold text-sm text-blue-600" 
                    />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-slate-700 border-t border-slate-50 pt-4">Detalle del Cliente</p>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <User className="w-4 h-4 text-slate-400 mr-3" />
                    <input value={cliente} onChange={e=>setCliente(e.target.value)} placeholder="Nombre del Cliente" className="bg-transparent w-full outline-none font-bold text-sm text-slate-700" />
                </div>

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-slate-700 pt-2">Trabajo y Materiales</p>
                {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <input placeholder="Ej: Mano de obra..." className="bg-[#F1F5F9] p-3 rounded-2xl flex-1 outline-none text-xs font-bold text-slate-700 focus:bg-white border border-transparent focus:border-slate-200 transition-all" onChange={e => {const n=[...items]; n[idx].desc=e.target.value; setItems(n)}} />
                        <div className="bg-[#F1F5F9] p-3 rounded-2xl w-28 flex items-center text-slate-700">
                            <span className="text-[10px] font-bold mr-1 opacity-40 uppercase tracking-tighter">Gs.</span>
                            <input placeholder="0" className="bg-transparent w-full outline-none text-xs font-bold text-right" value={item.precio} onChange={e => handleMontoChange(idx, e.target.value)} />
                        </div>
                    </div>
                ))}
                <button onClick={()=>setItems([...items, {desc:'', precio:''}])} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 px-1 hover:underline transition-all">
                    <PlusCircle className="w-3 h-3" /> Agregar ítem
                </button>
            </div>

            <button onClick={generar} className="w-full bg-blue-600 text-white font-[900] py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2 tracking-tighter">
                GENERAR PRESUPUESTO <Send className="w-4 h-4" />
            </button>

            {resultado && (
                <div className="pt-6 border-t border-slate-100 space-y-4 animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 p-6 rounded-[2rem] text-center shadow-xl">
                        <p className="text-blue-400 text-[10px] font-[900] uppercase mb-1 tracking-widest">Presupuesto Listo</p>
                        <p className="text-white text-xs font-medium italic opacity-70 leading-tight">Ya podés enviarlo al cliente por WhatsApp</p>
                    </div>
                    {/* CAMBIO AQUÍ: Llamamos a la nueva función enviarAlCliente */}
                    <button onClick={enviarAlCliente} className="w-full bg-[#25D366] text-white font-[900] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95">
                        <MessageSquare className="w-5 h-5" /> ENVIAR AL CLIENTE
                    </button>
                </div>
            )}
        </div>
        <Footer />
      </div>
    </main>
  );
}