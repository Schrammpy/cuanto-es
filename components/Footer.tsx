'use client';
import React from 'react';
import Link from 'next/link';
import { Mail, Globe, MapPin, Database } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        
        {/* COLUMNA 1: MISIÓN Y BRANDING */}
        <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl rotate-3 shadow-lg shadow-blue-900/50">
              <span className="text-white font-black text-[12px]">Gs.</span>
            </div>
            <span className="text-white font-[900] tracking-tighter text-2xl uppercase">CuantoEs.py</span>
          </div>
          <p className="text-xs leading-relaxed opacity-80 font-medium max-w-sm text-pretty">
            El primer índice independiente de precios y servicios de Paraguay. 
            Construido para transparentar el mercado, conectar profesionales y eliminar las adivinanzas al momento de pagar.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Database className="w-3 h-3" /> Datos Verificados
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                <MapPin className="w-3 h-3" /> 100% Local
            </div>
          </div>
        </div>

        {/* COLUMNA 2: EL CREADOR Y CONTACTO */}
        <div className="space-y-6 text-center md:text-right flex flex-col items-center md:items-end">
          <div className="space-y-1">
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Desarrollo y Análisis</h3>
              <p className="text-sm font-bold text-slate-300">Diego Schramm</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <a href="mailto:info@cuantoes.com.py" className="flex items-center gap-2 text-xs hover:text-white transition-colors font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20">
              <Mail className="w-4 h-4 text-blue-500" /> info@cuantoes.com.py
            </a>
            
            <a href="https://www.linkedin.com/in/diegoschramm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs hover:text-white transition-colors font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20">
              {/* SVG MANUAL DE LINKEDIN */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              Conectar en LinkedIn
            </a>
          </div>
        </div>

      </div>

      {/* COPYRIGHT FINAL */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 text-center md:text-left">
          © {currentYear} — CUANTOES.COM.PY <br className="md:hidden" /> <span className="hidden md:inline">|</span> TODOS LOS DERECHOS RESERVADOS.
        </p>
        
        <div className="flex items-center gap-6">
            <Link href="/metodologia" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                Metodología
            </Link>
            <div className="flex items-center gap-1.5 opacity-20">
                <Globe className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Asunción, Paraguay</span>
            </div>
        </div>
      </div>
    </footer>
  );
}