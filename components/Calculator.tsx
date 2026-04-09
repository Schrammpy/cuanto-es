'use client';
import React, { useState, useEffect, useRef } from 'react';
import { track } from '@vercel/analytics'; // Importamos el rastreador de eventos
import { User, Fingerprint, PlusCircle, Users, Send, MessageSquare, Copy, FileText, Smartphone, Landmark } from 'lucide-react';

interface Gasto {
  concepto: string;
  monto: string;
}

export default function Calculator() {
  const [titular, setTitular] = useState('');
  const [banco, setBanco] = useState('');
  const [tipoAlias, setTipoAlias] = useState('CI');
  const [alias, setAlias] = useState('');
  const [gastos, setGastos] = useState<Gasto[]>([{ concepto: '', monto: '' }]);
  const [personas, setPersonas] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [cuotaFinal, setCuotaFinal] = useState('');

  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitular(localStorage.getItem('titular') || '');
    setBanco(localStorage.getItem('banco') || '');
    setTipoAlias(localStorage.getItem('tipoAlias') || 'CI');
    setAlias(localStorage.getItem('alias') || '');
  }, []);

  const formatMiles = (val: string) => {
    const num = val.replace(/\D/g, "");
    return num ? new Intl.NumberFormat('es-PY').format(parseInt(num)) : "";
  };

  const handleMontoChange = (index: number, val: string) => {
    const newGastos = [...gastos];
    newGastos[index].monto = formatMiles(val);
    setGastos(newGastos);
  };

  const agregarFila = () => {
    setGastos([...gastos, { concepto: '', monto: '' }]);
  };

  const handleTipoAliasChange = (tipo: string) => {
    setTipoAlias(tipo);
    if (tipo === 'CELULAR') {
      if (!alias.startsWith('+595')) setAlias('+595');
    } else if (alias === '+595') {
      setAlias('');
    }
  };

  const generarResumen = () => {
    if (!titular || !banco || !alias || !personas) {
      alert("⚠️ ¡E'a! Completá todos los datos de cobro y personas");
      return;
    }

    let total = 0;
    let desgloseTexto = "";
    gastos.forEach(g => {
      const m = parseInt(g.monto.replace(/\./g, "") || "0");
      if (m > 0) {
        total += m;
        desgloseTexto += `• ${g.concepto || 'Varios'} : ${formatMiles(m.toString())} Gs.\n`;
      }
    });

    if (total === 0) {
      alert("⚠️ Agregá al menos un monto de gasto");
      return;
    }

    const cuota = Math.round(total / parseInt(personas));
    const cuotaStr = formatMiles(cuota.toString());
    setCuotaFinal(cuotaStr);

    const msg = `📊 *RESUMEN DE GASTOS*\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `${desgloseTexto}` +
                `💰 *TOTAL:* ${formatMiles(total.toString())} Gs.\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `👥 *PERSONAS:* ${personas}\n` +
                `💵 *CADA UNO:* ${cuotaStr} Gs.\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `🏦 *BANCO:* ${banco}\n` +
                `👤 *TITULAR:* ${titular}\n` +
                `🆔 *ALIAS ${tipoAlias}:* \`${alias}\` \n` +
                `(mantener presionado para copiar)\n\n` +
                `✅ *¡Favor enviar comprobante!*\n\n` +
                `_Calculado en CuantoEs.com.py_`;

    setResultado(msg);
    
    localStorage.setItem('titular', titular);
    localStorage.setItem('banco', banco);
    localStorage.setItem('tipoAlias', tipoAlias);
    localStorage.setItem('alias', alias);
    
    setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // --- FUNCIONES CON RASTREO (TRACKING) ---

  const compartirWpp = () => {
    if (resultado) {
         // ESTO ENVÍA EL EVENTO A GOOGLE ANALYTICS GRATIS
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'enviar_whatsapp', {
          'banco_destino': banco,
          'monto_cuota': cuotaFinal
        });
      }

      // Rastreamos quién envía al WhatsApp y qué banco usa
      track('enviar_whatsapp', { 
        banco_destino: banco,
        monto_cuota: cuotaFinal 
      });
      window.open(`https://wa.me/?text=${encodeURIComponent(resultado)}`, '_blank');
    }
  };

  const copiarSoloAlias = () => {
    track('copiar_solo_alias');
    navigator.clipboard.writeText(alias);
    alert("✅ Alias copiado al portapapeles");
  };

  const copiarMensajeCompleto = () => {
    if (resultado) {
      track('copiar_mensaje_completo');
      navigator.clipboard.writeText(resultado);
      alert("✅ Resumen completo copiado");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm space-y-6 border border-slate-50">
      
      {/* SECCIÓN COBRO */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Donde recibís la plata</p>
        <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
          <User className="w-4 h-4 text-slate-400 mr-3" />
          <input 
            value={titular} 
            onChange={(e) => setTitular(e.target.value)}
            placeholder="Nombre del titular" 
            className="bg-transparent w-full outline-none font-semibold text-sm" 
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-slate-700">
          <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all">
            <Landmark className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <select 
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                className="bg-transparent w-full outline-none font-semibold text-sm text-slate-600 appearance-none cursor-pointer"
            >
                <option value="">¿Banco?</option>
                <option value="Ueno">Ueno</option><option value="Itaú">Itaú</option><option value="Continental">Continental</option>
                <option value="Eko">Eko</option><option value="Atlas">Atlas</option><option value="GNB">GNB</option>
                <option value="Familiar">Familiar</option><option value="Sudameris">Sudameris</option><option value="Basa">Basa</option>
                <option value="Vision">Vision</option><option value="BNF">BNF</option>
            </select>
          </div>
          <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
            <Smartphone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <select 
                value={tipoAlias}
                onChange={(e) => handleTipoAliasChange(e.target.value)}
                className="bg-transparent w-full outline-none font-semibold text-sm text-slate-600 appearance-none cursor-pointer"
            >
                <option value="CI">Alias CI</option>
                <option value="CELULAR">Alias Celular</option>
                <option value="RUC">Alias RUC</option>
                <option value="CORREO">Alias Correo</option>
            </select>
          </div>
        </div>
        <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
          <Fingerprint className="w-4 h-4 text-slate-400 mr-3" />
          <input 
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder={
              tipoAlias === 'CORREO' ? "ejemplo@correo.com" : 
              tipoAlias === 'CELULAR' ? "Nro de Celular" : 
              tipoAlias === 'RUC' ? "Nro de RUC" : "Nro de Cédula"
            } 
            className="bg-transparent w-full outline-none font-bold text-blue-600 text-sm" 
          />
        </div>
      </div>

      {/* SECCIÓN GASTOS */}
      <div className="space-y-3 pt-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 text-slate-700">Los Gastos</p>
        <div className="space-y-3">
          {gastos.map((gasto, index) => (
            <div key={index} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="bg-[#F1F5F9] p-3 rounded-2xl flex-1 text-slate-700">
                <input 
                  value={gasto.concepto}
                  onChange={(e) => {
                    const newGastos = [...gastos];
                    newGastos[index].concepto = e.target.value;
                    setGastos(newGastos);
                  }}
                  placeholder="¿Qué se compró?" 
                  className="bg-transparent w-full outline-none text-xs font-medium" 
                />
              </div>
              <div className="bg-[#F1F5F9] p-3 rounded-2xl w-32 flex items-center text-slate-700">
                <span className="text-[10px] text-slate-400 font-bold mr-1 shrink-0">Gs.</span>
                <input 
                  value={gasto.monto}
                  onChange={(e) => handleMontoChange(index, e.target.value)}
                  inputMode="numeric" 
                  placeholder="0" 
                  className="bg-transparent w-full outline-none text-xs font-bold text-right" 
                />
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={agregarFila} className="text-blue-600 text-[10px] font-bold flex items-center gap-1 px-1 mt-2 hover:underline transition-all">
          <PlusCircle className="w-3 h-3" /> AGREGAR OTRO GASTO
        </button>

        <div className="bg-[#F1F5F9] p-4 rounded-2xl flex items-center border-l-4 border-l-blue-600 mt-4 shadow-sm shadow-blue-50 text-slate-700">
          <Users className="w-4 h-4 text-slate-400 mr-3" />
          <input 
            value={personas}
            onChange={(e) => setPersonas(e.target.value)}
            type="number" 
            placeholder="¿Entre cuántos dividimos?" 
            className="bg-transparent w-full outline-none font-bold text-sm" 
          />
        </div>
      </div>

      {/* BOTÓN PRINCIPAL */}
      <button onClick={generarResumen} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all flex justify-center items-center gap-2">
          <span>Generar Resumen</span>
          <Send className="w-4 h-4" />
      </button>

      {/* ÁREA DE RESULTADOS */}
      {resultado && (
        <div ref={resultadoRef} id="resultado" className="space-y-4 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900 p-6 rounded-[2rem] text-center shadow-xl shadow-slate-200">
            <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 tracking-widest">Cada uno pone</p>
            <p className="text-3xl font-black text-white">{cuotaFinal} Gs.</p>
          </div>
          
          <button onClick={compartirWpp} className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all shadow-green-100">
            <MessageSquare className="w-5 h-5" /> Enviar al WhatsApp
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={copiarSoloAlias} className="bg-white border border-slate-200 p-3 rounded-xl text-[10px] font-bold text-slate-600 flex flex-col items-center gap-1 active:bg-slate-50 transition-colors">
              <Copy className="w-4 h-4 text-blue-500" /> SOLO EL ALIAS
            </button>
            <button onClick={copiarMensajeCompleto} className="bg-white border border-slate-200 p-3 rounded-xl text-[10px] font-bold text-slate-600 flex flex-col items-center gap-1 active:bg-slate-50 transition-colors">
              <FileText className="w-4 h-4 text-blue-500" /> EL MENSAJE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}