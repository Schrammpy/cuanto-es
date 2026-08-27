'use client';
import React from 'react';
import Link from 'next/link';
// Cambiamos el nombre del icono para asegurar compatibilidad
import { ShieldCheck, Mail, Linkedin, Info, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* COLUMNA 1: MARCA */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg rotate-3">
              <span className="text-white font-black text-[10px]">Gs.</span>
            </div>
            <span className="text-white font-black tracking-tighter text-xl uppercase">CuantoEs</span>
          </div>
          <p className="text-[10px] leading-relaxed opacity-60 uppercase font-bold tracking-widest">
            Referencia de costos y servicios en Paraguay. <br/> Cuentas claras, amistades largas.
          </p>
        </div>

        {/* COLUMNA 2: SERVICIOS */}
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Servicios</h3>
          <ul className="text-xs space-y-3 font-bold uppercase tracking-tight">
            <li><Link href="/servicios/pintura" className="hover:text-blue-400 transition-colors">Pintura de Casas</Link></li>
            <li><Link href="/servicios/aire" className="hover:text-blue-400 transition-colors">Instalación de Aire</Link></li>
            <li><Link href="/servicios/fletes" className="hover:text-blue-400 transition-colors">Fletes y Mudanzas</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: HERRAMIENTAS */}
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Herramientas</h3>
          <ul className="text-xs space-y-3 font-bold uppercase tracking-tight">
            <li><Link href="/divisor" className="hover:text-blue-400 transition-colors">Dividir Gastos</Link></li>
            <li><Link href="/multas" className="hover:text-blue-400 transition-colors">Multas de Tránsito</Link></li>
            <li><Link href="/delivery/crear" className="hover:text-blue-400 transition-colors">CuantoEs Business</Link></li>
          </ul>
        </div>

        {/* COLUMNA 4: CONTACTO */}
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Contacto</h3>
          <div className="flex flex-col items-center md:items-start gap-4">
            <a href="mailto:info@cuantoes.com.py" className="flex items-center gap-2 text-xs hover:text-white transition-colors font-bold">
              <Mail className="w-4 h-4 text-blue-500" /> info@cuantoes.com.py
            </a>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/diegoschramm/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl hover:bg-blue-600 transition-all">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
              <Link href="/legal" className="p-2 bg-white/5 rounded-xl hover:bg-slate-700 transition-all">
                <ShieldCheck className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT FINAL */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
          © {currentYear} — CUANTOES.COM.PY
        </p>
        <div className="flex items-center gap-1.5 opacity-20">
          <Globe className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-widest">Hecho en Paraguay</span>
        </div>
      </div>
    </footer>
  );
}