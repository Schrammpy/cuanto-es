'use client';
import React, { useState } from 'react';
import { Beer, Copy, Check, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [showAlias, setShowAlias] = useState(false);
  const [copied, setCopied] = useState(false);

  const ALIAS_PAGO = "4409055"; // <--- TU ALIAS REAL

  const copiarAlias = () => {
    navigator.clipboard.writeText(ALIAS_PAGO);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Función para borrar los datos locales
  const borrarDatos = () => {
    const confirmar = confirm("¿Querés borrar tus datos de cobro guardados en este celular?");
    if (confirmar) {
      localStorage.removeItem('titular');
      localStorage.removeItem('banco');
      localStorage.removeItem('tipoAlias');
      localStorage.removeItem('alias');
      // Recargamos la página para que la calculadora se limpie visualmente
      window.location.reload();
    }
  };

  return (
    <footer className="mt-4 pb-16 px-4 flex flex-col items-center gap-8">
      
      {/* SECCIÓN DE GRATITUD */}
      <div className="w-full max-w-xs flex flex-col items-center">
        {!showAlias ? (
          <button 
            onClick={() => setShowAlias(true)}
            className="flex items-center gap-2 bg-amber-50 text-amber-700 px-5 py-2.5 rounded-full border border-amber-200 active:scale-95 transition-all shadow-sm"
          >
            <Beer className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Apoya al creador con un chopp</span>
          </button>
        ) : (
          <div className="bg-white border-2 border-amber-100 p-6 rounded-[2.5rem] w-full animate-in zoom-in-95 duration-300 shadow-xl shadow-amber-50 flex flex-col items-center border-dashed">
            <Heart className="w-5 h-5 text-red-500 mb-2 fill-red-500" />
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 text-center px-2 leading-relaxed italic">
                Tu apoyo ayuda a mantener la web.
            </p>
            
            <div className="flex items-center justify-between bg-slate-50 w-full p-3 rounded-2xl border border-slate-200">
                <div className="flex flex-col">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Alias para donacion</span>
                    <span className="text-sm font-black text-slate-800 leading-none">{ALIAS_PAGO}</span>
                </div>
                <button 
                    onClick={copiarAlias}
                    className="bg-amber-600 text-white p-2 rounded-xl active:scale-90 transition-all shadow-md shadow-amber-100"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            
            <button 
                onClick={() => setShowAlias(false)}
                className="mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
                Cerrar
            </button>
          </div>
        )}
      </div>

      {/* SECCIÓN DE PRIVACIDAD Y MARCA */}
      <div className="text-center space-y-5 px-6">
        <div className="flex items-center justify-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">Seguridad Garantizada</span>
        </div>
        
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-loose italic max-w-[320px] mx-auto">
            Esta herramienta no guarda tus datos, la información queda exclusivamente en tu dispositivo y la puedes borrar <button onClick={borrarDatos} className="text-red-500 underline decoration-red-200 underline-offset-2 hover:text-red-700 transition-colors">AQUÍ</button>.
        </p>

        <div className="space-y-1 pt-4 border-t border-slate-100 text-slate-600">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              2026 © CUANTOES.COM.PY
            </p>
            <p className="text-[8px] font-bold uppercase tracking-widest italic text-slate-500">
              Developed by <a 
                href="https://www.linkedin.com/in/diegoschramm/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-2 transition-colors"
              >
                DDSM
              </a> from Luque, Paraguay.
            </p>
        </div>
      </div>

    </footer>
  );
}