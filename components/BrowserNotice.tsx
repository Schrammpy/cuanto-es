'use client';
import React, { useEffect, useState } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';

export default function BrowserNotice() {
  const [isInApp, setIsInApp] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Detectamos si el User Agent contiene marcas de Facebook o Instagram
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isFacebook = ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1;
    const isInstagram = ua.indexOf("Instagram") > -1;
    
    if (isFacebook || isInstagram) {
      setIsInApp(true);
    }
  }, []);

  if (!isInApp || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[100] p-4 animate-in slide-in-from-top duration-500">
      <div className="bg-blue-600 text-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 border border-blue-400">
        <div className="bg-white/20 p-2 rounded-xl shrink-0">
          <Info className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <p className="text-[11px] font-bold leading-tight uppercase tracking-widest mb-1">
            Mejorá tu experiencia
          </p>
          <p className="text-xs font-medium leading-relaxed opacity-90">
            Estás en el navegador de Facebook. Para que los iconos y el envío a WhatsApp funcionen al 100%, tocá los <strong>tres puntitos (...)</strong> y elegí <strong>"Abrir en el navegador"</strong>.
          </p>
        </div>

        <button onClick={() => setIsVisible(false)} className="text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}